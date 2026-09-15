const _TODO = <MSG extends string>(m: MSG): any =>
  (() => {
    throw new Error(`NOT_IMPLEMENTED: ${m}`);
  }) as any;

export const TODO = <MSG extends string>(m?: MSG): any =>
  m === void 0
    ? _TODO("?")
    : ((() => {
        throw new Error(`NOT_IMPLEMENTED: ${m}`);
      }) as any);
