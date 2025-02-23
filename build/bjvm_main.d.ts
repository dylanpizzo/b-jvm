// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    /**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Arguments|Array=} args
     * @param {Object=} opts
     */
    function ccall(ident: any, returnType?: (string | null) | undefined, argTypes?: any[] | undefined, args?: (Arguments | any[]) | undefined, opts?: any | undefined): any;
    let wasmMemory: any;
    /**
     * @param {string=} returnType
     * @param {Array=} argTypes
     * @param {Object=} opts
     */
    function cwrap(ident: any, returnType?: string | undefined, argTypes?: any[] | undefined, opts?: any | undefined): (...args: any[]) => any;
    /** @param {string=} sig */
    function addFunction(func: any, sig?: string | undefined): any;
    function removeFunction(index: any): void;
    let wasmTable: WebAssembly.Table;
    namespace FS {
        function init(): void;
        let ErrnoError: any;
        function handleError(returnValue: any): any;
        function ensureErrnoError(): void;
        function createDataFile(parent: any, name: any, fileData: any, canRead: any, canWrite: any, canOwn: any): void;
        function createPath(parent: any, path: any, canRead: any, canWrite: any): any;
        function createPreloadedFile(parent: any, name: any, url: any, canRead: any, canWrite: any, onload: any, onerror: any, dontCreateFile: any, canOwn: any, preFinish: any): any;
        function readFile(path: any, opts?: {}): Uint8Array;
        function cwd(): any;
        function analyzePath(path: any): {
            exists: boolean;
            object: {
                contents: any;
            };
        };
        function mkdir(path: any, mode: any): any;
        function mkdirTree(path: any, mode: any): any;
        function rmdir(path: any): any;
        function open(path: any, flags: any, mode?: number): any;
        function create(path: any, mode: any): any;
        function close(stream: any): any;
        function unlink(path: any): any;
        function chdir(path: any): any;
        function read(stream: any, buffer: any, offset: any, length: any, position: any): any;
        function write(stream: any, buffer: any, offset: any, length: any, position: any, canOwn: any): any;
        function allocate(stream: any, offset: any, length: any): any;
        function writeFile(path: any, data: any): any;
        function mmap(stream: any, length: any, offset: any, prot: any, flags: any): {
            ptr: any;
            allocated: boolean;
        };
        function msync(stream: any, bufferPtr: any, offset: any, length: any, mmapFlags: any): any;
        function munmap(addr: any, length: any): any;
        function symlink(target: any, linkpath: any): any;
        function readlink(path: any): any;
        function statBufToObject(statBuf: any): {
            dev: any;
            mode: any;
            nlink: any;
            uid: any;
            gid: any;
            rdev: any;
            size: any;
            blksize: any;
            blocks: any;
            atime: any;
            mtime: any;
            ctime: any;
            ino: any;
        };
        function stat(path: any): any;
        function lstat(path: any): any;
        function chmod(path: any, mode: any): any;
        function lchmod(path: any, mode: any): any;
        function fchmod(fd: any, mode: any): any;
        function utime(path: any, atime: any, mtime: any): any;
        function truncate(path: any, len: any): any;
        function ftruncate(fd: any, len: any): any;
        function findObject(path: any): {
            isFolder: boolean;
            isDevice: boolean;
        };
        function readdir(path: any): any;
        function mount(type: any, opts: any, mountpoint: any): any;
        function unmount(mountpoint: any): any;
        function mknod(path: any, mode: any, dev: any): any;
        function makedev(ma: any, mi: any): number;
        function registerDevice(dev: any, ops: any): void;
        function createDevice(parent: any, name: any, input: any, output: any): any;
        function mkdev(path: any, mode: any, dev: any): any;
        function rename(oldPath: any, newPath: any): any;
        function llseek(stream: any, offset: any, whence: any): any;
    }
    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */
    function UTF8ToString(ptr: number, maxBytesToRead?: number | undefined): string;
    /**
     * @param {number} ptr
     * @param {string} type
     */
    function getValue(ptr: number, type?: string): any;
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
    function setValue(ptr: number, value: number, type?: string): void;
    let HEAPF32: any;
    let HEAPF64: any;
    let HEAP_DATA_VIEW: any;
    let HEAP8: any;
    let HEAPU8: any;
    let HEAP16: any;
    let HEAPU16: any;
    let HEAP32: any;
    let HEAPU32: any;
    let HEAP64: any;
    let HEAPU64: any;
    let FS_createPath: any;
    function FS_createDataFile(parent: any, name: any, fileData: any, canRead: any, canWrite: any, canOwn: any): void;
    function FS_createPreloadedFile(parent: any, name: any, url: any, canRead: any, canWrite: any, onload: any, onerror: any, dontCreateFile: any, canOwn: any, preFinish: any): void;
    function FS_unlink(path: any): any;
    let addRunDependency: any;
    let removeRunDependency: any;
}
interface WasmModule {
  _ffi_create_vm(_0: number, _1: number, _2: number, _3: number): number;
  _ffi_create_thread(_0: number): number;
  _ffi_get_class(_0: number, _1: number): number;
  _ffi_get_current_exception(_0: number): number;
  _ffi_clear_current_exception(_0: number): void;
  _ffi_get_classdesc(_0: number): number;
  _ffi_create_rr_scheduler(_0: number): number;
  _malloc(_0: number): number;
  _ffi_rr_scheduler_wait_for_us(_0: number): number;
  _ffi_rr_scheduler_step(_0: number): number;
  _ffi_rr_record_is_ready(_0: number): number;
  _ffi_rr_schedule(_0: number, _1: number, _2: number): number;
  _ffi_get_execution_record_result_pointer(_0: number): number;
  _deref_js_handle(_0: number, _1: number): number;
  _ffi_get_execution_record_js_handle(_0: number): number;
  _ffi_execute_immediately(_0: number): number;
  _ffi_free_execution_record(_0: number): void;
  _ffi_classify_array(_0: number): number;
  _ffi_get_element_ptr(_0: number, _1: number, _2: number): number;
  _ffi_get_array_length(_0: number): number;
  _ffi_async_run(_0: number, _1: number, _2: number): number;
  _ffi_allocate_object(_0: number, _1: number): number;
  _ffi_create_string(_0: number, _1: number, _2: number): number;
  _ffi_is_string(_0: number): number;
  _ffi_get_string_data(_0: number): number;
  _ffi_get_string_len(_0: number): number;
  _ffi_get_string_coder(_0: number): number;
  _ffi_instanceof(_0: number, _1: number): number;
  _ffi_run_step(_0: number, _1: number): number;
  _ffi_free_async_run_ctx(_0: number): void;
  _free(_0: number): void;
  _ffi_get_class_json(_0: number): number;
  _main(_0: number, _1: number): number;
  _make_js_handle(_0: number, _1: number): number;
  _drop_js_handle(_0: number, _1: number): void;
  _finish_profiler(_0: number): void;
  _set_max_calls(_0: number): number;
  _wasm_runtime_newarray(_0: number, _1: number, _2: number): number;
  _wasm_runtime_anewarray(_0: number, _1: number, _2: number): number;
  ___interpreter_intrinsic_void_table_base(): number;
  ___interpreter_intrinsic_int_table_base(): number;
  ___interpreter_intrinsic_float_table_base(): number;
  ___interpreter_intrinsic_double_table_base(): number;
  ___interpreter_intrinsic_max_insn(): number;
  _nop_impl_void(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number, _7: number): BigInt;
  _launch_profiler(_0: number): number;
  _read_profiler(_0: number): number;
  _wasm_push_export(_0: number, _1: number, _2: number): void;
  _FileDescriptor_initIDs_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileDescriptor_set_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileDescriptor_getHandle_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileDescriptor_getAppend_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileDescriptor_close0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileInputStream_initIDs_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileInputStream_open0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileInputStream_read0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileInputStream_readBytes_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileInputStream_close0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileInputStream_available0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileOutputStream_initIDs_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileOutputStream_writeBytes_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileOutputStream_close0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _RandomAccessFile_initIDs_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _RandomAccessFile_open0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _RandomAccessFile_read0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _RandomAccessFile_seek0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _RandomAccessFile_getFilePointer_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _RandomAccessFile_close0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _RandomAccessFile_length0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _RandomAccessFile_readBytes0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _UnixFileSystem_initIDs_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _UnixFileSystem_checkAccess0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _UnixFileSystem_canonicalize0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _UnixFileSystem_getLastModifiedTime_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_registerNatives_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getPrimitiveClass_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getEnclosingMethod0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getDeclaringClass0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getComponentType_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getModifiers_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getSuperclass_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getClassLoader_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getPermittedSubclasses0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_initClassName_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_forName0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_desiredAssertionStatus0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getDeclaredFields0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getDeclaredConstructors0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getDeclaredMethods0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getDeclaredClasses0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_isPrimitive_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_isInterface_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_isAssignableFrom_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_isInstance_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_isArray_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_isHidden_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getNestHost0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getConstantPool_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getRawAnnotations_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getRawTypeAnnotations_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getInterfaces0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getGenericSignature0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Class_getProtectionDomain0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _ClassLoader_registerNatives_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _ClassLoader_findLoadedClass0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _ClassLoader_findBootstrapClass_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _ClassLoader_findBuiltinLib_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _ClassLoader_defineClass2_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _ClassLoader_defineClass1_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _ClassLoader_defineClass0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Double_doubleToRawLongBits_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Double_longBitsToDouble_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Float_floatToRawIntBits_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Float_intBitsToFloat_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Module_defineModule0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Module_addReads0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Module_addExportsToAll0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Module_addExports0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _NullPointerException_getExtendedNPEMessage_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Object_hashCode_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Object_registerNatives_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Object_clone_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Object_getClass_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Object_notifyAll_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Object_notify_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Runtime_availableProcessors_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Runtime_maxMemory_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _String_intern_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _StringUTF16_isBigEndian_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _System_mapLibraryName_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _System_arraycopy_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _System_registerNatives_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _System_setOut0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _System_setIn0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _System_setErr0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _System_identityHashCode_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _System_currentTimeMillis_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _System_nanoTime_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Thread_registerNatives_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Thread_currentThread_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Thread_setPriority0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Thread_holdsLock_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Thread_start0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Thread_ensureMaterializedForStackWalk_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Thread_getNextThreadIdOffset_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Thread_currentCarrierThread_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Thread_interrupt0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Thread_clearInterruptEvent_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Throwable_fillInStackTrace_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Throwable_getStackTraceDepth_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Throwable_getStackTraceElement_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _StackTraceElement_initStackTraceElements_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _MethodHandleNatives_registerNatives_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _MethodHandleNatives_getConstant_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _MethodHandleNatives_getNamedCon_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _MethodHandleNatives_resolve_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _MethodHandleNatives_init_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _MethodHandleNatives_objectFieldOffset_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _MethodHandleNatives_staticFieldBase_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _MethodHandleNatives_staticFieldOffset_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _MethodHandleNatives_getMembers_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Finalizer_isFinalizationEnabled_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Reference_refersTo0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Reference_clear0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Reference_getAndClearReferencePendingList_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Array_newArray_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Array_getLength_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Executable_getParameters0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Proxy_defineClass0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _AccessController_getStackAccessControlContext_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _AccessController_ensureMaterializedForStackWalk_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _TimeZone_getSystemTimeZoneID_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _AtomicLong_VMSupportsCS8_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Inflater_initIDs_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Inflater_init_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Inflater_inflateBytesBytes_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Inflater_reset_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Inflater_end_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _CRC32_updateBytes0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _NativeImageBuffer_getNativeMap_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _BootLoader_setBootLoaderUnnamedModule0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _NativeLibraries_findBuiltinLib_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _NativeLibraries_load_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _CDS_isDumpingClassList0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _CDS_isDumpingArchive0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _CDS_isSharingEnabled0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _CDS_getRandomSeedForDumping_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _CDS_getCDSConfigStatus_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _CDS_initializeFromArchive_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _ScopedMemoryAccess_registerNatives_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Signal_findSignal0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Signal_handle0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_registerNatives_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_arrayBaseOffset0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_shouldBeInitialized0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_objectFieldOffset0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_objectFieldOffset1_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_staticFieldOffset0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_staticFieldBase0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_arrayIndexScale0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_getIntVolatile_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_getLongVolatile_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putReferenceVolatile_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putOrderedReference_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putOrderedLong_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putReference_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_compareAndSetInt_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_compareAndSetLong_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_compareAndSetReference_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_addressSize_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_allocateMemory0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_allocateInstance_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_freeMemory0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putLong_cb1(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putLong_cb2(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putLongVolatile_cb1(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_unpark_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putLongVolatile_cb2(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putInt_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putIntVolatile_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putShort_cb1(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putShort_cb2(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putDouble_cb1(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putDouble_cb2(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_getDouble_cb1(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_putByte_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_getReference_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_getInt_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_getShort_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_getByte_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_getLong_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_getByte_cb1(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_getReferenceVolatile_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_defineClass_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_storeFence_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_fullFence_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_copyMemory0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Unsafe_setMemory0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _VM_initialize_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _PreviewFeatures_isPreviewEnabled_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Perf_registerNatives_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Perf_createLong_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _ConstantPool_getUTF8At0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _ConstantPool_getIntAt0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Reflection_getCallerClass_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Reflection_getClassAccessFlags_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _Reflection_areNestMates_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _SystemProps_Raw_platformProperties_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _SystemProps_Raw_vmProperties_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _URLClassPath_getLookupCacheURLs_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _VM_initialize_cb1(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _IOUtil_initIDs_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _IOUtil_iovMax_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _IOUtil_writevMax_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _NativeThread_init_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _NativeThread_current0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _UnixNativeDispatcher_init_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _UnixNativeDispatcher_getcwd_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _UnixNativeDispatcher_stat0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _UnixNativeDispatcher_open0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _UnixFileDispatcherImpl_size0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _UnixFileDispatcherImpl_allocationGranularity0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _UnixFileDispatcherImpl_map0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _UnixFileDispatcherImpl_unmap0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _FileDispatcherImpl_init0_cb0(_0: number, _1: number, _2: number, _3: number, _4: number): void;
}

export type MainModule = WasmModule & typeof RuntimeExports;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
