import { MongoClient, ServerApiVersion } from "mongodb";

import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env and fill it in.`
    );
  }

  return value;
}
export const envConstants = {
  MONGO_URI: required("MONGO_URI"),
  MONGO_DB_NAME: required("MONGO_DB_NAME"),
};

// One client for the whole app. It manages a pool of connections, so it is
// created once and shared rather than opened per query.
export const client = new MongoClient(envConstants.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Fires each time the pool opens a socket,
// client.on("connectionCreated", (event) => {
//   console.log("connectionCreated:", event.address, `#${event.connectionId}`);
// });

// client.on("connectionClosed", () => {
//   console.log("Connection closed");
// });

export const db = client.db(envConstants.MONGO_DB_NAME);

export async function connectToDatabase(): Promise<void> {
  await client.connect();

  await db.command({ ping: 1 });

  console.log(`Connected to MongoDB: ${db.databaseName}`);
}

export async function disconnectFromDatabase(): Promise<void> {
  await client.close();
  console.log("Disconnected from MongoDB");
}
