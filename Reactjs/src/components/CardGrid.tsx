import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import StudentCard from "./StudentCard";
import { useGetStudentsQuery, useDeleteStudentMutation } from "../store/studentsApi";
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
  const { data, isLoading, isError, isFetching } = useGetStudentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  console.log("🚀 ~ CardGrid ~ isLoading:", isLoading, isFetching);
  const [deleteStudent] = useDeleteStudentMutation();
  const [renderCount, setRenderCount] = useState(0);

  const sortedStudents = useMemo(() => {
    if (!data) return [];
    return expensiveSort(data);
  }, [data]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, padding: 2 }}>
        <CircularProgress size={20} />
        <Typography>Loading students...</Typography>
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">Could not load students.</Alert>;
  }

  return (
    <Box>
      <Button component={Link} to="/students/new" variant="contained" sx={{ mb: 3 }}>
        Add Student
      </Button>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
        {sortedStudents.map((student) => {
          return <StudentCard key={student.id} {...student} onDelete={deleteStudent} />;
        })}
      </Box>

      <Button variant="outlined" onClick={() => setRenderCount((c) => c + 1)}>
        Force re-render, no data change ({renderCount})
      </Button>
    </Box>
  );
}

export default CardGrid;
