import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box, CircularProgress, Container } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getCurrentUser } from "../api/users";
import { logout, setUser } from "../store/authSlice";

function Layout() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  // A saved token survives a page refresh, but the user profile lives only
  // in memory. Re-fetch it here so a refresh doesn't look logged out.
  useEffect(() => {
    if (!token || user) return;

    let cancelled = false;

    getCurrentUser(token)
      .then((fetchedUser) => {
        if (!cancelled) dispatch(setUser(fetchedUser));
      })
      .catch(() => {
        if (!cancelled) dispatch(logout());
      });

    return () => {
      cancelled = true;
    };
  }, [token, user, dispatch]);

  return (
    <Box>
      <Header />
      <Container sx={{ py: 3 }}>
        <Suspense
          fallback={
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          }
        >
          <Outlet />
        </Suspense>
      </Container>
      <Footer />
    </Box>
  );
}

export default Layout;
