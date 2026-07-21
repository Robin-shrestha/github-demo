import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { DuplicateEmailError } from "../api/students";
import type { Student } from "../types/types";

const AVATAR_OPTIONS = [
  "https://i.pravatar.cc/300?img=1",
  "https://i.pravatar.cc/300?img=5",
  "https://i.pravatar.cc/300?img=12",
  "https://i.pravatar.cc/300?img=20",
  "https://i.pravatar.cc/300?img=32",
];

const ROLE_OPTIONS = ["Frontend", "Backend", "Fullstack", "DevOps", "Data", "Other"];

const OTHER_ROLE = "Other";

const studentFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    roleDescription: z.string().optional(),
    email: z.email("Enter a valid email"),
    bio: z.string().optional(),
    experienceYears: z.number().min(0, "Must be 0 or more").optional(),
    avatar: z.string().min(1, "Choose an avatar"),
    // A dynamic list. Each row is an object so useFieldArray can give it a
    // stable key; we flatten to string[] on submit.
    hobbies: z.array(z.object({ value: z.string().min(1, "Hobby can't be empty") })),
  })
  .refine((data) => data.role !== OTHER_ROLE || Boolean(data.roleDescription?.trim()), {
    path: ["roleDescription"],
    message: "Please describe the role",
  });

type AddStudentFormValues = z.infer<typeof studentFormSchema>;
const defaultValues = {
  name: "",
  role: "",
  roleDescription: "",
  email: "",
  bio: "",
  experienceYears: undefined,
  avatar: AVATAR_OPTIONS[0],
  hobbies: [],
};
interface AddStudentFormProps {
  onAddStudent: (student: Omit<Student, "id">) => Promise<void>;
}

function AddStudentForm({ onAddStudent }: AddStudentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddStudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "hobbies" });
  const isOtherRole = watch("role") === OTHER_ROLE;

  async function onSubmit(data: AddStudentFormValues) {
    const hobbies = data.hobbies.map((h) => h.value.trim()).filter(Boolean);
    try {
      await onAddStudent({
        name: data.name,
        role: (isOtherRole ? data.roleDescription : data.role) || "Unassigned",
        avatar: data.avatar,
        email: data.email,
        bio: data.bio?.trim() || undefined,
        experienceYears: data.experienceYears,
        hobbies: hobbies.length ? hobbies : undefined,
      });
    } catch (err: unknown) {
      if (err instanceof DuplicateEmailError) {
        setError("email", { message: "That email is already registered" });
      } else {
        setError("root", { message: "Something went wrong. Please try again." });
      }
    }
  }

  return (
    <form className="add-student-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <TextField
          label="Name"
          size="small"
          fullWidth
          autoFocus
          {...register("name")}

          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="age-label" size="small">
                Role
              </InputLabel>
              <Select {...field} value={field.value ?? ""} label="Role" size="small" fullWidth>
                <MenuItem value="">-- Select a role --</MenuItem>
                {ROLE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </div>

      {isOtherRole && (
        <TextField
          label="Please specify the role"
          size="small"
          fullWidth
          {...register("roleDescription")}
          error={!!errors.roleDescription}
          helperText={errors.roleDescription?.message}
        />
      )}

      <div className="form-row">
        <TextField
          label="Email"
          // type="email"
          size="small"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <Controller
          name="experienceYears"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
              }
              label="Years of experience"
              type="number"
              size="small"
              fullWidth
              slotProps={{ htmlInput: { min: 0 } }}
              error={!!errors.experienceYears}
              helperText={errors.experienceYears?.message}
            />
          )}
        />
      </div>

      <TextField
        label="Short bio (optional)"
        size="small"
        fullWidth
        multiline
        rows={3}
        {...register("bio")}
      />

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Hobbies
        </Typography>
        <Stack spacing={1}>
          {fields.map((field, index) => (
            <Stack key={field.id} direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
              <TextField
                label={`Hobby ${index + 1}`}
                size="small"
                fullWidth
                {...register(`hobbies.${index}.value`)}
                error={!!errors.hobbies?.[index]?.value}
                helperText={errors.hobbies?.[index]?.value?.message}
              />
              <IconButton
                aria-label="Remove hobby"
                color="error"
                onClick={() => remove(index)}
                sx={{ mt: 0.5 }}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Stack>
          ))}
          <Button
            type="button"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => append({ value: "" })}
            sx={{ alignSelf: "flex-start" }}
          >
            Add hobby
          </Button>
        </Stack>
      </Box>

      <fieldset className="avatar-picker">
        <legend>Choose an avatar</legend>
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} row>
              {AVATAR_OPTIONS.map((url) => (
                <FormControlLabel
                  key={url}
                  value={url}
                  className="avatar-option"
                  control={<Radio />}
                  label={<img src={url} alt="Avatar option" />}
                />
              ))}
            </RadioGroup>
          )}
        />
      </fieldset>

      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? <CircularProgress size={22} /> : "Add Student"}
      </Button>
    </form>
  );
}

export default AddStudentForm;
