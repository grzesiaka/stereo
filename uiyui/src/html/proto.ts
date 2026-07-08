export {};

declare global {
  interface HTMLElement<States = {}> {
    $states: States;
    $$$(): States;
  }
}

// oxlint-disable-next-line no-undef
HTMLElement.prototype.$$$ = function () {
  return this.$states;
};
