import { useCallback, useEffect, useState } from "react";
import type { Student } from "../types/types";
import { getStudents, deleteStudent } from "../api/students";

type StudentsState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; students: Student[] };

export interface UseStudentsResult {
  state: StudentsState;
  removeStudent: (id: string, token: string) => Promise<void>;
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

  // not caught here, so withTokenRefresh can see a 401 and retry
  const removeStudent = useCallback(async (id: string, token: string): Promise<void> => {
    await deleteStudent(id, token);
    setState((prev) => {
      if (prev.status !== "success") return prev;
      return { status: "success", students: prev.students.filter((s) => s.id !== id) };
    });
  }, []);

  return { state, removeStudent };
}

export default useStudents;
