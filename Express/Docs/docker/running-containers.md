# Building and Running Containers

Two commands cover most of local Docker work: `docker build` to produce an image, `docker run`
to start a container from it.

## Building

```bash
docker build -t express-backend .
```

`-t express-backend` tags the image with a name (otherwise it only gets an id, awkward to
refer to later). The trailing `.` is the **build context** — the folder Docker reads the
Dockerfile and any `COPY`-ed files from. It has to be a path containing everything the
Dockerfile references, which is why `docker build` is normally run from the project root.

## Running

```bash
docker run -p 3001:3001 --env-file .env express-backend
```

- `-p 3001:3001` publishes a port. The container is its own isolated network namespace — a
  port `EXPOSE`d in the Dockerfile isn't reachable from outside the container until it's
  published. The format is `host:container`, so `-p 8080:3001` would make the app (still
  listening on 3001 inside the container) reachable at `localhost:8080` outside it.
- `--env-file .env` loads environment variables from a file — the same `MONGO_URI`,
  `JWT_SECRET`, and so on this app already requires locally. Nothing about `ENV NODE_ENV=production`
  in the Dockerfile supplies these; they're runtime configuration, not part of the image.
- The container's own `console.log` output streams to the terminal by default. Add `-d` to run
  it detached (in the background) instead.

## Watching and managing containers

```bash
docker ps                 # list running containers
docker logs <container>   # see its output after the fact (needed once it's detached)
docker exec -it <container> sh   # open a shell inside a running container
docker stop <container>   # stop it
docker rm <container>     # remove a stopped container
```

A container name or id (shown in `docker ps`) identifies which one to target — useful once
more than one is running at a time.

## Data doesn't persist by default

A container's filesystem is thrown away when the container is removed. This project's
Dockerfile creates an empty `uploads/` folder at build time (`RUN mkdir -p uploads`) rather
than copying in anything local, specifically so a fresh container never ships stale test
files — but it also means anything written to `uploads/` while the container runs (a real
photo upload, say) disappears the moment that container is removed.

For anything that needs to survive a container being replaced, a **volume** maps a folder on
the container back to somewhere that outlives it:

```bash
docker run -p 3001:3001 -v $(pwd)/uploads:/app/uploads --env-file .env express-backend
```

This isn't the answer for a real deployment (a host folder won't exist on most hosting
platforms) — it's mentioned here because it's the local-development equivalent of a problem
that comes back, with a different solution, once this backend is deployed.
