import { TUnsafe } from "typebox";
import { id } from "jsyoyo";
import Codec from "./codec";

export const UNSAFE = <Encoded, Decoded = Encoded>(
  decode: (e: Encoded) => Decoded,
  encode = id as (d: Decoded) => Encoded,
) => Codec<TUnsafe<Encoded>, Decoded, "!UNSAFE!">({} as never, decode, encode);

export default UNSAFE;
