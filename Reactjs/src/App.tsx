import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./routes/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentProfilePage from "./routes/StudentProfilePage";
import AddStudentPage from "./routes/AddStudentPage";
import LoginPage from "./routes/LoginPage";
import NotFoundPage from "./routes/NotFoundPage";
import CardGrid from "./components/CardGrid";
import useMockAuth from "./hooks/useMockAuth";
import "./App.css";

function App() {
  const { isAuthenticated, login, logout } = useMockAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout isAuthenticated={isAuthenticated} onLogout={logout} />}>
          <Route index element={<CardGrid />} />
          <Route path="login" element={<LoginPage onLogin={login} />} />
          <Route path="students/:id" element={<StudentProfilePage />} />
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="students/new" element={<AddStudentPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
