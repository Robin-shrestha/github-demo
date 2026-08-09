# MongoDB Setup

Install before class and verify it works. A broken install found during the session costs
everyone time.

## Install

**macOS**, using Homebrew:

```
brew tap mongodb/brew
brew install mongodb-community
```

**Windows**: download the MongoDB Community Server MSI from the MongoDB download centre and
run it. Choose "Install MongoDB as a Service" so it starts with the machine. Tick MongoDB
Compass when offered.

**Linux**: follow the official instructions for your distribution, then
`sudo systemctl start mongod`.

## Config

```
systemLog:
  destination: file
  path: path/to/log/mongo.log
  logAppend: true
storage:
  dbPath: path/to/db/storage
net:
  bindIp: 127.0.0.1, ::1
  ipv6: true
```

## start

```
mongod --config path/to/config/file
```

## Verify

```
mongosh --eval "db.runCommand({ping:1})"
```

A response containing `ok: 1` means it is running. Report this before class.

If `mongosh` is not recognised as a command, install the MongoDB Shell separately. It ships
apart from the server on some platforms.

## Compass

The GUI. Connect to:

```
mongodb://127.0.0.1:27017
```

Being able to see documents while writing code is worth the install on its own.

## Common problems

**Connection refused on port 27017.** The server is not running. On macOS
`brew services list`, on Windows check the MongoDB service in Services.

**Command not found.** Installed but not on the PATH. On Windows this usually means the `bin`
folder was not added during setup.

**Port already in use.** Another `mongod` is already running, which is fine. Do not start a
second one.

## Fallback: MongoDB Atlas

If a local install cannot be made to work, Atlas is a hosted MongoDB with a free tier. It
needs an account and an internet connection, but it works the same from application code.

1. Create a free account and a free M0 cluster
2. Under Database Access, add a database user with a password
3. Under Network Access, allow your current IP address
4. Copy the connection string, which looks like
   `mongodb+srv://user:password@cluster.mongodb.net/students`
5. Use that instead of the local URI

Everything else, schemas, models and queries, is identical. Only the connection string
changes, which is a reasonable demonstration of why that string belongs in configuration
rather than hardcoded.
