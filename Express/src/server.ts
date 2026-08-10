import express from "express";
import { envConstants } from "./constants/env.ts";
import { requestLogger } from "./middleware/requestLogger.ts";
import { notFound } from "./middleware/notFound.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import studentsRouter from "./routes/students.ts";

const app = express();
const { PORT } = envConstants;

app.use(requestLogger);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express" });
});

app.use("/students", studentsRouter);

// Both of these must come last, and in this order.
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
