# Week 2 — Day 3: Async JS & Fetch

## Compiling

```bash
npm install -g typescript
tsc -p tsconfig.json
```

This produces `build/app.js`, `build/01-callbacks-and-callback-hell.js`, etc. `index.html` loads `build/app.js` directly — no separate step needed for the capstone.

## Running the standalone examples (01–04)

```bash
node build/01-callbacks-and-callback-hell.js
```

## To run mock data with json-server

```bash
npm install
npm run serve
```

This starts `json-server` on port 3000, bound to `0.0.0.0` so it's reachable from other devices on the same network, watching `db.json` (so live edits to the file are picked up without restarting).

### Find your local network IP

**Mac:**

```bash
ipconfig getifaddr en0
```

(use `en1` if you're on a different adapter)

**Windows:**

```bash
ipconfig
```

Look for "IPv4 Address" under your active adapter.

**Linux:**

```bash
hostname -I
```
