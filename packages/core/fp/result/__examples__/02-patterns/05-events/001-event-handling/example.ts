/**
 * @module 001-event-handling
 * @title Async Event Handling with Result
 * @description Event-driven architecture patterns with Result-based error handling. Includes TypedEventEmitter, EventBus, and CommandQueue with comprehensive error aggregation.
 * @example
 * import { Ok, Err, match } from '@resultsafe/core-fp-result';
 * const emitter = new TypedEventEmitter();
 * emitter.on('userLogin', async (data) => { console.log(data.userId); return Ok(undefined); });
 * @example
 * import { Ok, Err } from '@resultsafe/core-fp-result';
 * const bus = new EventBus();
 * await bus.publish('data-update', { table: 'users', records: 100 });
 * @tags events,event-bus,async,pubsub,pattern,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 20min
 * @category patterns
 * @see {@link 001-async-basics} @see {@link 001-worker-pool} @see {@link https://nodejs.org/api/events.html}
 * @ai {"purpose":"Teach event handling patterns with Result-based error aggregation","prerequisites":["Result type","Event emitters","Async patterns"],"objectives":["Typed events","Error aggregation","Command queue"],"rag":{"queries":["Result event handler example","event bus pattern Result"],"intents":["learning","practical"],"expectedAnswer":"Use Result-based event handlers with error aggregation","confidence":0.95},"embedding":{"semanticKeywords":["events","event-bus","async","pubsub","error-aggregation"],"conceptualTags":["event-driven","messaging"],"useCases":["microservices","real-time-apps"]},"codeSearch":{"patterns":["new TypedEventEmitter(","bus.subscribe(","commandQueue.enqueue("],"imports":["import { Ok, Err, match } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-async-basics","001-worker-pool"]},"chunking":{"type":"self-contained","section":"patterns","subsection":"events","tokenCount":450,"relatedChunks":["001-async-basics","001-worker-pool"]}}
 */

import { Err, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Pattern 1: Event Emitter with Result =====

type EventHandler<T> = (data: T) => Promise<Result<void, Error>>;

class TypedEventEmitter<Events extends Record<string, unknown>> {
  private listeners: Map<keyof Events, Array<EventHandler<any>>> = new Map();

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): this {
    const handlers = this.listeners.get(event) || [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
    return this;
  }

  off<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
  ): this {
    const handlers = this.listeners.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
    return this;
  }

  async emit<K extends keyof Events>(
    event: K,
    data: Events[K],
  ): Promise<Result<void, Error[]>> {
    const handlers = this.listeners.get(event) || [];
    const errors: Error[] = [];

    for (const handler of handlers) {
      try {
        const result = await handler(data);
        if (result.ok === false) {
          errors.push(
            result.error instanceof Error
              ? result.error
              : new Error(String(result.error)),
          );
        }
      } catch (error) {
        errors.push(error instanceof Error ? error : new Error(String(error)));
      }
    }

    if (errors.length > 0) {
      return Err(errors);
    }

    return Ok(undefined);
  }

  once<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
  ): this {
    const onceHandler = async (data: Events[K]) => {
      this.off(event, onceHandler);
      return handler(data);
    };
    return this.on(event, onceHandler);
  }
}

// ===== Pattern 2: Event Bus with typed events =====

interface EventBusEvent {
  type: string;
  payload: unknown;
  timestamp: number;
}

class EventBus {
  private handlers: Map<
    string,
    Array<(event: EventBusEvent) => Promise<Result<void, unknown>>>
  > = new Map();

  private history: EventBusEvent[] = [];

  subscribe(
    type: string,
    handler: (event: EventBusEvent) => Promise<Result<void, unknown>>,
  ): () => void {
    const handlers = this.handlers.get(type) || [];
    handlers.push(handler);
    this.handlers.set(type, handlers);

    // Return unsubscribe function
    return () => {
      const idx = handlers.indexOf(handler);
      if (idx > -1) handlers.splice(idx, 1);
    };
  }

  async publish(
    type: string,
    payload: unknown,
  ): Promise<Result<void, unknown[]>> {
    const event: EventBusEvent = {
      type,
      payload,
      timestamp: Date.now(),
    };

    this.history.push(event);

    const handlers = this.handlers.get(type) || [];
    const errors: unknown[] = [];

    for (const handler of handlers) {
      try {
        const result = await handler(event);
        if (result.ok === false) {
          errors.push(result.error);
        }
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      return Err(errors);
    }

    return Ok(undefined);
  }

  getHistory(type?: string): EventBusEvent[] {
    if (type) {
      return this.history.filter((e) => e.type === type);
    }
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }
}

// ===== Pattern 3: Command Queue with Result =====

interface Command<T = unknown> {
  id: string;
  type: string;
  payload: T;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: unknown;
  createdAt: number;
  completedAt?: number;
}

class CommandQueue {
  private queue: Command<any>[] = [];
  private processing = false;

  enqueue<T>(type: string, payload: T): Command<T> {
    const command: Command<T> = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      status: 'pending',
      createdAt: Date.now(),
    };
    this.queue.push(command);
    return command;
  }

  async process<T>(
    handler: (command: Command<T>) => Promise<Result<unknown, unknown>>,
  ): Promise<Result<Command<T>[], unknown[]>> {
    if (this.processing) {
      return Err(['Already processing']);
    }

    this.processing = true;
    const errors: unknown[] = [];
    const completed: Command<T>[] = [];

    while (this.queue.length > 0) {
      const command = this.queue.shift() as Command<T>;
      command.status = 'processing';

      try {
        const result = await handler(command);
        if (result.ok) {
          command.status = 'completed';
          command.completedAt = Date.now();
          completed.push(command);
        } else {
          command.status = 'failed';
          command.error = result.error;
          errors.push(result.error);
        }
      } catch (error) {
        command.status = 'failed';
        command.error = error;
        errors.push(error);
      }
    }

    this.processing = false;

    if (errors.length > 0) {
      return Err(errors);
    }

    return Ok(completed);
  }
}

// ===== Example usage =====

interface AppEvents {
  [key: string]: unknown;
  userLogin: { userId: string; email: string };
  userLogout: { userId: string };
  dataUpdate: { table: string; records: number };
  error: { code: string; message: string };
}

const runExample = async () => {
  console.log('=== Async Event Handling Example ===\n');

  // Example 1: Typed Event Emitter
  const emitter = new TypedEventEmitter<AppEvents>();

  emitter.on('userLogin', async (data) => {
    console.log(`User ${data.userId} logged in`);
    return Ok(undefined);
  });

  emitter.on('userLogin', async (data) => {
    // Simulate potential error
    if (!data.email.includes('@')) {
      return Err(new Error('Invalid email'));
    }
    console.log(`Email: ${data.email}`);
    return Ok(undefined);
  });

  const emitResult = await emitter.emit('userLogin', {
    userId: 'user-123',
    email: 'john@example.com',
  });

  console.log('Emit result:', emitResult);

  // Example 2: Event Bus
  const bus = new EventBus();

  const unsubscribe = bus.subscribe('data-update', async (event) => {
    console.log('Data update:', event.payload);
    return Ok(undefined);
  });

  await bus.publish('data-update', { table: 'users', records: 100 });

  // Unsubscribe when needed
  unsubscribe();

  // Example 3: Command Queue
  const queue = new CommandQueue();

  queue.enqueue('send-email', { to: 'user@example.com', subject: 'Hello' });
  queue.enqueue('send-email', { to: 'admin@example.com', subject: 'Report' });

  const processResult = await queue.process(async (command) => {
    console.log(`Processing command: ${command.type}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    return Ok({ processed: true });
  });

  console.log('Queue result:', processResult);
};

// Uncomment to run:
// runExample().catch(console.error);

// ===== Additional patterns =====

// Pattern: Middleware chain for events
type EventMiddleware<T> = (
  event: T,
  next: () => Promise<Result<void, Error>>,
) => Promise<Result<void, Error>>;

const createMiddlewarePipeline = <T>(
  middlewares: EventMiddleware<T>[],
): ((event: T) => Promise<Result<void, Error>>) => {
  return async (event: T) => {
    let index = -1;

    const dispatch = async (): Promise<Result<void, Error>> => {
      index++;
      if (index >= middlewares.length) {
        return Ok(undefined);
      }

      const middleware = middlewares[index];
      if (!middleware) {
        return Ok(undefined);
      }
      return middleware(event, dispatch);
    };

    return dispatch();
  };
};

// Pattern: Retry failed event handlers
const withRetry = <T>(
  handler: (event: T) => Promise<Result<void, Error>>,
  maxRetries: number,
): ((event: T) => Promise<Result<void, Error>>) => {
  return async (event: T) => {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      const result = await handler(event);
      if (result.ok) return result;

      lastError = result.error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }

    return Err(lastError!);
  };
};
