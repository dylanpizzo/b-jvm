// Benchmarks. We'll use this to track the VM performance over time.

#include "tests-common.h"

#include <catch2/benchmark/catch_benchmark.hpp>
#include <catch2/catch_test_macros.hpp>

using namespace Bjvm::Tests;

TEST_CASE("Benchmarks", "[bench]") {
  BENCHMARK("Big decimal") {
    auto result = run_test_case("test_files/bench_big_decimal/", true);
  };

  BENCHMARK("Stack trace") {
    auto result = run_test_case("test_files/bench_stack_trace/", true);
  };

  BENCHMARK("JSON startup") {
    auto result =
        run_test_case("test_files/gson_example/", true, "GsonExample");
  };

  BENCHMARK("Advanced lambda") {
    auto result = run_test_case("test_files/advanced_lambda", true);
  };

  BENCHMARK("Cfg fuck") {
    auto result = run_test_case("test_files/cfg_fuck", true);
  };
}