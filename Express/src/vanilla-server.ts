import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  addStudent,
  deleteStudent,
  findStudent,
  listStudents,
  updateStudent,
} from "./data/studentsData.ts";
import type { NewStudent } from "./types/studentTypes.ts";

const PORT = 3001;

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

// The body arrives in chunks and has to be collected, then parsed by hand.
function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (raw === "") {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}

function validateStudent(body: unknown): NewStudent | null {
  if (typeof body !== "object" || body === null) return null;
  const { name, role, avatar } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim() === "") return null;
  if (typeof role !== "string" || role.trim() === "") return null;
  if (typeof avatar !== "string" || avatar.trim() === "") return null;
  return { name, role, avatar };
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const method = req.method ?? "GET";
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const path = url.pathname.replace(/\/$/, "") || "/";

  console.log(`${method} ${url.pathname}`);

  if (path === "/" && method === "GET") {
    sendJson(res, 200, { message: "Hello from Node" });
    return;
  }

  if (path === "/students") {
    if (method === "GET") {
      const role = url.searchParams.get("role");
      const students = listStudents();
      sendJson(res, 200, role ? students.filter((s) => s.role === role) : students);
      return;
    }

    if (method === "POST") {
      let body: unknown;
      try {
        body = await readJsonBody(req);
      } catch {
        sendJson(res, 400, { error: "Invalid JSON body" });
        return;
      }

      const input = validateStudent(body);

      if (!input) {
        sendJson(res, 400, { error: "name, role and avatar are required" });
        return;
      }

      sendJson(res, 201, addStudent(input));
      return;
    }

    sendJson(res, 405, { error: `Method ${method} not allowed on /students` });
    return;
  }

  // The dynamic :id segment has to be matched manually
  const match = path.match(/^\/students\/([^/]+)$/);
  if (match) {
    const id = match[1];

    if (method === "GET") {
      const student = findStudent(id);
      if (!student) {
        sendJson(res, 404, { error: `No student with id ${id}` });
        return;
      }
      sendJson(res, 200, student);
      return;
    }

    if (method === "PUT") {
      let body: unknown;
      try {
        body = await readJsonBody(req);
      } catch {
        sendJson(res, 400, { error: "Invalid JSON body" });
        return;
      }

      const input = validateStudent(body);
      if (!input) {
        sendJson(res, 400, { error: "name, role and avatar are required" });
        return;
      }

      const updated = updateStudent(id, input);
      if (!updated) {
        sendJson(res, 404, { error: `No student with id ${id}` });
        return;
      }
      sendJson(res, 200, updated);
      return;
    }

    if (method === "DELETE") {
      if (!deleteStudent(id)) {
        sendJson(res, 404, { error: `No student with id ${id}` });
        return;
      }
      res.writeHead(204);
      res.end();
      return;
    }

    sendJson(res, 405, { error: `Method ${method} not allowed on ${path}` });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
