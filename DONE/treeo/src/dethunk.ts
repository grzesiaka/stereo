import map from "./map";
import { Tree_of_Thunks, Tree_of_Functions$Tree_of_Outputs } from "./types";

export type Dethunk<T> = Tree_of_Functions$Tree_of_Outputs<T>;

export const dethunk = map(([v]: [() => unknown]) => v()) as <T extends Tree_of_Thunks>(t: T) => Dethunk<T>;
