export const $clamp = () => (min, max) => (val) => Math.min(max, Math.max(min, val));
export const clamp = $clamp();
