import type { BOOL } from "./bool";
import type { CONST } from "./const";
import type { NULL } from "./null";
import type { ENUM } from "./enum";
import type { NUMBER } from "./number";
import type { STRING } from "./string";

export type ATOM = BOOL | CONST | NULL | ENUM | NUMBER | STRING;
