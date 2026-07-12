import { useCallback, useEffect, useState } from "react";
import type { Student } from "../types/types";

import { v4 as uuid } from "uuid";
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
  addStudent: (student: Omit<Student, "id">) => Promise<void>;
  removeStudent: (id: number) => Promise<void>;
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
        const message = err instanceof Error ? err.message : "Unknown error";
        setState({ status: "error", error: message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const addStudent = useCallback(async (newStudent: Omit<Student, "id">): Promise<void> => {
    try {
      const response = await fetch(STUDENTS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newStudent.name,
          role: newStudent.role,
          avatar: newStudent.avatar,
          id: uuid(),
        }),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const raw = (await response.json()) as RawStudent;
      const created: Student = { id: raw.id, name: raw.name, role: raw.role, avatar: raw.avatar };

      setState((prev) => {
        if (prev.status !== "success") return prev;
        return { status: "success", students: [...prev.students, created] };
      });
    } catch (err: unknown) {
      console.error("Failed to add student", err);
    }
  }, []);

  const removeStudent = useCallback(async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${STUDENTS_ENDPOINT}/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setState((prev) => {
        if (prev.status !== "success") return prev;
        return { status: "success", students: prev.students.filter((s) => s.id !== id) };
      });
    } catch (err: unknown) {
      console.error("Failed to delete student", err);
    }
  }, []);

  // async function removeStudent(id: number): Promise<void> {
  //   try {
  //     const response = await fetch(`${STUDENTS_ENDPOINT}/${id}`, { method: "DELETE" });
  //     if (!response.ok) {
  //       throw new Error(`Request failed with status ${response.status}`);
  //     }

  //     setState((prev) => {
  //       if (prev.status !== "success") return prev;
  //       return { status: "success", students: prev.students.filter((s) => s.id !== id) };
  //     });
  //   } catch (err: unknown) {
  //     console.error("Failed to delete student", err);
  //   }
  // }

  return { state, addStudent, removeStudent };
}

export default useStudents;
