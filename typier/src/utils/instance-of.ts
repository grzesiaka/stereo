import Custom from "./custom";

type InstanceofTarget = (new (...args: any[]) => any) | (abstract new (...args: any[]) => any);
// | { [Symbol.hasInstance](value: any): boolean };

export const InstanceOf = <T extends InstanceofTarget>(T: T, msg?: string) =>
  Custom<InstanceType<T>>((v) => (v as any) instanceof T, msg);

export default InstanceOf;
