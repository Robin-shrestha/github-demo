import { useNavigate } from "react-router-dom";
import AddStudentForm from "../components/AddStudentForm";
import { addStudent } from "../api/students";
import { useAppSelector } from "../store/hooks";
import type { Student } from "../types/types";

function AddStudentPage() {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);

  async function handleAddStudent(newStudent: Omit<Student, "id">): Promise<void> {
    if (!token) return;

    const created = await addStudent(newStudent, token);
    navigate(`/students/${created.id}`);
  }

  return <AddStudentForm onAddStudent={handleAddStudent} />;
}

export default AddStudentPage;
