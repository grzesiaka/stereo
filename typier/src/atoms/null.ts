export type NULL = {
  type: "null";
};

export const Null = () =>
  ({
    type: "null",
  }) as NULL;

export default Null;
