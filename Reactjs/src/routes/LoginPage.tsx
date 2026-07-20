import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

interface LoginPageProps {
  onLogin: () => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();

  function handleLogin(): void {
    onLogin();
    navigate("/");
  }

  return (
    <div className="status-message">
      <p>Mock login.</p>
      <Button variant="contained" onClick={handleLogin}>
        Log in
      </Button>
    </div>
  );
}

export default LoginPage;
