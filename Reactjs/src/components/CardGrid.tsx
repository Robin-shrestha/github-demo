import { useState } from "react";
import StudentCard from "./StudentCard";
import AddStudentForm from "./AddStudentForm";
import type { Student } from "../types/types";

const initialStudents: Student[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Frontend Track",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
  },
  {
    id: 2,
    name: "Priya Thapa",
    role: "Backend Track",
    avatarUrl: "https://i.pravatar.cc/300?img=5",
  },
  {
    id: 3,
    name: "Bikash Rai",
    role: "Fullstack Track",
    avatarUrl: "https://i.pravatar.cc/300?img=12",
  },
];

function CardGrid() {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  function handleViewProfile(id: number): void {
    console.log(`View profile for student ${id}`);
  }

  function handleAddStudent(newStudent: Omit<Student, "id">): void {
    const id = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    setStudents((prev) => [...prev, { id, ...newStudent }]);
  }

  return (
    <div>
      <AddStudentForm onAddStudent={handleAddStudent} />
      <div className="card-grid">
        {students.map((student) => (
          <StudentCard key={student.id} {...student} onViewProfile={handleViewProfile} />
        ))}
      </div>
    </div>
  );
}

export default CardGrid;
