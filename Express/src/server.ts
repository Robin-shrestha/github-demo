import express from "express";
import { requestLogger } from "./middleware/requestLogger.ts";
import { notFound } from "./middleware/notFound.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import studentsRouter from "./routes/students.ts";

const app = express();
const PORT = 3001;

app.use(requestLogger);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express" });
});

app.use("/students", studentsRouter);

// Both of these must come last, and in this order.
app.use(notFound); // this middle ware(not error handler) will catch all requests that don't match any route and send a 404 response
app.use(errorHandler); // this is the error handler that will catch any errors thrown in the routes and send a response with the appropriate status code and message

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
