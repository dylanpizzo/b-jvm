//
// Created by alec on 1/19/25.
//

#ifndef POSIX_FS_H
#define POSIX_FS_H

#include "unixlike-fs.h"

typedef struct {
  unixlike_fs unix_;
} posix_fs;

bool posix_fs_supported(void);
void posix_fs_init(unixlike_fs *fs);

fs_result posix_fs_get_attributes(slice file_name, boolean_attributes *result);

#endif // POSIX_FS_H
