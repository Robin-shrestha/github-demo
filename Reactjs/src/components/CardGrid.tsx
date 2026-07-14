import { useState } from "react";
import StudentCard from "./StudentCard";
import AddStudentForm from "./AddStudentForm";
import type { Student } from "../types/types";

function CardGrid() {
  const [students, setStudents] = useState<Student[]>([]);

  function handleViewProfile(id: number): void {
    console.log(`View profile for student ${id}`);
  }

  function handleAddStudent(newStudent: Omit<Student, "id">): void {
    const id = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    setStudents((prev) => [...prev, { id, ...newStudent }]);
  }

  return (
    <div style={{ background: "#ddd " }}>
      <AddStudentForm onAddStudent={handleAddStudent} />
      <div className="card-grid">
        {students.map((student) => {
          return (
            <StudentCard
              key={student.id}
              {...student}
              avatar="url"
              onViewProfile={handleViewProfile}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CardGrid;
