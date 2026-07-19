import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface LayoutProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

function Layout({ isAuthenticated, onLogout }: LayoutProps) {
  return (
    <div className="app">
      <Header />
      <nav className="app-nav">
        <NavLink to="/" end className={navLinkClass}>
          Students
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
      </nav>
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
