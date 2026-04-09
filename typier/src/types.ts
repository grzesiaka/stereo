/**
 * A type definition
 */
export interface TypierBase<$TYP extends string, $KEY extends string = $TYP> {
  $TYP: $TYP;
  $KEY: $KEY;
}
