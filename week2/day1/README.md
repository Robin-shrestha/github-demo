# Week 2 — Day 1: Setup

## Installing Node.js

You need Node.js installed to run these examples. Install the **LTS version**.

### Option A: Direct installer (simplest)

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** version for your OS
3. Run the installer and accept the defaults

### Option B: nvm (recommended if you'll switch Node versions later)

**Mac/Linux:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Restart your terminal, then:

```bash
nvm install --lts
nvm use --lts
```

**Windows:**
Use [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) instead — download the installer from the Releases page, then:

```bash
nvm install lts
nvm use lts
```

### Verify the install

```bash
node -v
npm -v
```

Both commands should print a version number. If you get "command not found," restart your terminal — if it still fails, the installer likely didn't add Node to your PATH.

## Running the JS examples

From this folder:

```bash
node 01-destructuring-spread.js
```

## Running the TypeScript example

TypeScript needs a compile step before it can run.

```bash
npm install -g typescript
tsc 04-typescript-basics.ts
node 04-typescript-basics.js
```

Or paste the file's contents into the [TypeScript Playground](https://www.typescriptlang.org/play) — no install needed, and you can see type errors inline as you type.
