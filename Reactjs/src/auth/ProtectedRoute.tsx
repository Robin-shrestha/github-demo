import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface ProtectedRouteProps {
  permission?: string;
}

function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const location = useLocation();
  const token = useAppSelector((state) => state.auth.token);
  const permissions = useAppSelector((state) => state.auth.user?.permissions ?? []);

  if (!token) {
    // Pass the current location so LoginPage can send the user back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permission && !permissions.includes(permission)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
