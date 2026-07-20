import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./routes/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentProfilePage from "./routes/StudentProfilePage";
import AddStudentPage from "./routes/AddStudentPage";
import LoginPage from "./routes/LoginPage";
import NotFoundPage from "./routes/NotFoundPage";
import CardGrid from "./components/CardGrid";
import useMockAuth from "./hooks/useMockAuth";
import DemoLayout from "./routes/demo/DemoLayout";
import DemoOverview from "./routes/demo/DemoOverview";
import TabsLayout from "./routes/demo/TabsLayout";
import TabsOverview from "./routes/demo/TabsOverview";
import TabsSettings from "./routes/demo/TabsSettings";
import SearchParamsDemo from "./routes/demo/SearchParamsDemo";
import RouteStateSender from "./routes/demo/RouteStateSender";
import RouteStateReceiver from "./routes/demo/RouteStateReceiver";
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
          <Route path="demo" element={<DemoLayout />}>
            <Route index element={<DemoOverview />} />
            <Route path="tabs" element={<TabsLayout />}>
              <Route index element={<TabsOverview />} />
              <Route path="settings" element={<TabsSettings />} />
            </Route>
            <Route path="search-params" element={<SearchParamsDemo />} />
            <Route path="route-state" element={<RouteStateSender />} />
            <Route path="route-state/receiver" element={<RouteStateReceiver />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
