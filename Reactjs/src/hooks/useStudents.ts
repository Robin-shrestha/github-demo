import { useCallback, useEffect, useState } from "react";
import type { Student } from "../types/types";
import { getStudents, deleteStudent } from "../api/students";

type StudentsState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; students: Student[] };

export interface UseStudentsResult {
  state: StudentsState;
  removeStudent: (id: number | string) => Promise<void>;
}

function useStudents(): UseStudentsResult {
  const [state, setState] = useState<StudentsState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const students = await getStudents();
        if (cancelled) return;
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

  const removeStudent = useCallback(async (id: number | string): Promise<void> => {
    try {
      await deleteStudent(id);
      setState((prev) => {
        if (prev.status !== "success") return prev;
        return { status: "success", students: prev.students.filter((s) => s.id !== id) };
      });
    } catch (err: unknown) {
      console.error("Failed to delete student", err);
    }
  }, []);

  return { state, removeStudent };
}

export default useStudents;
