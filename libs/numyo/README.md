# numyo

Type-strict arithmetic and comparison operations.

## Features

1. Support for exact type-level arithmetic and comparisons operations. Mostly a wrapper around wonderful [ts-arithmetic](https://github.com/arielhs/ts-arithmetic).

1. Support for type-level arithmetic operations respecting [type-fest/Tagged](https://github.com/sindresorhus/type-fest/blob/main/source/tagged.d.ts).

1. Support for array argument for commutative operations ([sum](./src/base/sum.ts), [product](./src/base/product.ts)).

## TODO

- [ ] Allow params to be restricted to single/common Tagged type.
- [ ] Support for some statistical calculations.
