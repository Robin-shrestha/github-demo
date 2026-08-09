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
  PORT: Number(process.env.PORT ?? 3001),
};
