/** Uniform return type for every server action. */
export type ActionResult<TField extends string = string> =
  | { ok: true; message: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<TField, string[]>> };
