// Types only. Values are loaded by dotenv in constants/env.ts.
declare namespace NodeJS {
  interface ProcessEnv {
    readonly MONGO_URI?: string;
    readonly MONGO_DB_NAME?: string;
    readonly PORT?: string;
    readonly CLIENT_ORIGIN?: string;
  }
}
