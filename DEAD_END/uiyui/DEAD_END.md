# Post-mortem

## The initial goal

1.  A thin & slim wrapper for DOM elements creation.
1.  A stricter typing.
1.  Support for multi-state elements - a switch that automatically updates class.
1.  Separation of static (view / template) and runtime (events / logic / updates).
1.  Static description as data.

## Why it failed?

Actually it did not. The main problem is how heavy Typescript's dom.lib.ts is. Better not to manipulate / depend on these types at all.

## What is next?

Restart the module with no dependencies on heavy types. Keep the core slim, create abstractions and only then materialize.
Do not limit the targets to DOM, allow React and especially React Native.
