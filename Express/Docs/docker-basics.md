# Docker Basics

Docker packages an app together with everything it needs to run — the runtime, the
dependencies, the OS-level bits — into one unit that behaves the same on any machine.

It exists because of a specific, familiar problem: code that runs on one machine and breaks
on another. Different Node version, a missing system library, an environment variable nobody
wrote down. "Works on my machine" is a dependency mismatch between machines. Docker removes
the mismatch by shipping the machine, or at least the relevant slice of it, along with the code.

## Images and containers

These two words get used loosely, but they mean different things.

An **image** is a blueprint. It's a read-only package containing an app's code, its
dependencies, and instructions for how to run it. Building an image doesn't run anything —
it just assembles the package.

A **container** is a running instance of an image. One image can produce many containers, the
same way one class can produce many objects, or one recipe can produce many meals. Each
container gets its own isolated filesystem and process space, but they all start from the
same image.

```
image  →  docker run  →  container
(blueprint)              (running process)
```

Stopping a container doesn't delete the image it came from. The same image can be started
again, or started multiple times at once, producing separate containers.

## Where images come from

Images are pulled from a **registry** — a server that stores and distributes them. Docker Hub
is the default, public one. When a Dockerfile says:

```dockerfile
FROM node:22-alpine
```

that's a registry lookup: pull the image tagged `22-alpine` from the `node` repository on
Docker Hub. `node:22-alpine` is an official image maintained by the Node.js project, built on
Alpine Linux — a minimal Linux distribution, which is why it's a common choice for keeping
images small.

Custom images (the app's own backend, for example) can also be pushed to a registry, which is
how a deploy pipeline later pulls it down to run in production.

## Layers

An image isn't one file — it's a stack of layers, one per instruction in the Dockerfile that
changes the filesystem (`COPY`, `RUN`, and so on). Each layer only stores what changed from
the layer before it, and Docker caches layers by content: if an instruction and everything
before it haven't changed, the build reuses the cached layer instead of redoing the work.

This is why instruction *order* in a Dockerfile matters — it's covered with a concrete example
in `dockerfile-basics.md`.
