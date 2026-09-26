export const deferred = <T = unknown>() => {
  let resolve: (t: T) => void;
  let reject: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  // @ts-expect-error used before assigned
  return { resolve, reject, promise };
};

export type OrPromise<N> = N | Promise<N>;
