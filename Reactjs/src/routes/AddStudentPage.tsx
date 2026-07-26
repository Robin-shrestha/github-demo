import { useNavigate } from "react-router-dom";
import AddStudentForm from "../components/AddStudentForm";
import { useAddStudentMutation } from "../store/studentsApi";
import type { Student } from "../types/types";

function AddStudentPage() {
  const navigate = useNavigate();
  const [addStudent] = useAddStudentMutation();

  async function handleAddStudent(newStudent: Omit<Student, "id">): Promise<void> {
    const created = await addStudent(newStudent).unwrap();
    navigate(`/students/${created.id}`);
  }

  return <AddStudentForm onAddStudent={handleAddStudent} />;
}

export default AddStudentPage;
