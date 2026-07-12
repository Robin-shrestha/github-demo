import { useCallback, useMemo, useState } from "react";
import StudentCard from "./StudentCard";
import AddStudentForm from "./AddStudentForm";
import useStudents from "../hooks/useStudents";
import type { Student } from "../types/types";

// Simulated expensive computation — busy-waits ~400ms so the useMemo demo
// below has something visible to skip.
function expensiveSort(students: Student[]): Student[] {
  const start = Date.now();
  while (Date.now() - start < 500) {}

  const sorted = [...students].sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}

function CardGrid() {
  const { state, addStudent, removeStudent } = useStudents();
  const [renderCount, setRenderCount] = useState(0);

  const handleViewProfile = useCallback((id: number): void => {
    console.log(`View profile for student ${id}`);
  }, []);

  const sortedStudents = useMemo(() => {
    if (state.status !== "success") return [];
    const sorted = expensiveSort(state.students);
    console.log("memoize called", sorted);
    return sorted;
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
      <button
        type="button"
        className="btn btn--refresh"
        onClick={() => setRenderCount((c) => c + 1)}
      >
        Force re-render, no data change ({renderCount})
      </button>
      <div className="card-grid">
        {sortedStudents.map((student) => {
          return (
            <StudentCard
              key={student.id}
              {...student}
              onViewProfile={handleViewProfile}
              onDelete={removeStudent}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CardGrid;
