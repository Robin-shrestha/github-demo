import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "./authSlice";
import { getCurrentUser } from "../api/users";
import { loginUser } from "./authApi";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
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

      // Go back to the page the user was trying to visit, or home if they
      // navigated directly to /login.
      const from = (location.state as { from?: Location } | null)?.from?.pathname ?? "/";
      navigate(from, { replace: true });
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
