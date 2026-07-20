import { Controller, useForm } from "react-hook-form";
import { Button, FormControlLabel, MenuItem, Radio, RadioGroup, TextField } from "@mui/material";
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

interface AddStudentFormValues {
  name: string;
  role: string;
  roleDescription: string;
  email: string;
  bio: string;
  experienceYears: number;
  avatar: string;
}

interface AddStudentFormProps {
  onAddStudent: (student: Omit<Student, "id">) => void;
}

function AddStudentForm({ onAddStudent }: AddStudentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<AddStudentFormValues>({
    defaultValues: {
      name: "",
      role: "",
      roleDescription: "",
      email: "",
      bio: "",
      experienceYears: undefined,
      avatar: AVATAR_OPTIONS[0],
    },
  });

  const isOtherRole = watch("role") === OTHER_ROLE;

  function onSubmit(data: AddStudentFormValues): void {
    onAddStudent({
      name: data.name,
      role: (isOtherRole ? data.roleDescription : data.role) || "Unassigned",
      avatar: data.avatar,
      email: data.email,
      bio: data.bio.trim() || undefined,
      experienceYears: Number.isFinite(data.experienceYears) ? data.experienceYears : undefined,
    });

    reset();
    setFocus("name");
  }

  return (
    <form className="add-student-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <TextField
          label="Name"
          size="small"
          fullWidth
          autoFocus
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          select
          label="Role"
          size="small"
          fullWidth
          defaultValue=""
          {...register("role", { required: "Role is required" })}
          error={!!errors.role}
          helperText={errors.role?.message}
        >
          {ROLE_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {isOtherRole && (
        <TextField
          label="Please specify the role"
          size="small"
          fullWidth
          {...register("roleDescription", {
            required: isOtherRole ? "Please describe the role" : false,
          })}
          error={!!errors.roleDescription}
          helperText={errors.roleDescription?.message}
        />
      )}

      <div className="form-row">
        <TextField
          label="Email"
          type="email"
          size="small"
          fullWidth
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Years of experience"
          type="number"
          size="small"
          fullWidth
          slotProps={{ htmlInput: { min: 0 } }}
          {...register("experienceYears", {
            valueAsNumber: true,
            min: { value: 0, message: "Must be 0 or more" },
          })}
          error={!!errors.experienceYears}
          helperText={errors.experienceYears?.message}
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

      <Button type="submit" variant="contained">
        Add Student
      </Button>
    </form>
  );
}

export default AddStudentForm;
