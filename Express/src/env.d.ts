// Types only. Values are loaded by dotenv in constants/env.ts.
declare namespace NodeJS {
  interface ProcessEnv {
    readonly MONGO_URI?: string;
    readonly MONGO_DB_NAME?: string;
    readonly PORT?: string;
    readonly CLIENT_ORIGIN?: string;
    readonly JWT_SECRET?: string;
    readonly CLOUDINARY_CLOUD_NAME?: string;
    readonly CLOUDINARY_API_KEY?: string;
    readonly CLOUDINARY_API_SECRET?: string;
  }
}
