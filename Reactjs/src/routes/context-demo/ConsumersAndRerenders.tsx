import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

const CountContext = createContext(0);

function useRenderCount(): number {
  const ref = useRef(0);
  ref.current += 1;
  return ref.current;
}
const ConsumerChild = () => {
  const renders = useRenderCount();

  return (
    <Paper sx={{ p: 1.5, borderColor: "primary.main" }} style={{ backgroundColor: "#dfe" }}>
      Consumer child: rendered: {renders}
    </Paper>
  );
};

function ConsumerBoxWithChildren({ label, children }: { label: string; children?: ReactNode }) {
  const count = useContext(CountContext);
  const renders = useRenderCount();
  return (
    <Paper
      variant="outlined"
      sx={{ p: 1.5, borderColor: "primary.main" }}
      style={{ background: "#eee" }}
    >
      <Typography variant="body2">{label} — reads context</Typography>
      <Typography variant="caption" color="text.secondary">
        context value: {count} · rendered {renders}×
      </Typography>

      {!!children && children}
    </Paper>
  );
}

function ConsumerBoxWoChildren({ label }: { label: string }) {
  const count = useContext(CountContext);
  const renders = useRenderCount();
  return (
    <Paper
      variant="outlined"
      sx={{ p: 1.5, borderColor: "primary.main" }}
      style={{ background: "#eee" }}
    >
      <Typography variant="body2">{label} — reads context</Typography>
      <Typography variant="caption" color="text.secondary">
        context value: {count} · rendered {renders}×
      </Typography>
      <ConsumerChild />
    </Paper>
  );
}

function PlainBox({ label, children }: { label: string; children?: ReactNode }) {
  const renders = useRenderCount();
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }} style={{ background: "#ddf" }}>
      <Typography variant="body2">{label} — ignores context</Typography>
      <Typography variant="caption" color="text.secondary">
        rendered {renders}×
      </Typography>
      {children && <Box sx={{ mt: 1 }}>{children}</Box>}
    </Paper>
  );
}

function CountProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  return (
    <CountContext.Provider value={count}>
      <Button variant="contained" onClick={() => setCount((c) => c + 1)} sx={{ mb: 2 }}>
        Increment context value ({count})
      </Button>
      {children}
    </CountContext.Provider>
  );
}

function ConsumersAndRerenders() {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Click increment and watch the render counts. Only components that call{" "}
        <code>useContext</code> re-render — the plain wrapper doesn't, even though the consumer
        nested inside it does. So it's "every consumer," not "every child."
      </Typography>
      <CountProvider>
        <Stack spacing={2}>
          <PlainBox label="Plain wrapper">
            <ConsumerBoxWithChildren label="Nested consumer" />
          </PlainBox>
          <ConsumerBoxWithChildren label="Sibling consumer" />
          <ConsumerBoxWithChildren label="Consumer With {children} passed">
            <ConsumerChild />
          </ConsumerBoxWithChildren>
          <ConsumerBoxWoChildren label="Consumer Calling other components" />
          <PlainBox label="Another plain box" />
        </Stack>
      </CountProvider>
    </Box>
  );
}

export default ConsumersAndRerenders;
