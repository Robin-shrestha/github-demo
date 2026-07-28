# Environment Variables

Environment variables let the same code run against different settings without editing the code. The classic example is an API base URL that points at a local server in development and a real server in production.

## Why use them

You do not want to hardcode values that change between environments. Hardcoding means editing source and rebuilding every time you switch targets, and it is easy to ship the wrong value by accident. An environment variable pulls that value out of the code and into configuration, so the same build logic works everywhere and only the config changes.

Typical uses: API URLs, feature flags, analytics keys, and the current mode (development vs production).

## How they work in a frontend build

In a browser app there is no running server environment to read from at request time. The build tool reads the variables at build time and substitutes their values straight into the bundled output. The values are baked in when you build.

Most tools also require a naming prefix so you do not accidentally leak unrelated system variables into the browser bundle. Only prefixed variables are exposed to your app code.

Because the values are embedded into the shipped JavaScript, anything you put in a frontend environment variable is public. Anyone can read it in the browser. So these are fine for non-secret config (URLs, flags) and never for real secrets (private API keys, passwords). Secrets belong on a backend the browser talks to, not in the frontend bundle.

## Quick recap

| Idea                    | What it means                                         |
| ----------------------- | ----------------------------------------------------- |
| Environment variable    | A value supplied from config, not hardcoded in source |
| Build-time substitution | The frontend build bakes the values into the bundle   |
| Naming prefix           | Only prefixed variables are exposed to browser code   |
| Not secret              | Anything in a frontend env var is visible to users    |
