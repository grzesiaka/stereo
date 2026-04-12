export type Null = {
  type: "null";
};

export const Null = () =>
  ({
    type: "null",
  }) as Null;

export default Null;
