import { useRef, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

function ControlledField() {
  const [value, setValue] = useState("");

  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: 260 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Controlled
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          State is the source of truth. Every keystroke updates state, and the input just displays
          it. The live value below can only exist because React sees every change.
        </Typography>

        <TextField
          label="Type here"
          size="small"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <Alert severity="info" sx={{ mt: 2 }}>
          React state right now: <strong>{value || "(empty)"}</strong>
        </Alert>
      </CardContent>
    </Card>
  );
}

function UncontrolledField() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [readValue, setReadValue] = useState<string | null>(null);

  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: 260 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Uncontrolled
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The DOM owns the value. React never sees your keystrokes — we only read the value from a
          ref when we ask for it, like on submit.
        </Typography>

        <TextField label="Type here" size="small" fullWidth inputRef={inputRef} />

        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
          onClick={() => setReadValue(inputRef.current?.value ?? "")}
        >
          Read value from DOM
        </Button>

        {readValue !== null && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Last read from the DOM: <strong>{readValue || "(empty)"}</strong>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function FrozenField() {
  return (
    <Card variant="outlined" sx={{ borderColor: "warning.main" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          The frozen-input trap
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This field has a <code>value</code> but no <code>onChange</code>. on typing — nothing
          happens. React keeps repainting the same fixed value over whatever you press. A controlled
          input needs both halves.
        </Typography>

        <TextField
          label="Try typing (it won't work)"
          size="small"
          fullWidth
          value="locked"
          // onChange={(e) => {
          //   console.log(e.target.value);
          // }}
        />
      </CardContent>
    </Card>
  );
}

function ControlledVsUncontrolled() {
  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <ControlledField />
        <UncontrolledField />
      </Stack>
      <FrozenField />
    </Box>
  );
}

export default ControlledVsUncontrolled;
