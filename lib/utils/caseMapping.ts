import type { CamelCasedKeys, SnakeCasedKeys } from "@/types/caseMapping";

export function snakeToCamel(value: string): string {
  return value.replace(/_([a-z0-9])/g, (_match, char: string) => char.toUpperCase());
}

export function camelToSnake(value: string): string {
  return value.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

export function keysToCamel<T extends object>(input: T): CamelCasedKeys<T> {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [snakeToCamel(key), value]),
  ) as CamelCasedKeys<T>;
}

export function keysToSnake<T extends object>(input: T): SnakeCasedKeys<T> {
  return Object.fromEntries(
    Object.entries(input)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [camelToSnake(key), value]),
  ) as SnakeCasedKeys<T>;
}
