import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { Box, Button, FormControlLabel, Paper, Stack, Switch, Typography } from "@mui/material";

interface CountValue {
  count: number;
}

const ObjContext = createContext<CountValue>({ count: 0 });

function useRenderCount(): number {
  const ref = useRef(0);
  ref.current += 1;
  return ref.current;
}

function Consumer() {
  const { count } = useContext(ObjContext);
  const renders = useRenderCount();
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderColor: "blue" }}>
      <Typography variant="body2">Consumer — reads count from the object value</Typography>
      <Typography variant="caption" color="text.secondary">
        count: {count} · rendered {renders}×
      </Typography>
    </Paper>
  );
}

function ObjProvider({ memoize, children }: { memoize: boolean; children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [, forceRerender] = useState(0);

  const memoized = useMemo(() => ({ count }), [count]);
  const fresh = { count };
  const value = memoize ? memoized : fresh;

  return (
    <ObjContext.Provider value={value}>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Button variant="contained" onClick={() => setCount((c) => c + 1)}>
          Change count ({count})
        </Button>
        <Button variant="outlined" onClick={() => forceRerender((n) => n + 1)}>
          Unrelated re-render
        </Button>
      </Stack>
      {children}
    </ObjContext.Provider>
  );
}

function ValueIdentityDemo() {
  const [memoize, setMemoize] = useState(false);
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        The provider's value is an object. Click "Unrelated re-render" — it does <b>not</b> change
        count. Without memoization a brand-new value object is created each render, so its identity
        changes and the consumer re-renders anyway. Turn memoization on and the unrelated re-render
        no longer touches the consumer.
      </Typography>
      <FormControlLabel
        control={<Switch checked={memoize} onChange={(e) => setMemoize(e.target.checked)} />}
        label={memoize ? "value is memoized (useMemo)" : "value recreated every render"}
        sx={{ mb: 1 }}
      />
      <ObjProvider memoize={memoize}>
        <Consumer />
      </ObjProvider>
    </Box>
  );
}

export default ValueIdentityDemo;
