# Docker Compose Basics

Everything so far runs one container by hand: `docker build`, then a `docker run` with a
growing list of flags for the port, the env file, maybe a volume. That's fine for one
container. It stops being fine the moment a second one shows up — say, a local MongoDB
alongside the backend, so the whole stack runs without depending on Atlas being reachable.

Compose solves that by describing the containers a project needs in one YAML file, then
starting or stopping all of them with one command instead of a growing pile of `docker run`s.

## compose.yaml

A minimal one for this project, running the backend alongside a local Mongo instead of Atlas:

```yaml
services:
  app:
    build: .
    ports:
      - "3001:3001"
    env_file: .env
    environment:
      MONGO_URI: mongodb://mongo:27017
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Each entry under `services` is one container, described declaratively instead of as command
flags. `app` and `mongo` map directly onto two `docker run` commands — the file just says what
they are instead of how to invoke them one at a time.

## Commands

```bash
docker compose up          # build (if needed) and start every service
docker compose up -d       # same, detached
docker compose up --build  # force a rebuild first (after Dockerfile or source changes)
docker compose down        # stop and remove the containers
docker compose logs -f app # follow one service's logs
```

`docker compose down` removes the containers but not named volumes by default — `mongo-data`
survives, so the database isn't wiped every time the stack restarts. `docker compose down -v`
removes volumes too, useful for starting from a genuinely clean database.

## What maps to what

Everything here is the same concept covered in `running-containers.md` and
`dockerignore-basics.md`, just written declaratively instead of passed as flags:

| `docker run` flag | Compose equivalent |
| --- | --- |
| `-p 3001:3001` | `ports: ["3001:3001"]` |
| `--env-file .env` | `env_file: .env` |
| `-v mongo-data:/data/db` | `volumes: ["mongo-data:/data/db"]` |
| `docker build -t ... .` then `docker run` | `build: .` |

## Two things Compose adds

**Networking.** Every service in the file joins the same network automatically, and each one
is reachable from the others by its service name. That's why `app`'s `MONGO_URI` above points
at `mongo:27017` rather than `localhost:27017` — from inside the `app` container, `localhost`
means the `app` container itself, not the `mongo` one sitting next to it. Compose gives each
service a hostname equal to its name in the file and resolves it automatically.

**Startup order.** `depends_on: [mongo]` makes Compose start `mongo` before `app`. It only
waits for the container to start, not for MongoDB inside it to be ready to accept connections
— on a slow start the app can still come up a moment before the database does. Handling that
gap (retrying the connection, or a proper healthcheck) is beyond what's covered here.

## Where this fits

Locally, Compose is mainly a convenience — one command instead of remembering several. It
matters more once a project has more than one container that needs to talk to each other,
which is exactly the Mongo-alongside-the-backend case above. This project's actual `.env`
points at MongoDB Atlas rather than a local container, so day to day only the single
`Dockerfile` covered elsewhere in these docs gets used — Compose is here because it's the
standard next step once "one container" becomes "more than one."
