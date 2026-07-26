import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  useAddStudentMutation,
  useDeleteStudentMutation,
  useGetStudentsQuery,
} from "../../store/studentsApi";

const SAMPLE_NAMES = ["Asha", "Bibek", "Chandni", "Deepak", "Elina", "Farhan"];

function MutationsDemo() {
  const { data, isLoading, isError } = useGetStudentsQuery();
  const [addStudent, addState] = useAddStudentMutation();
  const [deleteStudent, deleteState] = useDeleteStudentMutation();

  function handleAdd(): void {
    const name = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
    addStudent({
      name,
      role: "Frontend",
      avatar: "https://i.pravatar.cc/150?img=8",
    });
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The mutations tag-invalidate <code>"Student"</code>, so the list query re-fetches
        automatically after an add or delete — you never call refetch yourself.
      </Typography>

      <Button
        variant="contained"
        onClick={handleAdd}
        disabled={addState.isLoading}
        sx={{ mb: 2 }}
        startIcon={addState.isLoading ? <CircularProgress size={16} /> : undefined}
      >
        Add random student
      </Button>

      {isLoading && <Typography variant="body2">Loading…</Typography>}
      {isError && <Alert severity="error">Could not reach the server.</Alert>}

      <Stack spacing={1}>
        {data?.map((s) => (
          <Paper
            key={s.id}
            variant="outlined"
            sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography variant="body2">
              {s.name} · {s.role}
            </Typography>
            <IconButton
              size="small"
              color="error"
              aria-label={`Delete ${s.name}`}
              disabled={deleteState.isLoading}
              onClick={() => deleteStudent(s.id)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export default MutationsDemo;
