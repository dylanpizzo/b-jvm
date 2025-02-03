import MainModuleFactory from "../build/bjvm_main.js"
import type { MainModule } from "../build/bjvm_main.d.ts"

let module: MainModule;
let error: any;
let pending: {resolve: Function, reject: Function}[] = [];

async function loaded() {
    if (module)
        return;
    if (error)
        throw error;
    return new Promise((resolve, reject) => {
        pending.push({resolve, reject});
    });
}

const factory = MainModuleFactory();
factory.then((instantiated) => {
    module = instantiated;
});

interface VMOptions {
    classpath: string;
    stdout?: (byte: number) => void;
    stderr?: (byte: number) => void;
}

function buffered() {
    let buffer = "";
    return (byte: number) => {
        if (byte === 10) {
            console.log(buffer);
            buffer = "";
        } else {
            buffer += String.fromCharCode(byte);
        }
    }
}

type JavaType = {
    kind: 'L' | 'I' | 'F' | 'D' | 'J' | 'S' | 'B' | 'C' | 'Z' | 'V';
    className: string;
};

function readJavaType(vm: VM, addr: number, type: JavaType): any {
    switch (type.kind) {
        case "L":
            return vm.createHandle(module.getValue(addr, "i32"));
        case "I":
            return module.getValue(addr, "i32");
        case "F":
            return module.getValue(addr, "float");
        case "D":
            return module.getValue(addr, "double");
        case "J":
            return module.getValue(addr, "i64");
        case "S":
            return module.getValue(addr, "i16");
        case "B":
            return module.getValue(addr, "i8");
        case "C":
            return String.fromCharCode(module.getValue(addr, "i16"));
        case "Z":
            return module.getValue(addr, "i8") !== 0;
        default:
            throw new Error("Invalid java type: " + type)
    }
}

function explainObject(value: any) {
    if (value === null) {
        return "null";
    }
    if (typeof value === "object") {
        return value.constructor.name;
    }
    return typeof value;
}

function setJavaType(vm: VM, addr: number, type: JavaType, value: any) {
    switch (type.kind) {
        case "L":
            if (value === null) {
                module.setValue(addr, 0, "i32");
                return;
            }
            if (!(value instanceof BaseHandle)) {
                throw new TypeError("Expected BaseHandle, not " + explainObject(value));
            }
            let obj = module._bjvm_deref_js_handle(vm.ptr, value.handleIndex);
            module.setValue(addr, obj, "i32");
            return;
        case "I":
            module.setValue(addr, value, "i32");
            return;
        case "F":
            module.setValue(addr, value, "float");
            return;
            case "D":
            module.setValue(addr, value, "double");
            return;
            case "J":
            module.setValue(addr, value, "i64");
            return;
        case "S":
        module.setValue(addr, value, "i16");
        return;
        case "B":
        module.setValue(addr, value, "i8");
        return;
        case "C":
        module.setValue(addr, value.charCodeAt(0), "i16");
        return;
        case "Z":
        module.setValue(addr, value ? 1 : 0, "i8");
        return;
        default:
            throw new Error("Invalid java type: " + type)
}
}

type FieldInfo = {
    name: string;
    type: JavaType;
    accessFlags: number;
    byteOffset: number;
};

type ParsedMethodDescriptor = {
    returnType: JavaType;
    parameterTypes: JavaType[];
};

function makePrimitiveArrayName(descElement: string, dims: number) {
    return "[".repeat(dims) + descElement;
}

function makeArrayName(s: string, dims: number) {
    return "[".repeat(dims) + "L" + s;
}

function parseParameterType(desc: string, i: number, parameterTypes: JavaType[]) {
    let dims = 0;
    while (desc[i] === '[') {
        ++i;
        ++dims;
    }
    if (desc[i] == 'L') {
        let j = i + 1;
        while (desc[i] !== ';') {
            i++;
        }
        parameterTypes.push({ kind: 'L', className: makeArrayName(desc.substring(j, i), dims) } as JavaType);
    } else {
        parameterTypes.push(dims ?
            { kind: 'L', className: makePrimitiveArrayName(desc[i], dims) } :
            { kind: desc[i], className: "" } as JavaType);
    }
    i++;
    return i;
}

function parseMethodDescriptor(method: MethodInfo): ParsedMethodDescriptor {
    if (method.parsedDescriptor)
        return method.parsedDescriptor
    const desc = method.descriptor;
    let i = 1;
    let parameterTypes: JavaType[] = [];
    while (desc[i] !== ')') {
        i = parseParameterType(desc, i, parameterTypes);
    }
    const returnType: JavaType[] = [];
    if (desc[i + 1] === 'V') {
        returnType.push({ kind: 'V', className: "" });
    } else {
        parseParameterType(desc, i + 1, returnType);
    }
    return method.parsedDescriptor = { returnType: returnType[0]!, parameterTypes };
}

type MethodInfo = {
    name: string;
    descriptor: string;
    methodPointer: number;
    accessFlags: number;
    parameterNames: string[];
    index: number;
    parsedDescriptor?: ParsedMethodDescriptor;
};

type ClassInfo = {
    binaryName: string,
    fields: FieldInfo[],
    methods: MethodInfo[],
};

// Handle to a Java object
class BaseHandle {
    vm: VM;
    handleIndex: number;

    drop() {
        if (this.handleIndex === -1) {  // already dropped
            return;
        }
        this.vm.handleRegistry.unregister(this);
        module._bjvm_drop_js_handle(this.vm.ptr, this.handleIndex);
        this.handleIndex = -1;
    }
}

function binaryNameToJSName(name: string) {
    return name.replaceAll('/', "_");
}

function stringifyParameter(type: JavaType) {
    switch (type.kind) {
        case 'L':
            return type.className.replaceAll('/', "_");
        default:
            return type.kind;
    }
}

class OverloadResolver {
    grouped: Map<string /* method name */, Map<number /* argc */, MethodInfo[]> >;

    constructor() {
        this.grouped = new Map();
    }

    addMethod(method: MethodInfo) {
        if (!this.grouped.has(method.name)) {
            this.grouped.set(method.name, new Map());
        }
        let group = this.grouped.get(method.name);
        if (!group.has(method.parameterNames.length)) {
            group.set(method.parameterNames.length, []);
        }
        group.get(method.parameterNames.length).push(method);
    }

    flattenCollisions() {
        // For each method/argc combination with more than one possible method, generate a new method name
        // with the parameter types appended to it
        for (let [name, group] of this.grouped.entries()) {
            for (let [argc, methods] of group.entries()) {
                if (methods.length < 2) {
                    continue;
                }

                for (let i = 0; i < methods.length; ++i) {
                    let method = methods[i];
                    let desc = parseMethodDescriptor(method);
                    let newName = `${name}_$${desc.parameterTypes.map(stringifyParameter).join('$')}`;

                    this.grouped.set(newName, new Map([[argc, [method]]]));
                }

                group.delete(argc);
            }
        }
    }

    createImpls(classInfo: ClassInfo, static_: boolean): string {
        let impls: string[] = [];
        this.flattenCollisions();

        function escape(name: string) {
            return JSON.stringify(name);
        }

        // For each NAME, generate an implementation which checks the # of args, then calls the appropriate method
        for (let [name, group] of this.grouped.entries()) {
            const isCtor = name.startsWith("<init>");
            const staticLike = static_ || isCtor;
            const maybeStatic = staticLike ? 'static' : '';
            const maybeThis = staticLike ? '' : 'this,';
            const runner = isCtor ? "_runConstructor" : "_runMethod";
            let impl = `${maybeStatic} ${escape(name)} () {
                let i = 0;
                switch (arguments.length) {
                    ${[...group.entries()].map(([argc, method]) => {
                        const m = method[0];
                        return `case ${argc}: { i = ${m.index}; break; }`;
                    }).join('\n')}
                    default:
                    throw new RangeError("Invalid number of arguments (expected one of ${[...group.keys()].join(', ')}, got " + arguments.length + ")");
                }
                const thread = vm.createThread();
                return thread.${runner}(methods[i], ${maybeThis} ...arguments);
            }`;
            impls.push(impl);
        }

        return impls.join('\n');
    }

    createTSDefs() {

    }
}

interface HandleConstructor {
    new (): typeof BaseHandle;
}

function createClassImpl(vm: VM, bjvm_classdesc_ptr: number): HandleConstructor {
    const classInfoStr = module._bjvm_ffi_get_class_json(bjvm_classdesc_ptr);
    const info = module.UTF8ToString(classInfoStr);
    const classInfo: ClassInfo = JSON.parse(info);
    module._free(classInfoStr);

    const instanceResolver = new OverloadResolver();
    const staticResolver = new OverloadResolver();

    // Static methods
    for (let i = 0 ; i < classInfo.methods.length; ++i) {
        let method = classInfo.methods[i];
        if (!(method.accessFlags & 0x0001)) {
            continue;
        }
        if (method.accessFlags & 0x0008) {
            staticResolver.addMethod(method);
        } else {
            instanceResolver.addMethod(method);
        }
    }

    const cow = binaryNameToJSName(classInfo.binaryName);
    const body = `class ${cow} extends BaseHandle {
    ${instanceResolver.createImpls(classInfo, false)}
    ${staticResolver.createImpls(classInfo, true)}
    }; return ${cow}`;

    const Class = new Function("name", "BaseHandle", "vm", "methods", body)(classInfo.binaryName, BaseHandle, vm, classInfo.methods);
    Object.defineProperty(Class, 'name', { value: classInfo.binaryName });

    return Class;
}

class Thread {
    vm: VM;
    ptr: number;

    constructor(vm: VM, ptr: number) {
        this.vm = vm;
        this.ptr = ptr;
    }

    private async _runConstructor(method: MethodInfo, ...args: any[]): Promise<any> {
        const this_ = module._bjvm_ffi_allocate_object(this.ptr, method.methodPointer);
        if (!this_) {
            this.throwThreadException();
        }
        const handle = this.vm.createHandle(this_);
        await this._runMethod(method, handle, ...args);
        return handle;
    }

    private async _runMethod(method: MethodInfo, ...args: any[]): Promise<any> {
        let argsPtr = module._malloc(args.length * 8);
        let resultPtr = module._malloc(8);
        try {
            const parsed = parseMethodDescriptor(method);
            let isInstanceMethod = !(method.accessFlags & 0x0008);
            let j = 0;
            if (isInstanceMethod) {
                setJavaType(this.vm, argsPtr, { kind: 'L', className: "" }, args[0]);
                j++;
            }
            for (let i = 0; i < args.length - +isInstanceMethod; i++, j++) {
                setJavaType(this.vm, argsPtr + j * 8, parsed.parameterTypes[i], args[j]);
            }
            let ctx = module._bjvm_ffi_async_run(this.ptr, method.methodPointer, argsPtr);
            while (ctx && !module._bjvm_ffi_run_step(ctx, resultPtr)) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            this.throwThreadException();
            if (parsed.returnType.kind !== 'V') {
                return readJavaType(this.vm, resultPtr, parsed.returnType);
            }
        } finally {
            module._free(argsPtr);
            module._free(resultPtr);
        }
    }

    throwThreadException() {
        let ptr = module._bjvm_ffi_get_current_exception(this.ptr);
        if (!ptr) {
            return;
        }
        const handle = this.vm.createHandle(ptr);
        module._bjvm_ffi_clear_current_exception(this.ptr);
        throw handle;
    }

    async loadClass(name: string): Promise<any> {
        let namePtr = module._malloc(name.length + 1);
        new TextEncoder().encodeInto(name, new Uint8Array(module.HEAPU8.buffer, namePtr, name.length));
        module.HEAPU8[namePtr + name.length] = 0;
        let ptr = module._bjvm_ffi_get_class(this.ptr, namePtr);
        if (!ptr) {
            this.throwThreadException();
        }
        const clazz = this.vm.getClassForDescriptor(ptr);
        module._free(namePtr);
        return clazz;
    }
}

class VM {
    ptr: number;
    handleRegistry: FinalizationRegistry<BaseHandle> = new FinalizationRegistry((handle) => {
        module._bjvm_drop_js_handle(this.ptr, handle.handleIndex);
    });
    namedClasses: Map<number /* bjvm_classdesc* */, any> = new Map();
    cachedThread: Thread;

    private constructor(options: VMOptions) {
        let classpath = module._malloc(options.classpath.length + 1);
        new TextEncoder().encodeInto(options.classpath, new Uint8Array(module.HEAPU8.buffer, classpath, options.classpath.length));
        module.HEAPU8[classpath + options.classpath.length] = 0;

        options.stdout ??= buffered();
        options.stderr ??= buffered();

        this.ptr = module._bjvm_ffi_create_vm(classpath, module.addFunction(options.stdout, 'vii'), module.addFunction(options.stderr, 'vii'));
        module._free(classpath);
    }

    static async create(options: VMOptions) {
        await loaded();
        return new VM(options);
    }

    getClassForDescriptor(classdesc: number): any {
        if (this.namedClasses.has(classdesc)) {
            return this.namedClasses.get(classdesc);
        }

        const made = createClassImpl(this, classdesc);
        this.namedClasses.set(classdesc, made);
        return made;
    }

    createHandle(ptr: number) {
        if (ptr === 0) return null;

        let handleIndex = module._bjvm_make_js_handle(this.ptr, ptr);
        let classdesc = module._bjvm_ffi_get_classdesc(ptr);

        const clazz = this.getClassForDescriptor(classdesc);
        const handle = Object.create(clazz.prototype);  // do this to avoid calling the constructor
        handle.vm = this;
        handle.handleIndex = handleIndex;
        return handle;
    }

    createThread(): Thread {
        if (this.cachedThread) return this.cachedThread;

        let thread = module._bjvm_ffi_create_thread(this.ptr);
        return this.cachedThread = new Thread(this, thread);
    }

    async runMain(main: string, main2: string, param3: any[]) {
    }
}

const runtimeFilesList = `./jdk23/lib/modules
./jdk23.jar
./test_files/n_body_problem/NBodyProblem$Body.class
./test_files/n_body_problem/NBodyProblem.class`.split('\n');

const dbName = 'bjvm';

function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("FileStorageDB", 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBRequest).result as IDBDatabase;
            if (!db.objectStoreNames.contains(dbName)) {
                db.createObjectStore(dbName, { keyPath: "name" });
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBRequest).result as IDBDatabase);
        };

        request.onerror = (event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}

function addFile(db: IDBDatabase, name: string, data: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(dbName, "readwrite");
        const store = transaction.objectStore(dbName);

        const file = { name, data }; // Object with name and Uint8Array
        const request = store.add(file);

        request.onsuccess = () => resolve();
        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
}

function getFile(db: IDBDatabase, name: string): Promise<{ name: string; data: Uint8Array } | undefined> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(dbName, "readonly");
        const store = transaction.objectStore(dbName);

        const request = store.get(name);

        request.onsuccess = (event) => resolve((event.target as IDBRequest).result as { name: string; data: Uint8Array });
        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
}

const TOTAL_BYTES = 0;

async function installRuntimeFiles(baseUrl: string, progress?: (loaded: number, total: number) => void) {
    let totalLoaded = 0;

    const db = await openDatabase();

    // Spawn fetch requests
    const requests = runtimeFilesList.map(async (file) => {
        // Check whether the file is already in the database
        const cached = await getFile(db, file);
        if (cached) {
            totalLoaded += cached.data.length;
            progress?.(totalLoaded, TOTAL_BYTES);
            return {file, data: cached.data};
        }

        const response = await fetch(`${baseUrl}/${file}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/octet-stream',
            }
        });
        const contentLength = response.headers.get('Content-Length');
        const total = contentLength ? parseInt(contentLength) : 0;

        const reader = response.body?.getReader();
        let loaded = 0;
        const data = new Uint8Array(total);
        while (true) {
            const {done, value} = await reader.read();
            if (done)
                break;
            data.set(value, loaded);
            loaded += value.length;
            totalLoaded += value.length;
            progress?.(totalLoaded, TOTAL_BYTES);
        }
        // Insert into the DB
        await addFile(db, file, data);
        return {file, data};
    });

    // Wait for all requests to finish
    const results = await Promise.all(requests);

    // Wait for the WASM module to be done
    await factory;

    // Add to file system
    results.forEach(({file, data}) => {
        // make directories up to last /
        for (let i = 0; i < file.length; i++) {
            if (file[i] === '/') {
                const dir = file.substring(0, i);
                if (!module.FS.analyzePath(dir).exists)
                    module.FS.mkdir(dir, 0o777);
            }
        }
        module.FS.writeFile(file, data);
    });

    pending.forEach(p => p.resolve());
    pending.length = 0
}

export { VM, VMOptions, installRuntimeFiles, type HandleConstructor, BaseHandle, Thread };