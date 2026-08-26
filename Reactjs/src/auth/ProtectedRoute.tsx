import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface ProtectedRouteProps {
  permission?: string;
}

function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const token = useAppSelector((state) => state.auth.token);
  const permissions = useAppSelector((state) => state.auth.user?.permissions ?? []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !permissions.includes(permission)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
