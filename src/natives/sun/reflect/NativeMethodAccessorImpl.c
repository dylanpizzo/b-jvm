#include <natives.h>

DECLARE_NATIVE(
    "sun/reflect", NativeMethodAccessorImpl, invoke0,
    "(Ljava/lang/reflect/Method;Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;") {
  // TODO add a lot of checks
  bjvm_cp_method *method = *bjvm_unmirror_method(args[0].obj);
  bjvm_stack_value assembled[256];
  int arg_i = 0;
  bool is_static = !!(method->access_flags & BJVM_ACCESS_STATIC);
  if (!is_static) {
    assembled[arg_i++] = args[1];
  }

  int args_count = method->parsed_descriptor->args_count;
  bjvm_obj_header **data = ArrayData(args[2].obj);
  for (int i = 0; i < args_count; i++) {
    assembled[arg_i++] = (bjvm_stack_value) { .obj = data[i] };
  }

  // TODO unbox arguments

  bjvm_stack_frame *frame = bjvm_push_frame(thread, method);
  for (int i = 0, j = 0; i < arg_i; i++) {
    frame->values[frame->max_stack + j] = assembled[i];
    if (is_static || i >= 1) {
      j += bjvm_is_field_wide(method->parsed_descriptor->args[i]);
    }
  }
  bjvm_stack_value result;

  assert(method->code);
  bjvm_bytecode_interpret(thread, frame, &result);
  bjvm_pop_frame(thread, frame);

  printf("CALLED INVOKE, got result %p\n", result.obj);

  // TODO box the result
  return result;
}
