import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import StudentCard from "./StudentCard";
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
  const { state, removeStudent } = useStudents();
  const [renderCount, setRenderCount] = useState(0);

  const sortedStudents = useMemo(() => {
    if (state.status !== "success") return [];
    const sorted = expensiveSort(state.students);
    console.log("memoize called", sorted);
    return sorted;
  }, [state]);

  if (state.status === "loading") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, padding: 2 }}>
        <CircularProgress size={20} />
        <Typography>Loading students...</Typography>
      </Box>
    );
  }

  if (state.status === "error") {
    return <Alert severity="error">Could not load students: {state.error}</Alert>;
  }

  return (
    <Box>
      <Button component={Link} to="/students/new" variant="contained" sx={{ mb: 3 }}>
        Add Student
      </Button>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
        {sortedStudents.map((student) => {
          return <StudentCard key={student.id} {...student} onDelete={removeStudent} />;
        })}
      </Box>

      <Button variant="outlined" onClick={() => setRenderCount((c) => c + 1)}>
        Force re-render, no data change ({renderCount})
      </Button>
    </Box>
  );
}

export default CardGrid;
