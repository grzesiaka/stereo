type ARR<X = any> = ReadonlyArray<X>

export type $o<L extends ARR = ARR, I = unknown> = (...L: L) => o<L, I> 
export type o<L extends ARR, I> = () =>  1