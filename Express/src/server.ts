import express from "express";
import studentsRouter from "./routes/students.ts";

const app = express();
const PORT = 3001;

// Parses JSON request bodies and puts the result on req.body.
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express" });
});

app.use("/students", studentsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
