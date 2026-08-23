import { useNavigate } from "react-router-dom";
import AddStudentForm from "../components/AddStudentForm";
import { addStudent } from "../api/students";
import { refreshAccessToken } from "../api/users";
import { withTokenRefresh } from "../api/httpClient";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setToken } from "../store/authSlice";
import type { Student } from "../types/types";

function AddStudentPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  async function handleAddStudent(newStudent: Omit<Student, "id">): Promise<void> {
    if (!token) return;

    const created = await withTokenRefresh(
      (t) => addStudent(newStudent, t),
      token,
      refreshAccessToken,
      (newToken) => dispatch(setToken(newToken))
    );

    navigate(`/students/${created.id}`);
  }

  return <AddStudentForm onAddStudent={handleAddStudent} />;
}

export default AddStudentPage;
