import { NavLink, Outlet } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useColorMode } from "../theme/ColorModeContext";

interface LayoutProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

function Layout({ isAuthenticated, onLogout }: LayoutProps) {
  const { mode, toggle } = useColorMode();

  return (
    <div className="app">
      <Header />
      <nav className="app-nav">
        <NavLink to="/" end className={navLinkClass}>
          Students
        </NavLink>
        <NavLink to="/context-demo" className={navLinkClass}>
          Context Demo
        </NavLink>
        {isAuthenticated ? (
          <button type="button" className="nav-link" onClick={onLogout}>
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
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
