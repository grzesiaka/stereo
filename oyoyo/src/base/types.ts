import { WithTag } from "jsyoyo";

export type Concurrency = WithTag<number, "concurrency"> | (number & {});
