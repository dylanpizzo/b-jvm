#ifndef LINKAGE_H
#define LINKAGE_H

#include <bjvm.h>

int bjvm_link_class(bjvm_thread *thread, bjvm_classdesc *classdesc);
void setup_super_hierarchy(bjvm_classdesc * classdesc);

#endif