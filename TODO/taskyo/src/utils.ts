import { id } from "jsyoyo";

export const NEVER = new Promise(id);
export const tick = (n = 1): Promise<void> => (n <= 1 ? Promise.resolve() : tick(n - 1).then(() => Promise.resolve()));
