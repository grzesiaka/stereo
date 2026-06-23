import { a } from "objoy";

export interface WithOP<OP_ID extends string, Params> {
  __: OP<OP_ID, Params>;
}

export type OP<OP_ID extends string = string, Params = unknown> = [OP_ID, Params];
/**
 * Tags a result of operation with operation id and operation params
 *
 * @param operation_id id of the operation
 * @param operation_params params of the operation
 * @param x value to be tagged
 * @returns `Object.assign(x, { __: [Params, OP_ID] })`
 */
export const OP =
  <OP_ID extends string>(id: OP_ID) =>
  <const Params>(p: Params) =>
  <X extends {}>(x: X) =>
    a(x, { __: [id, p] as OP<OP_ID, Params> });
