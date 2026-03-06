export type Capped<X = unknown, N extends number | undefined = number | undefined> = X[] & (number | undefined extends N ? {
    cap?: N;
} : {
    cap: N;
});
/**
 * Creates a mutable capped array; cap is only respected when adding single items via `.push`
 * @param c Cap / max items
 * @param $ initial array defaults to []
 * @returns a capped array
 */
export declare const capped: {
    <Cap extends number | undefined, X>(c?: Cap, ...$: X[]): Capped<X, Cap>;
    isFull(a: Capped): boolean;
};
export default capped;
//# sourceMappingURL=capped.d.ts.map