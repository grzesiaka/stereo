export type NULL = {
  type: "null";
};

// TODO support for $TYP and $KEY
export const Null = () =>
  ({
    type: "null",
  }) as NULL;

export default Null;
