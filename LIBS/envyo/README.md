# envyo

## Problem to address

1.  Improve ergonomics of working with JS environments: web, node.
<!-- 1.  Improve Typescript support for JS environments. -->
1.  Create slim wrappers for most common apis / use cases.
1.  Unify naming; allow default names for automatic tracking of performed actions.
1.  Group global scope objects into meaningful namespaces.
1.  Modularize global scope.
1.  Allow importing types without modifying tsconfig.json.
1.  Create extended apis with external packages.

### To address later

1.  Prevent pollution of global scope altogether; it would require custom <reference> and/or generating own types. For now using a linting rule is a good enough alternative.

## How to use

### Install

`pnpm|yarn|npm install envyo`

### Import

_(this was written just as a rough plan; if you reading it it might mean one of: 1. it was not implemented 2. README.md was not updated after implementation 3. It is under construction right now)_

Just types:
`import 'node';` | `import 'web';`

Default wrapper:
`import $ from 'node';` | `import $ from 'web';`

Wrapper constructor (sync):

```typescript
import { $$ } from "node"; // | 'web';
const $ = $$(/* options */);
```

<!--

Probably better would be to just allow passing requested modules to unblock features

Wrapper constructor async - for dynamically importing modules:

```typescript
import { $$ } from "node";
const $ = await $$({
  modules: ["path"], // module options
  /* other options */
});
``` -->
