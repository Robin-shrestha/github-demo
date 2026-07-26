import { useRef } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { incrementCount, incrementOther } from "../../store/counterSlice";

function useRenderCount(): number {
  const ref = useRef(0);
  ref.current += 1;
  return ref.current;
}

// Subscribes to ONLY count via a selector, so it re-renders only when count
// changes — not when `other` changes.
function CountConsumer() {
  const count = useAppSelector((state) => state.counter.count);
  const renders = useRenderCount();
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderColor: "primary.main" }}>
      <Typography variant="body2">Selects only count</Typography>
      <Typography variant="caption" color="text.secondary">
        count: {count} · rendered {renders}×
      </Typography>
    </Paper>
  );
}

function OtherConsumer() {
  const other = useAppSelector((state) => state.counter.other);
  const renders = useRenderCount();
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderColor: "primary.main" }}>
      <Typography variant="body2">Selects only other</Typography>
      <Typography variant="caption" color="text.secondary">
        other: {other} · rendered {renders}×
      </Typography>
    </Paper>
  );
}

function SelectorsDemo() {
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Same count/other setup as the Context "Unused-state re-render" tab — but here each consumer
        reads its slice through a <code>useSelector</code>. Click "Change other" and only the{" "}
        <b>other</b> consumer re-renders; the count consumer stays put. Selectors subscribe to a
        slice, so unrelated changes don't touch you. This is exactly what Context couldn't do.
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Button variant="contained" onClick={() => dispatch(incrementCount())}>
          Change count
        </Button>
        <Button variant="outlined" onClick={() => dispatch(incrementOther())}>
          Change other
        </Button>
      </Stack>

      <Stack spacing={2}>
        <CountConsumer />
        <OtherConsumer />
      </Stack>
    </Box>
  );
}

export default SelectorsDemo;
