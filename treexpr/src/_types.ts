import { ARR, Dict, Fn } from "~types";

export type MapFn = Fn<[params: any, tag: string, mappedKids: ARR<unknown>]>;
export type MapBundle = Dict<MapFn>;
