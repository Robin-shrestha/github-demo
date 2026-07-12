import { useEffect, useState } from "react";
import type { Student } from "../types/types";

interface RawStudent {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

type StudentsState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; students: Student[] };

export interface UseStudentsResult {
  state: StudentsState;
  addStudent: (student: Omit<Student, "id">) => void;
}

const STUDENTS_ENDPOINT = "http://0.0.0.0:3000/students";

function useStudents(): UseStudentsResult {
  const [state, setState] = useState<StudentsState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(STUDENTS_ENDPOINT);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = (await response.json()) as RawStudent[];
        if (cancelled) return;

        const students: Student[] = data.map((raw) => ({
          id: raw.id,
          name: raw.name,
          role: raw.role,
          avatar: raw.avatar,
        }));
        setState({ status: "success", students });
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "Unknown error — is the Week 2 json-server running on port 3000?";
        setState({ status: "error", error: message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function addStudent(newStudent: Omit<Student, "id">): void {
    setState((prev) => {
      if (prev.status !== "success") return prev;
      const id = prev.students.length ? Math.max(...prev.students.map((s) => s.id)) + 1 : 1;
      return { status: "success", students: [...prev.students, { id, ...newStudent }] };
    });
  }

  return { state, addStudent };
}

export default useStudents;
