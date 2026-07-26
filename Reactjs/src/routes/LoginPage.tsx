import { useNavigate } from "react-router-dom";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import { useAppDispatch } from "../store/hooks";
import { login, type AuthUser } from "../store/authSlice";

// Stand-in for what a real backend would return after authenticating.
const MOCK_USER: AuthUser = {
  id: "u-1",
  name: "Robin Shrestha",
  email: "robin@lftechnology.com",
  role: "Instructor",
  avatarUrl: "https://i.pravatar.cc/100?img=15",
};

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function handleLogin(): void {
    dispatch(login(MOCK_USER));
    navigate("/");
  }

  return (
    <Stack spacing={2} sx={{ p: 2, alignItems: "flex-start" }}>
      <Typography variant="body2" color="text.secondary">
        Mock login — signs you in as this user:
      </Typography>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Avatar src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} />
        <Stack>
          <Typography variant="body1">{MOCK_USER.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {MOCK_USER.role} · {MOCK_USER.email}
          </Typography>
        </Stack>
      </Stack>
      <Button variant="contained" onClick={handleLogin}>
        Log in
      </Button>
    </Stack>
  );
}

export default LoginPage;
