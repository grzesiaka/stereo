export const mutatingRemove =
  <E, A extends any[]>(el: E) =>
  (arr: A): A => {
    const idx = arr.indexOf(el);
    arr.splice(idx, 1);
    return arr;
  };
