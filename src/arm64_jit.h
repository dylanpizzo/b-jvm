// Low priority but maybe instructive for the wasm work + fuzzing shared logic
// Also I want to learn ARM

#ifndef ARM64_JIT_H
#define ARM64_JIT_H

#include "bjvm.h"

// clang-format off
// Represents a register in the ARM64 architecture.
typedef enum {
  W0, W1, W2, W3, W4, W5, W6, W7, W8, W9, W10, W11, W12, W13, W14, W15,
  W16, W17, W18, W19, W20, W21, W22, W23, W24, W25, W26, W27, W28, W29, W30, WSP,
  X0, X1, X2, X3, X4, X5, X6, X7, X8, X9, X10, X11, X12, X13, X14, X15,
  X16, X17, X18, X19, X20, X21, X22, X23, X24, X25, X26, X27, X28, X29, X30, XSP,
} bjvm_arm64_reg;
// clang-format on


typedef struct {
  int a;
} bjvm_arm64_jit_result;

bjvm_arm64_jit_result bjvm_arm64_jit_compile(const bjvm_cp_method *method);

#endif // ARM64_JIT_H
