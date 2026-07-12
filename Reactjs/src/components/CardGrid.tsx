import { useCallback, useMemo } from "react";
import StudentCard from "./StudentCard";
import AddStudentForm from "./AddStudentForm";
import useStudents from "../hooks/useStudents";

function CardGrid() {
  const { state, addStudent } = useStudents();

  const handleViewProfile = useCallback((id: number): void => {
    console.log(`View profile for student ${id}`);
  }, []);

  const sortedStudents = useMemo(() => {
    if (state.status !== "success") return [];
    return [...state.students].sort((a, b) => a.name.localeCompare(b.name));
  }, [state]);

  if (state.status === "loading") {
    return <p className="status-message">Loading students...</p>;
  }

  if (state.status === "error") {
    return (
      <p className="status-message status-message--error">Could not load students: {state.error}</p>
    );
  }

  return (
    <div>
      <AddStudentForm onAddStudent={addStudent} />
      <div className="card-grid">
        {sortedStudents.map((student) => {
          return <StudentCard key={student.id} {...student} onViewProfile={handleViewProfile} />;
        })}
      </div>
    </div>
  );
}

export default CardGrid;
