import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useGetStudentsQuery } from "../../store/studentsApi";

// Each panel calls the SAME query hook. RTK Query dedupes them into one network
// request and shares the cached result — mount as many as you like.
function StudentsPanel({ label }: { label: string }) {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetStudentsQuery();

  return (
    <Paper variant="outlined" sx={{ p: 1.5, flex: 1, minWidth: 240 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle2">{label}</Typography>
        {isFetching && <CircularProgress size={14} />}
      </Stack>

      {isLoading && <Typography variant="body2">Loading…</Typography>}
      {isError && (
        <Alert severity="error">
          {(error as { status?: number })?.status
            ? `Request failed (${(error as { status?: number }).status})`
            : "Could not reach the server."}
        </Alert>
      )}
      {data && (
        <>
          <Chip size="small" label={`${data.length} students`} sx={{ mb: 1 }} />
          <Stack spacing={0.25}>
            {data.slice(0, 5).map((s) => (
              <Typography key={s.id} variant="caption" color="text.secondary">
                {s.name}
              </Typography>
            ))}
            {data.length > 5 && (
              <Typography variant="caption" color="text.secondary">
                …and {data.length - 5} more
              </Typography>
            )}
          </Stack>
        </>
      )}

      <Button size="small" onClick={() => refetch()} sx={{ mt: 1 }}>
        Refetch
      </Button>
    </Paper>
  );
}

function AutoFetchDemo() {
  const [showSecond, setShowSecond] = useState(false);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        <code>useGetStudentsQuery()</code> fetches on mount and hands back <code>data</code>/
        <code>isLoading</code>/<code>isError</code> — no useEffect, no manual state. Mount a second
        panel and RTK Query serves it from cache (one request, not two — check the Network tab).
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <StudentsPanel label="Panel A" />
        {showSecond && <StudentsPanel label="Panel B (shares the cache)" />}
      </Stack>

      <Button variant="outlined" onClick={() => setShowSecond((v) => !v)} sx={{ mt: 2 }}>
        {showSecond ? "Unmount second panel" : "Mount a second panel"}
      </Button>
    </Box>
  );
}

export default AutoFetchDemo;
