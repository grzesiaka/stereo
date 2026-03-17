# ArrObje (array + object)

It projects a tuple to a selected field, and at the same time it creates indexed object based on another field.

```typescript
arrObje.$(
  "key",
  "value",
  "__",
)([
  { key: "A", value: "a" },
  { key: "B", value: "b" },
  { key: "C", value: "c" },
]); // ===> ['a', 'b', 'c'] & { __: { A: 'a', B: 'b', C: 'c' }}
```
