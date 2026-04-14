import * as atoms from "../atoms/index";
import * as compounds from "../compounds/index";
import * as short from "../1";
import { a } from "jsyoyo";

export const base = a(short, atoms, compounds);
export type Base = typeof base;
