# .dockerignore

`.dockerignore` lists files and folders excluded from the build context before `docker build`
even starts. It's the same idea as `.gitignore`, applied to what gets sent into an image
instead of what gets committed.

This project's:

```
node_modules
dist
uploads
.env
.env.example
.git
.gitignore
*.md
npm-debug.log
```

Without it, `COPY . .` in the Dockerfile would copy everything in the project folder,
including things that shouldn't be there:

- **`node_modules`** — copying a host machine's installed packages into the image is pointless
  and sometimes actively wrong. Some packages compile native binaries specific to the OS they
  were installed on; a `node_modules` built on a Mac can silently fail to run inside a Linux
  container. The image installs its own dependencies with `npm ci` instead.
- **`.env`** — this holds real secrets: database URIs, JWT signing keys. Baking it into an
  image means anyone who later pulls or inspects that image can read them out. Configuration
  belongs at _runtime_ (`docker run --env-file`), never inside the image itself.
- **`.git`** — the entire commit history, copied in for no reason other than it happened to be
  sitting in the folder. Pure bloat.
- **`dist`, `uploads`** — build output and local upload data from the host. The image produces
  its own `dist/` during the build stage and starts `uploads/` fresh (see
  `multi-stage-builds.md` and `running-containers.md`).

## The build-speed side effect

The build context gets sent to the Docker build process before anything else happens — even
a `.dockerignore`'d-out `node_modules` sitting in the folder makes every build slower to start,
since Docker has to at least read the folder to know what to exclude. Keeping the context small
keeps builds fast, on top of keeping secrets and junk out of the image.
