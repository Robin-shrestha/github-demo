import cors from "cors";
import { envConstants } from "../constants/env.ts";

export const simpleCors = cors({ origin: envConstants.CLIENT_ORIGIN });

const allowed = envConstants.CLIENT_ORIGIN.split(",").map((o) => o.trim());

// A single origin covers this app. When several are allowed, origin takes a
// function instead and the decision is made per request.
export const extendedCors = cors({
  origin(origin, callback) {
    // origin is undefined for same origin requests and for anything that
    // is not a browser, so rejecting it breaks curl and Thunder Client.
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
      return;
    }

    // false omits the headers and lets the browser block it. Passing an
    // Error here would send a 500 through the error handler instead.
    callback(null, false);
  },
  credentials: true,
});
