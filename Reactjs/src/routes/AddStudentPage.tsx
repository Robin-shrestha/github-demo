import { useNavigate } from "react-router-dom";
import AddStudentForm from "../components/AddStudentForm";
import { addStudent } from "../api/students";
import type { Student } from "../types/types";

function AddStudentPage() {
  const navigate = useNavigate();

  async function handleAddStudent(newStudent: Omit<Student, "id">): Promise<void> {
    const created = await addStudent(newStudent);
    navigate(`/students/${created.id}`);
  }

  return <AddStudentForm onAddStudent={handleAddStudent} />;
}

export default AddStudentPage;
