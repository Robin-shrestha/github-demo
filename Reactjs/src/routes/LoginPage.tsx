import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Alert, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/authSlice";
import { getCurrentUser, loginUser } from "../api/users";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const token = await loginUser(values);
      const user = await getCurrentUser(token);
      dispatch(setCredentials({ token, user }));
      navigate("/");
    } catch {
      setError("root", { message: "Invalid username or password." });
    }
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 360, margin: "0 auto", p: 2 }}
      spacing={2}
    >
      <Typography variant="h5">Log in</Typography>

      <TextField
        label="Username"
        size="small"
        fullWidth
        autoFocus
        {...register("username")}
        error={!!errors.username}
        helperText={errors.username?.message}
      />

      <TextField
        label="Password"
        type="password"
        size="small"
        fullWidth
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? <CircularProgress size={22} /> : "Log in"}
      </Button>
    </Stack>
  );
}

export default LoginPage;
