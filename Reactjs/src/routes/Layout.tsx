import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box, CircularProgress, Container } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { getCurrentUser, refreshAccessToken } from "../api/users";
import { setCredentials } from "../store/authSlice";

function Layout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    refreshAccessToken()
      .then(async (token) => {
        const user = await getCurrentUser(token);
        if (!cancelled) dispatch(setCredentials({ token, user }));
      })
      .catch(() => {
        // no valid refresh cookie, stay signed out
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

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
