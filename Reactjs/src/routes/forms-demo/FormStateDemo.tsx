import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const INITIAL_EMAIL = "";

function validateEmail(value: string): string | null {
  if (!value.trim()) return "Email is required";
  if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email";
  return null;
}

// A single field wired up by hand so every piece of "form state" is visible
// at once — value, touched, dirty, error, validity, submitting.
function FormStateDemo() {
  const [email, setEmail] = useState(INITIAL_EMAIL);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const error = validateEmail(email);
  const isValid = error === null;
  const showError = touched && !isValid;
  const isDirty = email !== INITIAL_EMAIL;

  function handleSubmit(event: React.SubmitEvent): void {
    event.preventDefault();
    setTouched(true);
    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitted(false);
    // Fake a network request so isSubmitting is observable.
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        One field, wired up by hand. Watch the chips update as you type, blur, and submit — that's
        everything a form library tracks for you.
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, minWidth: 260 }}>
          <TextField
            label="Email"
            size="small"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            error={showError}
            helperText={showError ? error : undefined}
          />
          <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 1 }}>
            {isSubmitting ? <CircularProgress size={20} /> : "Submit"}
          </Button>
          {submitted && !isSubmitting && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Submitted successfully.
            </Alert>
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 240 }}>
          <Typography variant="subtitle2" gutterBottom>
            Live form state
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Stack spacing={1}>
            <StateRow label="value">
              <code>{email || "(empty)"}</code>
            </StateRow>
            <StateRow label="touched">
              <Chip
                size="small"
                label={touched ? "true" : "false"}
                color={touched ? "primary" : "default"}
              />
            </StateRow>
            <StateRow label="dirty">
              <Chip
                size="small"
                label={isDirty ? "true" : "false"}
                color={isDirty ? "primary" : "default"}
              />
            </StateRow>
            <StateRow label="isValid">
              <Chip
                size="small"
                label={isValid ? "true" : "false"}
                color={isValid ? "success" : "error"}
              />
            </StateRow>
            <StateRow label="error">
              <Chip
                size="small"
                label={error ?? "none"}
                color={error ? "error" : "success"}
                variant={error ? "filled" : "outlined"}
              />
            </StateRow>
            <StateRow label="isSubmitting">
              <Chip
                size="small"
                label={isSubmitting ? "true" : "false"}
                color={isSubmitting ? "warning" : "default"}
              />
            </StateRow>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

function StateRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" sx={{ width: 96, color: "text.secondary" }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export default FormStateDemo;
