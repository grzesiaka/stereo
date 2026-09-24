import { describe } from "~testing";
import EXP from "../src/dynamic/export";
import IMP from "../src/dynamic/import";

import * as selfStatic from "../src";
import selfDynamic from "../src/_";

import { ks } from "../src";

import * as objoy from "objoy";
import * as txtxt from "txtxt";

describe("dynamic import / export", ({ eq }) => ({
  self: async () => {
    const staticKeys = ks(selfStatic).sort();
    // interestingly not the same; vitest transformation most likely involved; but why keys are in different order
    eq(staticKeys, ks(await selfDynamic()).sort());
    eq(staticKeys[0], "$asOPs"); // make sure at least one key matches
    eq(staticKeys.length > 50, true);
  },

  import: async () => {
    // Duplication of module name seems required; import only accepts raw strings
    const dynObjoy = EXP<typeof import("objoy")>()("objoy");
    const dynTxtxt = EXP<typeof import("txtxt")>()("txtxt");

    const dynObjoyA = await dynObjoy();
    eq(dynObjoyA, objoy);
    eq(dynObjoyA, await dynObjoy());

    const i = IMP(dynObjoy, dynTxtxt);
    eq(await i.txtxt(), txtxt);
    eq(await i.objoy(), dynObjoyA);

    // updating the path forces new module resolution
    (dynObjoy as any).path = dynObjoy.path + "?v2";
    eq(dynObjoyA !== (await dynObjoy()), true);
  },
}));
