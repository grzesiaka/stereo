import { ARR, Fn, GET_OP as G } from "jsyoyo";

export const GET_OP = G<"o" | "m" | "c", [unknown, unknown, ARR<Fn>]>();
