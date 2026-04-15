import { describe } from "~testing";
import { Decode, Encode, Check } from "typebox/value";

import { Codec, Arr, Int, Uni } from "../src";

describe(Codec, ({ eq }) => ({
  Date: () => {
    const rawDate = Int()("date_as_int", "date");
    const DateCodec = Codec(
      rawDate,
      (v) => new Date(v),
      (d) => d.getTime() as never,
    )("date");
    const date = Decode(DateCodec, 0);
    eq(date.toJSON(), "1970-01-01T00:00:00.000Z");
    eq(Encode(DateCodec, date), Decode(rawDate, 0));
    eq(Check(DateCodec, 0), true);
    eq(Check(DateCodec, new Date(0)), false);
  },

  Uint8ClampedArray: () => {
    const bytes = Arr(Int()("byte", "audio"))("audio");
    const codec = Codec(
      bytes,
      (a) => new Uint8ClampedArray(a),
      (a) => [...a] as never,
    )("Uint8ClampedArray");
    const audio = Decode(codec, [-1, 0, 256]);
    eq([...audio], [0, 0, 255]);
    eq(Encode(codec, audio), Decode(bytes, [0, 0, 255]));
  },

  Uint8Array_or_Array: () => {
    const bytes = Uni(
      InstanceOf(Uint8Array)("Uint8[]"),
      Arr(Int({ minimum: 0, maximum: 255 })("byte", "audio"))(""),
    )("");
    const codec = Codec(
      bytes,
      (a) => (a instanceof Uint8Array ? a : new Uint8Array(a)),
      (a) => a as any,
    )("Audio");

    eq(Check(codec, new Uint8Array()), true);
    eq(Check(codec, [-1, 0, 256]), false);
    eq(Check(codec, new Uint32Array()), false);

    const audio = Decode(codec, [0, 0, 255]);
    eq(new Uint8Array([0, 0, 255]), audio);
    eq(Encode(codec, audio), Decode(codec, [0, 0, 255]));
  },
}));

import { Custom } from "../src";

describe(Custom, ({ eq }) => ({
  UInt8Array: () => {
    // `any` is kind of weird
    const t = Custom((x: Uint8Array<any>) => x instanceof Uint8Array)("UInt8[]");
    const d = Decode(t, new Uint8Array());
    eq(new Uint8Array(), d);
    eq(Check(t, new Uint8Array()), true);
    eq(Check(t, 1), false);
    eq(Check(t, []), false);
  },
}));

import { InstanceOf } from "../src";

describe(InstanceOf, ({ eq }) => ({
  UInt8Array: () => {
    const t = InstanceOf(Uint8Array)("UInt8[]");
    const d = Decode(t, new Uint8Array());
    eq(new Uint8Array(), d);
    eq(Check(t, new Uint8Array()), true);
    eq(Check(t, 1), false);
    eq(Check(t, []), false);
  },
}));

import { UNSAFE } from "../src";

describe(UNSAFE, ({ eq }) => ({
  Uint8Array_or_Array: () => {
    const codec = UNSAFE<Array<number> | Uint8Array>(
      (a) => (a instanceof Uint8Array ? a : new Uint8Array(a)) as Uint8Array,
      (a) => a,
    )("Uint8Array");

    eq(Decode(codec, [0, 0, 255]), new Uint8Array([0, 0, 255]) as never);
    eq(Decode(codec, new Uint8Array([0, 0, 255])), new Uint8Array([0, 0, 255]) as never);

    eq(Check(codec, [-1, 0, 256]), true);

    // TODO - this is problematic; typebox does not offer custom validation logic as such
    // const a = [-1, 0, 256];
    // if (Check(codec, a)) {
    //   const _b = a;
    // }
    // const s = "";
    // if (Check(codec, s)) {
    //   const _s = s;
    // }

    eq(Check(codec, ""), true);
  },
}));
