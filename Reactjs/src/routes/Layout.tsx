import { Suspense } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useColorMode } from "../theme/ColorModeContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/authSlice";

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

function Layout() {
  const { mode, toggle } = useColorMode();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  return (
    <div className="app">
      <Badge
        badgeContent={import.meta.env.MODE.toUpperCase()}
        color="info"
        style={{ position: "absolute", top: 25, right: 75 }}
      ></Badge>
      {user && (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
          <Avatar src={user.avatarUrl} alt={user.name} sx={{ width: 32, height: 32 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.1 }}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.role}
            </Typography>
          </Box>
        </Stack>
      )}
      <Header />
      <nav className="app-nav">
        <NavLink to="/" end className={navLinkClass}>
          Students
        </NavLink>
        <NavLink to="/context-demo" className={navLinkClass}>
          Context Demo
        </NavLink>
        <NavLink to="/redux-demo" className={navLinkClass}>
          Redux Demo
        </NavLink>
        <NavLink to="/rtk-query-demo" className={navLinkClass}>
          RTK Query
        </NavLink>
        {isAuthenticated ? (
          <button type="button" className="nav-link" onClick={() => dispatch(logout())}>
            Log out
          </button>
        ) : (
          <NavLink to="/login" className={navLinkClass}>
            Log in
          </NavLink>
        )}
        <Tooltip title={mode === "light" ? "Switch to dark" : "Switch to light"}>
          <IconButton size="small" onClick={toggle} aria-label="Toggle color mode">
            {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>
      </nav>
      <Suspense
        fallback={
          <Box sx={{ display: "flex", justifyContent: "center", p: 3, background: "#eee" }}>
            <CircularProgress />
          </Box>
        }
      >
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  );
}

export default Layout;
