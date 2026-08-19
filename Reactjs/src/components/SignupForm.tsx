import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ApiError } from "../api/httpClient";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_ID_DOCUMENTS = 10;
const MIN_ID_DOCUMENTS = 2;

const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscore only"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().trim().min(1, "Address is required"),
  profilePic: z
    .instanceof(File, { message: "Choose a profile picture" })
    .refine((file) => file.type.startsWith("image/"), "File must be an image")
    .refine((file) => file.size <= MAX_FILE_SIZE, "Image must be 2MB or smaller"),
  idDocuments: z
    .array(z.instanceof(File))
    .min(MIN_ID_DOCUMENTS, `Min of ${MIN_ID_DOCUMENTS} documents required`)
    .max(MAX_ID_DOCUMENTS, `Up to ${MAX_ID_DOCUMENTS} documents`)
    .refine(
      (files) =>
        files.every((file) => file.type.startsWith("image/") || file.type === "application/pdf"),
      "Each document must be an image or PDF"
    )
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      "Each document must be 2MB or smaller"
    ),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

const defaultValues: Partial<SignupFormValues> = {
  firstName: "",
  lastName: "",
  username: "",
  dateOfBirth: "",
  address: "",
};

interface SignupFormProps {
  onSignup: (values: SignupFormValues) => Promise<void>;
}

function SignupForm({ onSignup }: SignupFormProps) {
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const idDocumentsInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues,
  });

  const profilePic = watch("profilePic");

  useEffect(() => {
    if (!profilePic) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(profilePic);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [profilePic]);

  async function onSubmit(values: SignupFormValues) {
    try {
      await onSignup(values);
    } catch (err: unknown) {
      setError("root", { message: "Something went wrong. Please try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Controller
          name="profilePic"
          control={control}
          render={({ field: { onChange }, fieldState }) => (
            <Stack sx={{ alignItems: "center" }} spacing={1}>
              <Avatar src={previewUrl ?? undefined} sx={{ width: 88, height: 88 }} />
              <input
                ref={profilePicInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(event) => {
                  onChange(event.target.files?.[0] ?? undefined);
                }}
              />
              <Button size="small" onClick={() => profilePicInputRef.current?.click()}>
                {previewUrl ? "Change photo" : "Choose photo"}
              </Button>
              {fieldState.error && (
                <Typography variant="caption" color="error">
                  {fieldState.error.message}
                </Typography>
              )}
            </Stack>
          )}
        />

        <Controller
          name="idDocuments"
          control={control}
          render={({ field: { onChange, value }, fieldState }) => {
            const files = value ?? [];

            return (
              <Stack spacing={1}>
                <Typography variant="subtitle2">
                  Valid IDs (demo: multiple files, up to {MAX_ID_DOCUMENTS})
                </Typography>
                <input
                  ref={idDocumentsInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  style={{ display: "none" }}
                  onChange={(event) => {
                    const selected = Array.from(event.target.files ?? []).slice(
                      0,
                      MAX_ID_DOCUMENTS
                    );
                    onChange(selected.length ? selected : undefined);
                  }}
                />
                <Button size="small" onClick={() => idDocumentsInputRef.current?.click()}>
                  {files.length
                    ? `Change files (${files.length}/${MAX_ID_DOCUMENTS})`
                    : "Choose files"}
                </Button>
                {files.map((file, index) => (
                  <Stack
                    key={`${file.name}-${index}`}
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <Typography variant="body2" sx={{ flexGrow: 1 }} noWrap>
                      {file.name}
                    </Typography>
                    <IconButton
                      size="small"
                      aria-label="Remove file"
                      onClick={() => {
                        const remaining = files.filter((_, i) => i !== index);
                        onChange(remaining.length ? remaining : undefined);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ))}
                {fieldState.error && (
                  <Typography variant="caption" color="error">
                    {fieldState.error.message}
                  </Typography>
                )}
              </Stack>
            );
          }}
        />

        <Stack direction="row" spacing={2}>
          <TextField
            label="First name"
            size="small"
            fullWidth
            autoFocus
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            label="Last name"
            size="small"
            fullWidth
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Stack>

        <TextField
          label="Username"
          size="small"
          fullWidth
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

        <TextField
          label="Date of birth"
          type="date"
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register("dateOfBirth")}
          error={!!errors.dateOfBirth}
          helperText={errors.dateOfBirth?.message}
        />

        <TextField
          label="Address"
          size="small"
          fullWidth
          multiline
          rows={2}
          {...register("address")}
          error={!!errors.address}
          helperText={errors.address?.message}
        />

        {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={22} /> : "Sign up"}
        </Button>
      </Stack>
    </form>
  );
}

export default SignupForm;
