import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { envConstants } from "./constants/env.ts";
import { connectWithMongoose } from "./config/mongoose.ts";
import { requestLogger } from "./middleware/requestLogger.ts";
import { notFound } from "./middleware/notFound.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import studentsRouter from "./routes/students.ts";
import usersRouter from "./routes/users.ts";
import authRouter from "./auth/authRoutes.ts";
import { extendedCors } from "./middleware/cors.ts";

const app = express();
const { PORT } = envConstants;

// app.use(simpleCors);
app.use(extendedCors);
app.use(cookieParser());

app.use(requestLogger);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express" });
});

app.use("/students", studentsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

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
