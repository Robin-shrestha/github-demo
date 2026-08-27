import { useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "./authSlice";
import { refreshAccessToken } from "./authApi";
import { getCurrentUser } from "../api/users";

/**
 * Runs once on app startup.
 *
 * Attempts to silently restore the session by calling the refresh-token
 * endpoint (the refresh token lives in an httpOnly cookie, so no JS access
 * is needed). If the cookie is valid we get a fresh access token back,
 * fetch the current user, and hydrate the Redux store — the user never
 * sees the login page.
 *
 * If the cookie is missing or expired the request fails quietly and the
 * user stays logged out. ProtectedRoute then redirects them to /login.
 *
 * Nothing renders until the check finishes, preventing a flash-redirect
 * to /login on every page refresh.
 */
function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await refreshAccessToken();
        const user = await getCurrentUser(token);
        dispatch(setCredentials({ token, user }));
      } catch {
        // No valid refresh token — stay logged out, that's fine.
      } finally {
        setIsReady(true);
      }
    }

    restoreSession();
  }, [dispatch]);

  if (!isReady) {
    return (
      <Box
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}

export default AuthInit;
