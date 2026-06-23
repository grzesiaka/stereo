import { Get } from "type-fest";

import { a, ARR, Fn, Fn$O } from "jsyoyo";
import { Tree$Values, Tree_of_Functions } from "treeo";
import { WithOP, type OP } from "jsyoyo";

import { commandify, commandifyLeaves, Command, Commandify, CommandifyLeaves } from "./commandify";

// TODO imporove
const get = (op: string, x: object) => {
  const parts = op.split(".");
  let i = x as any;
  for (const p of parts) {
    i = i[p];
  }
  return i;
};

export type Interpret<
  Nodes,
  Leaves,
  AST extends Command<Commandify<Nodes> & CommandifyLeaves<Leaves>>,
> = AST extends readonly [infer K extends string, infer Ps extends ARR, unknown?]
  ? Get<Nodes & Leaves, K> extends Fn<ARR, infer O>
    ? O & WithOP<K, Ps>
    : ["?", Get<Nodes & Leaves, K>]
  : never;

export const expressify =
  <Nodes extends Tree_of_Functions, Leaves extends Tree_of_Functions = {}>(nodes: Nodes, leaves = {} as Leaves) =>
  ($: (node: Fn$O<Tree$Values<Nodes>>, kids: ARR<Fn$O<Tree$Values<Nodes | Leaves>>>) => void) => {
    const cmd = a(commandify(nodes), commandifyLeaves(leaves)) as Commandify<Nodes> & CommandifyLeaves<Leaves>;
    const run = <T extends Command<Commandify<Nodes> & CommandifyLeaves<Leaves>>>(ast: T) => {
      const [op, ps, ks] = ast;
      const f = get(op, nodes) || get(op, leaves);
      const x = f(...ps);
      const kx = (ks || []).map(run);
      kx.length && $(x, kx);
      return x as Interpret<Nodes, Leaves, T>;
    };
    return {
      cmd,
      run,
    };
  };
