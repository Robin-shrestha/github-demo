# Multi-Stage Builds

A multi-stage Dockerfile has more than one `FROM`. Each `FROM` starts a fresh stage, and later
stages can selectively copy files out of earlier ones. This project's Dockerfile has two:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
RUN mkdir -p uploads

EXPOSE 3001
CMD ["node", "dist/server.js"]
```

## Why two stages

Building this app needs things that running it doesn't. Compiling TypeScript needs the
TypeScript compiler and every devDependency; running the compiled output just needs Node and
the production dependencies.

Without a second stage, all of that build tooling — `typescript`, `@types/*`, the full
`node_modules`, the original `.ts` source — would ship inside the final image, unused. It
adds size and surface area for no benefit; none of it is needed once `dist/` exists.

## How it works

- The stage named `build` (`AS build`) installs *all* dependencies (`npm ci`, no `--omit`),
  copies in the full source, and runs `npm run build`, which compiles TypeScript to `dist/`.
- The stage named `runtime` starts over from a clean `node:22-alpine` — none of the `build`
  stage's filesystem carries over automatically.
- `COPY --from=build /app/dist ./dist` reaches back into the `build` stage and pulls out only
  the compiled `dist/` folder. Nothing else from that stage — not `node_modules`, not the
  `.ts` source — makes it into the final image.
- The `runtime` stage then does its own `npm ci --omit=dev`, installing only what's listed
  under `"dependencies"` in `package.json`, skipping `"devDependencies"` entirely.

## The result

`docker build` still runs both stages, so the build itself does the same amount of work either
way. What changes is the final image: only the `runtime` stage's layers are kept and tagged.
The `build` stage — TypeScript, source files, devDependencies — is discarded once the copy is
done. A `docker images` comparison against a single-stage version of the same Dockerfile would
show a noticeably smaller final image, and nothing in it that isn't needed to actually run the
app.
