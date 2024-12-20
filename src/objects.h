#include "bjvm.h"

static int constexpr kArrayLengthOffset = sizeof(bjvm_obj_header);
static int constexpr kArrayDataOffset = sizeof(bjvm_obj_header) + sizeof(int);

#define Is1DPrimitiveArray(src)                                                \
  ({                                                                           \
    bjvm_obj_header *__obj = (src);                                            \
    src->descriptor->kind == BJVM_CD_KIND_PRIMITIVE_ARRAY &&                   \
        src->descriptor->dimensions == 1;                                      \
  })

inline int *ArrayLength(bjvm_obj_header *obj) {
  return (int *)((char *)obj + kArrayLengthOffset);
}

inline void *ArrayData(bjvm_obj_header *obj) {
  return (char *)obj + kArrayDataOffset;
}

/// Create a java.lang.String from a null-terminated C string.
bjvm_obj_header *MakeJavaStringUtf8(bjvm_thread *thread, char const *chars);

/// Helper for java.lang.String#length
inline int JavaStringLength(bjvm_thread *thread, bjvm_obj_header *string) {
  assert(utf8_equals(&string->descriptor->name, "java/lang/String"));

  auto method = bjvm_easy_method_lookup(string->descriptor, "length", "()I",
                                        false, false);
  bjvm_stack_value result;
  bjvm_thread_run(thread, method, (bjvm_stack_value[]){}, &result);

  return result.i;
}