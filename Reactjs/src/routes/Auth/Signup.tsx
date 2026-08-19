import { useNavigate } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import SignupForm, { type SignupFormValues } from "../../components/SignupForm";
import { signupUser } from "../../api/users";

function Signup() {
  const navigate = useNavigate();

  async function handleSignup(values: SignupFormValues): Promise<void> {
    await signupUser(values);
    navigate("/login");
  }

  return (
    <Stack sx={{ maxWidth: 420, margin: "0 auto", p: 2 }} spacing={2}>
      <Typography variant="h5">Create an account</Typography>
      <SignupForm onSignup={handleSignup} />
    </Stack>
  );
}

export default Signup;
