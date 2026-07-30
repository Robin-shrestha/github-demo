# CommonJS vs ES Modules

Node has two module systems. CommonJS came first and is still everywhere in older code.
ES Modules are the standard built into the language, and the same `import`/`export` syntax
used in frontend code.

## The syntax

CommonJS:

```js
// math.cjs
function add(a, b) {
  return a + b;
}
module.exports = { add };

// main.cjs
const { add } = require("./math.cjs");
```

ES Modules:

```js
// math.mjs
export function add(a, b) {
  return a + b;
}

// main.mjs
import { add } from "./math.mjs";
```

## Which system a file uses

The nearest `package.json` decides, and explicit extensions override it.

| File   | Treated as                                              |
| ------ | ------------------------------------------------------- |
| `.cjs` | CommonJS, always                                        |
| `.mjs` | ES Modules, always                                      |
| `.js`  | Whatever the nearest `package.json` `"type"` field says |

With `"type": "module"` in package.json, plain `.js` files are ES Modules. Without it, they
are CommonJS.

## Evaluation order

`require()` runs at the exact line where it appears, so code above it runs first.

`import` statements are hoisted. Every imported file is evaluated before the importing
file's first line runs. Two files that log on load will print in opposite order depending on
which system they use.

## Copies vs live bindings

CommonJS exports a value. `module.exports = { count }` copies whatever `count` was at that
moment, so later changes inside the module are not visible to whoever imported it.

ES Modules export a live binding. If the exported variable changes inside the module, code
that imported it sees the new value. Assigning to an imported binding from the outside is
not allowed and throws a `TypeError`.

## What exists in one and not the other

Only in CommonJS:

- `__dirname` and `__filename`
- `require.cache`
- `this` is `module.exports` at the top level
- `require()` can be called anywhere, including inside an `if`

Only in ES Modules:

- `import.meta.url`, `import.meta.dirname`, `import.meta.filename`
- top-level `await`, with no async wrapper needed
- `this` is `undefined` at the top level

`import` is static and cannot be put inside a condition. When conditional loading is needed,
`await import("...")` does it and returns a promise.

## Which to use

New Node code should use ES Modules. It is the language standard, it matches frontend
syntax, and top-level await is useful in startup code. CommonJS is still worth understanding,
because a large amount of existing code and many tutorials use `require()`.
