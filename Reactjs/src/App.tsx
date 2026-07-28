import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./routes/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentProfilePage from "./routes/StudentProfilePage";
import AddStudentPage from "./routes/AddStudentPage";
import LoginPage from "./routes/LoginPage";
import NotFoundPage from "./routes/NotFoundPage";
import CardGrid from "./components/CardGrid";
import ContextDemoLayout from "./routes/context-demo/ContextDemoLayout";
import ConsumersAndRerenders from "./routes/context-demo/ConsumersAndRerenders";
import UnusedStateRerender from "./routes/context-demo/UnusedStateRerender";
import ValueIdentityDemo from "./routes/context-demo/ValueIdentityDemo";
import ReduxDemoLayout from "./routes/redux-demo/ReduxDemoLayout";
import SelectorsDemo from "./routes/redux-demo/SelectorsDemo";
import StoreFlowDemo from "./routes/redux-demo/StoreFlowDemo";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<CardGrid />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="students/:id" element={<StudentProfilePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="students/new" element={<AddStudentPage />} />
          </Route>
          <Route path="context-demo" element={<ContextDemoLayout />}>
            <Route index element={<ConsumersAndRerenders />} />
            <Route path="unused-state" element={<UnusedStateRerender />} />
            <Route path="value-identity" element={<ValueIdentityDemo />} />
          </Route>
          <Route path="redux-demo" element={<ReduxDemoLayout />}>
            <Route index element={<SelectorsDemo />} />
            <Route path="store-flow" element={<StoreFlowDemo />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
