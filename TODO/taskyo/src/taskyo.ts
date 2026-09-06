import { Dict } from "jsyoyo";
import { TaskSpec } from "./task";

export class Taskyo<Ctx, Specs extends Dict<TaskSpec>> {
  constructor(
    public readonly ctx: Ctx,
    public readonly spec: Specs,
  ) {}
}
