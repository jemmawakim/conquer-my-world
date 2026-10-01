import { keysToCamel, keysToSnake } from "@/lib/utils/caseMapping";
import type {
  DbInsert,
  DbRow,
  DbUpdate,
  Entity,
  EntityInsert,
  EntityUpdate,
  TableName,
} from "@/types/supabase";

/**
 * Boundary between Postgres (snake_case) and the app (camelCase).
 * The `table` argument is used purely for type inference.
 */
export function fromDbRow<T extends TableName>(_table: T, row: DbRow<T>): Entity<T> {
  return keysToCamel(row) as Entity<T>;
}

export function fromDbRows<T extends TableName>(table: T, rows: DbRow<T>[]): Entity<T>[] {
  return rows.map((row) => fromDbRow(table, row));
}

export function toDbInsert<T extends TableName>(_table: T, entity: EntityInsert<T>): DbInsert<T> {
  return keysToSnake(entity) as DbInsert<T>;
}

export function toDbUpdate<T extends TableName>(_table: T, entity: EntityUpdate<T>): DbUpdate<T> {
  return keysToSnake(entity) as DbUpdate<T>;
}
