import { useEffect, useState } from "react";
import type { Student } from "../types/types";
import { getStudentById } from "../api/students";

export type StudentState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; error: string }
  | { status: "success"; student: Student };

function useStudent(id: string | undefined): StudentState {
  const [state, setState] = useState<StudentState>({ status: "loading" });

  useEffect(() => {
    if (!id) {
      setState({ status: "not-found" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    (async () => {
      try {
        const student = await getStudentById(id);
        if (cancelled) return;
        if (!student) {
          setState({ status: "not-found" });
          return;
        }
        setState({ status: "success", student });
      } catch (err: unknown) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Unknown error";
        setState({ status: "error", error: message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}

export default useStudent;
