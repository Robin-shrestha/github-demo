import { lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./routes/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentProfilePage from "./routes/StudentProfilePage";
import AddStudentPage from "./routes/AddStudentPage";
import LoginPage from "./routes/LoginPage";
import NotFoundPage from "./routes/NotFoundPage";
import RouteError from "./routes/RouteError";
import DocsListPage from "./routes/DocsListPage";
import DocPage from "./routes/DocPage";
import CardGrid from "./components/CardGrid";
import "./App.css";

const ContextDemoLayout = lazy(() => import("./routes/context-demo/ContextDemoLayout"));
const ConsumersAndRerenders = lazy(() => import("./routes/context-demo/ConsumersAndRerenders"));
const UnusedStateRerender = lazy(() => import("./routes/context-demo/UnusedStateRerender"));
const ValueIdentityDemo = lazy(() => import("./routes/context-demo/ValueIdentityDemo"));
const ReduxDemoLayout = lazy(() => import("./routes/redux-demo/ReduxDemoLayout"));
const SelectorsDemo = lazy(() => import("./routes/redux-demo/SelectorsDemo"));
const StoreFlowDemo = lazy(() => import("./routes/redux-demo/StoreFlowDemo"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route errorElement={<RouteError />}>
        <Route index element={<CardGrid />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="docs" element={<DocsListPage />} />
        <Route path="docs/:slug" element={<DocPage />} />
        <Route path="students/:id" element={<StudentProfilePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="students/new" element={<AddStudentPage />} />
        </Route>
        <Route path="context-demo" element={<ContextDemoLayout />}>
          <Route errorElement={<RouteError />}>
            <Route index element={<ConsumersAndRerenders />} />
            <Route path="unused-state" element={<UnusedStateRerender />} />
            <Route path="value-identity" element={<ValueIdentityDemo />} />
          </Route>
        </Route>
        <Route path="redux-demo" element={<ReduxDemoLayout />}>
          <Route index element={<SelectorsDemo />} />
          <Route path="store-flow" element={<StoreFlowDemo />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
