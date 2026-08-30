# Dockerfile Basics

A Dockerfile is a plain text file of instructions for building an image, read top to bottom.
Each line is an instruction; running `docker build` executes them in order and produces an
image at the end.

Here's the runtime stage of this project's actual Dockerfile, instruction by instruction:

```dockerfile
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "dist/server.js"]
```

## FROM

Every Dockerfile starts with `FROM`, which picks the base image everything else builds on top
of. `node:22-alpine` already has Node 22 installed — the app doesn't need to install Node
itself, it just needs to add its own code on top.

## WORKDIR

Sets the working directory inside the image for every instruction that follows. `WORKDIR /app`
means `COPY`, `RUN`, and the eventual `CMD` all operate from `/app`. It also creates the
directory if it doesn't exist. Without it, everything lands in `/`, which works but is messy.

## ENV

Sets an environment variable inside the image. `ENV NODE_ENV=production` is picked up by
Express and other libraries to disable dev-only behavior (verbose error pages, certain
warnings). This is baked into the image itself — it's not the same as the app's `.env` file,
which holds secrets and per-deployment config and is never copied into the image (see
`dockerignore-basics.md`).

## COPY

Copies files from the build context (the folder `docker build` is run from) into the image.

```dockerfile
COPY package*.json ./
```

copies just the two package files. Doing this *before* copying the rest of the source is
deliberate — it's a layer-caching trick, explained below.

## RUN

Executes a command *at build time*, and whatever it produces becomes part of the image layer.

```dockerfile
RUN npm ci --omit=dev
```

installs dependencies once, during the build — not every time the container starts. `npm ci`
(rather than `npm install`) installs exactly what's in `package-lock.json`, so the build is
reproducible.

## EXPOSE

Documents which port the app listens on inside the container. `EXPOSE 3001` doesn't publish
anything by itself — it's metadata, mainly useful to a person reading the Dockerfile. Actually
making the port reachable from outside the container happens with `docker run -p`, covered in
`running-containers.md`.

## CMD

The command that runs when a container starts from this image — not at build time, unlike
`RUN`. There's exactly one `CMD` per image (a later one overrides an earlier one), and it's
written as an array: program first, then its arguments.

```dockerfile
CMD ["node", "dist/server.js"]
```

This is the containerized equivalent of `npm start`, and it's why the build stage has to run
`tsc` first — the container never runs TypeScript directly, only the compiled `dist/` output.

## Layer caching, in practice

Docker caches each layer and reuses it if the instruction and everything before it are
unchanged. That's why `package*.json` is copied and installed *before* the rest of the source:

```dockerfile
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
```

Editing a controller and rebuilding doesn't touch `package.json`, so the `npm ci` layer above
it is still valid and gets reused — the rebuild skips straight to copying the new `dist/`
output. Reverse the order (`COPY . .` before `npm ci`) and *any* source change invalidates the
install layer, forcing a full dependency reinstall on every build.
