#include <natives.h>

DECLARE_NATIVE("sun/misc", URLClassPath, getLookupCacheURLs,
               "(Ljava/lang/ClassLoader;)[Ljava/net/URL;") {
  // Return an empty array
  bjvm_classdesc *URL = bootstrap_class_create(thread, STR("java/net/URL"));
  bjvm_link_class(thread, URL);
  bjvm_obj_header *array = CreateObjectArray1D(thread, URL, 0);
  return (bjvm_stack_value){.obj = array};
}