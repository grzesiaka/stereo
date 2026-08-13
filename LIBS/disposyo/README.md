# Disposyo

> "Ciap, ciap"

A tiny utility for transparent disposing. Provide logic to dispose as a function (`() => void`) or an array of functions (`(() => void)[]`) or a tree with formed from functions / arrays. In `return` you get single `() => void` with property `__`. `__[1]` holds what will be disposed by calling the `return`ee. [Example usage.](https://github.com/grzesiaka/stereo/tree/main/libs/disposyo/test)
