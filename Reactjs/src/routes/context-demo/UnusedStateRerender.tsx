import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

interface CountValue {
  count: number;
  other: number;
}

const CountContext = createContext<CountValue>({ count: 0, other: 0 });

function useRenderCount(): number {
  const ref = useRef(0);
  ref.current += 1;
  return ref.current;
}

function CountConsumer() {
  const { count } = useContext(CountContext);
  const renders = useRenderCount();
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderColor: "primary.main" }}>
      <Typography variant="body2">Consumer — reads only count</Typography>
      <Typography variant="caption" color="text.secondary">
        count: {count} · rendered {renders}×
      </Typography>
    </Paper>
  );
}

function OtherConsumer() {
  const { other } = useContext(CountContext);
  const renders = useRenderCount();
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderColor: "primary.main" }}>
      <Typography variant="body2">Consumer — reads only other</Typography>
      <Typography variant="caption" color="text.secondary">
        otherCount: {other} · rendered {renders}×
      </Typography>
    </Paper>
  );
}

function PlainBox() {
  const renders = useRenderCount();
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Typography variant="body2">Plain box — ignores context</Typography>
      <Typography variant="caption" color="text.secondary">
        rendered {renders}×
      </Typography>
    </Paper>
  );
}

function CountProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);
  const value = { count, other };

  return (
    <CountContext.Provider value={value}>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Button variant="contained" onClick={() => setCount((c) => c + 1)}>
          Change count ({count})
        </Button>
        <Button variant="outlined" onClick={() => setOther((o) => o + 1)}>
          Change "other" — unused by consumer ({other})
        </Button>
      </Stack>
      {children}
    </CountContext.Provider>
  );
}

function UnusedStateRerender() {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The provider holds two states, <code>count</code> and <code>other</code>, packed into one
        context value. The consumer reads only <code>count</code>. Click "Change other" — the
        consumer still re-renders, even though the value it uses didn't change, while the plain box
        (passed as children, not a consumer) stays put. Context has no per-field subscription: a
        consumer subscribes to the whole value, so any change re-renders it. This is the limitation
        Redux selectors fix.
      </Typography>

      <CountProvider>
        <Stack spacing={2}>
          <CountConsumer />
          <OtherConsumer />
          <PlainBox />
        </Stack>
      </CountProvider>
    </Box>
  );
}

export default UnusedStateRerender;
