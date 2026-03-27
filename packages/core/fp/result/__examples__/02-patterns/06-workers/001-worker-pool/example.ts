/**
 * @example Async Worker Pool
 * 
 * Managing worker threads/tasks with Result-based error handling.
 * 
 * @difficulty Advanced
 * @time 25 minutes
 * @category async
 * @see https://nodejs.org/api/worker_threads.html
 */

import { Ok, Err, match } from '@resultsafe/core-fp-result';

// ===== Pattern 1: Simple Worker Pool =====

interface Task<T, R> {
  id: string;
  fn: (input: T) => Promise<R>;
  input: T;
  resolve: (result: R) => void;
  reject: (error: Error) => void;
}

interface WorkerPoolConfig {
  size: number;
  maxRetries?: number;
  timeout?: number;
}

class WorkerPool<T, R> {
  private tasks: Task<T, R>[] = [];
  private workers: Array<Promise<void>> = [];
  private running = false;
  private config: WorkerPoolConfig;

  constructor(config: WorkerPoolConfig) {
    this.config = config;
  }

  start(): void {
    if (this.running) return;
    this.running = true;

    for (let i = 0; i < this.config.size; i++) {
      this.workers.push(this.workerLoop(i));
    }
  }

  private async workerLoop(workerId: number): Promise<void> {
    while (this.running) {
      const task = this.tasks.shift();
      if (!task) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        continue;
      }

      try {
        const result = await this.executeWithRetry(task);
        task.resolve(result);
      } catch (error) {
        task.reject(error as Error);
      }
    }
  }

  private async executeWithRetry(task: Task<T, R>): Promise<R> {
    const maxRetries = this.config.maxRetries || 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const timeout = this.config.timeout || 30000;
        const result = await Promise.race([
          task.fn(task.input),
          new Promise<R>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
          ),
        ]);
        return result as R;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (attempt + 1))
          );
        }
      }
    }

    throw lastError;
  }

  submit(fn: (input: T) => Promise<R>, input: T): Promise<R> {
    return new Promise((resolve, reject) => {
      const task: Task<T, R> = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fn,
        input,
        resolve,
        reject,
      };
      this.tasks.push(task);
    });
  }

  async stop(): Promise<void> {
    this.running = false;
    await Promise.all(this.workers);
  }

  get queueLength(): number {
    return this.tasks.length;
  }

  get isRunning(): boolean {
    return this.running;
  }
}

// ===== Pattern 2: Task Queue with Priority =====

type Priority = 'low' | 'normal' | 'high' | 'critical';

interface PriorityTask<T, R> {
  id: string;
  fn: (input: T) => Promise<Result<R, Error>>;
  input: T;
  priority: Priority;
  createdAt: number;
}

class PriorityTaskQueue<T, R> {
  private queue: PriorityTask<T, R>[] = [];

  enqueue(
    fn: (input: T) => Promise<Result<R, Error>>,
    input: T,
    priority: Priority = 'normal'
  ): string {
    const task: PriorityTask<T, R> = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fn,
      input,
      priority,
      createdAt: Date.now(),
    };

    this.queue.push(task);
    this.sortQueue();

    return task.id;
  }

  private sortQueue(): void {
    const priorityOrder: Record<Priority, number> = {
      low: 0,
      normal: 1,
      high: 2,
      critical: 3,
    };

    this.queue.sort((a, b) => {
      // First by priority
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by creation time (FIFO within same priority)
      return a.createdAt - b.createdAt;
    });
  }

  dequeue(): PriorityTask<T, R> | undefined {
    return this.queue.shift();
  }

  get length(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}

// ===== Pattern 3: Job Scheduler =====

interface Job {
  id: string;
  name: string;
  cron?: string; // Simple cron-like: '*/5 * * * *' for every 5 minutes
  interval?: number; // milliseconds
  handler: () => Promise<Result<void, Error>>;
  enabled: boolean;
  lastRun?: number;
  nextRun?: number;
}

class JobScheduler {
  private jobs: Map<string, Job> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  addJob(job: Job): void {
    if (job.cron) {
      job.nextRun = this.parseCron(job.cron);
    } else if (job.interval) {
      job.nextRun = Date.now() + job.interval;
    }

    this.jobs.set(job.id, job);
    this.scheduleJob(job);
  }

  private scheduleJob(job: Job): void {
    if (!job.enabled || !job.nextRun) return;

    const delay = job.nextRun - Date.now();
    if (delay <= 0) {
      this.executeJob(job);
    } else {
      const timer = setTimeout(() => this.executeJob(job), delay);
      this.timers.set(job.id, timer);
    }
  }

  private async executeJob(job: Job): Promise<void> {
    job.lastRun = Date.now();

    const result = await job.handler();

    match(
      result,
      () => console.log(`Job ${job.name} completed successfully`),
      (error) => console.error(`Job ${job.name} failed:`, error)
    );

    // Schedule next run
    if (job.cron) {
      job.nextRun = this.parseCron(job.cron);
    } else if (job.interval) {
      job.nextRun = Date.now() + job.interval;
    } else {
      job.nextRun = undefined;
    }

    this.scheduleJob(job);
  }

  private parseCron(cron: string): number {
    // Simplified cron parser - only supports */N pattern for minutes
    const match = cron.match(/^\*\/(\d+) \* \* \* \*$/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      return Date.now() + minutes * 60 * 1000;
    }
    // Default: run in 1 minute
    return Date.now() + 60 * 1000;
  }

  removeJob(jobId: string): void {
    const timer = this.timers.get(jobId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(jobId);
    }
    this.jobs.delete(jobId);
  }

  enableJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.enabled = true;
      this.scheduleJob(job);
    }
  }

  disableJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.enabled = false;
      const timer = this.timers.get(jobId);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(jobId);
      }
    }
  }

  getJobStatus(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }
}

// ===== Example usage =====

const runExample = async () => {
  console.log('=== Async Worker Pool Example ===\n');

  // Example 1: Worker Pool
  const pool = new WorkerPool<number, number>({
    size: 3,
    maxRetries: 3,
    timeout: 5000,
  });

  pool.start();

  const tasks = Array.from({ length: 10 }, (_, i) => i + 1);
  const results = await Promise.all(
    tasks.map((n) =>
      pool.submit(
        async (x) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return x * 2;
        },
        n
      )
    )
  );

  console.log('Worker pool results:', results);

  await pool.stop();

  // Example 2: Priority Queue
  const priorityQueue = new PriorityTaskQueue<string, string>();

  priorityQueue.enqueue(
    async (input) => Ok(`Processed: ${input}`),
    'low-priority-task',
    'low'
  );
  priorityQueue.enqueue(
    async (input) => Ok(`Processed: ${input}`),
    'critical-task',
    'critical'
  );
  priorityQueue.enqueue(
    async (input) => Ok(`Processed: ${input}`),
    'normal-task',
    'normal'
  );

  console.log('Queue length:', priorityQueue.length);

  // Dequeue in priority order
  while (priorityQueue.length > 0) {
    const task = priorityQueue.dequeue();
    if (task) {
      const result = await task.fn(task.input);
      console.log('Processed:', result);
    }
  }

  // Example 3: Job Scheduler
  const scheduler = new JobScheduler();

  let runCount = 0;
  scheduler.addJob({
    id: 'job-1',
    name: 'Periodic Task',
    interval: 1000, // Every second
    enabled: true,
    handler: async () => {
      runCount++;
      console.log(`Periodic task run #${runCount}`);
      return Ok(undefined);
    },
  });

  // Let it run for 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  scheduler.removeJob('job-1');
  console.log('Total runs:', runCount);
};

// Uncomment to run (may take a few seconds):
// runExample().catch(console.error);
