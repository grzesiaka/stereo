import { ARR, Dict, Fn, Fn$O } from "~types";

/**
 * ReturnType of picked function or `NotFound` if no tag present in the bundle
 */
type MapByTag<Tag, MapBundle, NotFound> = Tag extends keyof MapBundle ? Fn$O<MapBundle[Tag]> : NotFound;

export const map = () => 1;

export default map;
