import { EntityId } from '../../../kernel/src/EntityId.js';

export const TYPE_PATTERNS = {
  ENTITY: <T extends EntityId>(id: T) => `Entity<${typeof id}>`,
  VALUE_OBJECT: <T>(value: T) => `ValueObject<${typeof value}>`,
  AGGREGATE_ROOT: <T extends EntityId>(id: T) => `AggregateRoot<${typeof id}>`,
  REPOSITORY: <T>(entity: T) => `Repository<${typeof entity}>`,
  SERVICE: (name: string) => `${name}Service`,
  CONTROLLER: (name: string) => `${name}Controller`,
} as const;
