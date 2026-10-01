/** Type-level snake_case ↔ camelCase conversion for DB column names. */

export type SnakeToCamel<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
  : S;

export type CamelToSnake<S extends string> = S extends `${infer Char}${infer Rest}`
  ? `${Char extends Uppercase<Char> ? (Char extends Lowercase<Char> ? Char : `_${Lowercase<Char>}`) : Char}${CamelToSnake<Rest>}`
  : S;

/**
 * Renames top-level keys only. Nested values (e.g. `jsonb` columns) are app data and
 * keep their original shape.
 */
export type CamelCasedKeys<T> = {
  [K in keyof T as K extends string ? SnakeToCamel<K> : K]: T[K];
};

export type SnakeCasedKeys<T> = {
  [K in keyof T as K extends string ? CamelToSnake<K> : K]: T[K];
};
