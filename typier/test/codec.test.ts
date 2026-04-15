import { describe } from "~testing";
import { Decode, Encode, Check } from "typebox/value";

import { Codec, Arr, Int } from "../src";

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

  //   Uint8Array_or_Array: () => {
  //     const bytes = Uni(
  //       // Arr(Int({ minimum: 0, maximum: 255 })("byte", "audio"))("audio"),
  //       UNSAFE<Uint8Array>()("Uint8"),
  //     )("byte");
  //     const codec = Codec(
  //       bytes,
  //       (a) => (a instanceof Uint8Array ? a : new Uint8Array(a)) as Uint8Array,
  //       (a) => a,
  //     )("Uint8Array");
  //     // TODO - this is problematic; typebox does not offer custom validation logic as such
  //     const a = [-1, 0, 256];
  //     if (Check(UNSAFE<Uint8Array>()("Uint8"), a)) {
  //       const b = a;
  //     }
  //     eq(Check(codec, [-1, 0, 256]), true);
  //     const audio = Decode(codec, [0, 0, 255]);
  //     eq(Decode(codec, [0, 0, 255]), new Uint8Array([0, 0, 255]) as never);
  //     eq(Decode(codec, new Uint8Array([0, 0, 255])), new Uint8Array([0, 0, 255]) as never);
  //     // eq(Encode(codec, audio), Decode(bytes, [0, 0, 255]));
  //   },
}));
