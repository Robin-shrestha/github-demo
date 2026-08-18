import { useCallback, useState } from "react";
import type { Student } from "../types/types";
import { uploadStudentPhoto } from "../api/students";

export type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "error"; error: string }
  | { status: "success"; student: Student };

export interface UseUploadStudentPhotoResult {
  state: UploadState;
  upload: (id: string, file: File) => Promise<void>;
}

function useUploadStudentPhoto(): UseUploadStudentPhotoResult {
  const [state, setState] = useState<UploadState>({ status: "idle" });

  const upload = useCallback(async (id: string, file: File) => {
    setState({ status: "uploading" });

    try {
      const student = await uploadStudentPhoto(id, file);
      setState({ status: "success", student });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setState({ status: "error", error: message });
    }
  }, []);

  return { state, upload };
}

export default useUploadStudentPhoto;
