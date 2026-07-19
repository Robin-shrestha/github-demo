import { useNavigate } from "react-router-dom";

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
      <button type="button" className="btn" onClick={handleLogin}>
        Log in
      </button>
    </div>
  );
}

export default LoginPage;
