//
// Created by Cowpox on 2/2/25.
//

#include "roundrobin_scheduler.h"

typedef struct {
  call_interpreter_t call;
  execution_record *record;
} pending_call;

typedef struct {
  bjvm_thread *thread;
  // pending calls for this thread (processed in order)
  pending_call *call_queue;
  rr_wakeup_info *wakeup_info;
} thread_info;

typedef struct {
  thread_info **round_robin; // Threads are cycled here
} impl;

void rr_scheduler_init(rr_scheduler *scheduler, bjvm_vm *vm){
  scheduler->vm = vm;
  scheduler->_impl = calloc(1, sizeof(impl));
}

void rr_scheduler_uninit(rr_scheduler *scheduler){
  free(scheduler->_impl);
}

static thread_info * get_next_thr(impl *impl) {
  assert(impl->round_robin && "No threads to run");
  thread_info *info = impl->round_robin[0];
  memmove(impl->round_robin, impl->round_robin + 1, sizeof(thread_info *) * (arrlen(impl->round_robin) - 1));
  impl->round_robin[arrlen(impl->round_robin) - 1] = info;
  return info;
}

scheduler_status_t rr_scheduler_step(rr_scheduler *scheduler) {
  impl *impl = scheduler->_impl;

  if (arrlen(impl->round_robin) == 0)
    return SCHEDULER_RESULT_DONE;

  thread_info *info = get_next_thr(impl);
  if (!info)
    return SCHEDULER_RESULT_DONE;

  bjvm_thread *thread = info->thread;
  const int MICROSECONDS_TO_RUN = 10000;

  thread->fuel = 100000;
  struct timeval tv;
  gettimeofday(&tv, NULL);
  u64 time = tv.tv_sec * 1000000 + tv.tv_usec;

  // If the thread is sleeping, check if it's time to wake up
  if (info->wakeup_info && info->wakeup_info->kind == RR_WAKEUP_SLEEP) {
    if (time < info->wakeup_info->wakeup_us) {
      return SCHEDULER_RESULT_MORE;
    }
  }

  thread->yield_at_time = time + MICROSECONDS_TO_RUN;

  if (arrlen(info->call_queue) == 0) {
    arrpop(impl->round_robin);
    return rr_scheduler_step(scheduler);
  }

  pending_call *call = &info->call_queue[0];
  future_t fut = call_interpreter(&call->call);

  if (fut.status == FUTURE_READY) {
    call->record->status = SCHEDULER_RESULT_DONE;
    call->record->returned = call->call._result;

    memmove(info->call_queue, info->call_queue + 1, sizeof(pending_call) * (arrlen(info->call_queue) - 1));
    arrsetlen(info->call_queue, arrlen(info->call_queue) - 1);
  } else {
    free(info->wakeup_info);
    info->wakeup_info = (void*)fut.wakeup;
  }

  return SCHEDULER_RESULT_MORE;
}

static thread_info *get_or_create_thread_info(impl *impl, bjvm_thread *thread) {
  for (int i = 0; i < arrlen(impl->round_robin); i++) {
    if (impl->round_robin[i]->thread == thread) {
      return impl->round_robin[i];
    }
  }

  thread_info *info = calloc(1, sizeof(thread_info));
  info->thread = thread;
  arrput(impl->round_robin, info);
  return info;
}

execution_record *rr_scheduler_run(rr_scheduler *scheduler, call_interpreter_t call) {
  bjvm_thread *thread = call.args.thread;
  thread_info *info = get_or_create_thread_info(scheduler->_impl, thread);

  // Copy the arguments object
  bjvm_stack_value *args_copy = calloc(bjvm_argc(call.args.method), sizeof(bjvm_stack_value));
  memcpy(args_copy, call.args.args, sizeof(bjvm_stack_value) * bjvm_argc(call.args.method));
  call.args.args = args_copy;

  pending_call pending = {.call = call, .record = calloc(1, sizeof(execution_record))};
  arrput(info->call_queue, pending);
  return pending.record;
}

void free_execution_record(execution_record *record) {
  if (record->js_handle != -1) {
    bjvm_drop_js_handle(record->vm, record->js_handle);
  }
  free(record);
}