import { useState } from "react";
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { incrementCount, incrementOther } from "../../store/counterSlice";

function StoreFlowDemo() {
  const counter = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();
  const [log, setLog] = useState<string[]>([]);

  function fire(action: { type: string }): void {
    dispatch(action);
    setLog((prev) => [action.type, ...prev].slice(0, 8));
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The one-way flow: a button <b>dispatches</b> an action, the <b>reducer</b> produces the next
        state, and the <b>store</b> updates. Watch the state and the action log change together.
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Button variant="contained" onClick={() => fire(incrementCount())}>
          dispatch(incrementCount)
        </Button>
        <Button variant="outlined" onClick={() => fire(incrementOther())}>
          dispatch(incrementOther)
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Paper variant="outlined" sx={{ p: 1.5, flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Store state
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <Box component="pre" sx={{ m: 0, fontSize: 13 }}>
            {JSON.stringify(counter, null, 2)}
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 1.5, flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Dispatched actions (newest first)
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {log.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              Nothing dispatched yet.
            </Typography>
          ) : (
            <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
              {log.map((type, i) => (
                <Chip key={`${type}-${i}`} label={type} size="small" />
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>
    </Box>
  );
}

export default StoreFlowDemo;
