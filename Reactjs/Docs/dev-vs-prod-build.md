# Dev Build vs Prod Build

A modern build tool runs your app in two very different modes. Knowing the difference explains a lot of "why is it slow / big / different in production" questions.

## The dev build

The dev server is tuned for fast feedback while you code. It serves your source files with little or no bundling, swaps changed modules in place without a full reload (hot module replacement), keeps everything readable, and includes extra runtime checks and warnings to help you catch mistakes.

It is not optimized for size or speed. The point is a quick edit-and-see loop, not shipping.

## The prod build

The production build is what you actually deploy. The tool bundles your code, removes anything unused (tree-shaking), minifies it (strips whitespace, shortens names), splits it into cache-friendly files with hashed names, and drops development-only warnings. The output is a set of static files, usually in a `dist` folder.

## Differences

The two modes optimize for opposite goals. Development wants readability and instant feedback. Production wants the smallest, fastest download for real users on real networks. You cannot have both at once, so the tool gives you a different build for each.

## Quick recap

| Mode       | Optimized for                           | Output                         |
| ---------- | --------------------------------------- | ------------------------------ |
| Dev build  | Fast iteration, readable code, warnings | Served in memory, not bundled  |
| Prod build | Small, fast download for users          | Minified, bundled static files |
