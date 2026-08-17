import cors from "cors";
import express from "express";
import { envConstants } from "./constants/env.ts";
import { connectWithMongoose } from "./config/mongoose.ts";
import { requestLogger } from "./middleware/requestLogger.ts";
import { notFound } from "./middleware/notFound.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import studentsRouter from "./routes/students.ts";
import { BadRequest } from "./types/httpError.ts";

const app = express();
const { PORT } = envConstants;

app.use(cors({ origin: envConstants.CLIENT_ORIGIN }));

// A single origin covers this app. When several are allowed, origin takes a
// function instead and the decision is made per request.
//
// const allowed = envConstants.CLIENT_ORIGIN.split(",").map((o) => o.trim());
// app.use(
//   cors({
//     origin(origin, callback) {
//       // origin is undefined for same origin requests and for anything that
//       // is not a browser, so rejecting it breaks curl and Thunder Client.
//       if (!origin || allowed.includes(origin)) {
//         callback(null, true);
//         return;
//       }

//       // false omits the headers and lets the browser block it. Passing an
//       // Error here would send a 500 through the error handler instead.
//       callback(null, false);
//     },
//     credentials: true,
//   })
// );

app.use(requestLogger);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express" });
});

app.use("/students", studentsRouter);

// Both of these must come last, and in this order.
app.use(notFound);
app.use(errorHandler);

try {
  await connectWithMongoose();
} catch (err) {
  console.error("Could not connect to MongoDB. Is it running? Try npm run db:start");
  console.error(err);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
