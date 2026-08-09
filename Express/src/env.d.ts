// Describes the variables this app expects in .env, the same way Reactjs
// declares its VITE_ variables. Types only, nothing is loaded here.
declare namespace NodeJS {
  interface ProcessEnv {
    readonly MONGO_URI?: string;
    readonly MONGO_DB_NAME?: string;
    readonly PORT?: string;
  }
}
