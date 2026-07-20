import { NavLink, Outlet } from "react-router-dom";

function tabLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

function TabsLayout() {
  return (
    <div>
      <p className="status-message">
        This route ("/demo/tabs") has its own child routes and its own Outlet — nested one level
        deeper than the main app Layout.
      </p>
      <nav className="app-nav">
        <NavLink to="/demo/tabs" end className={tabLinkClass}>
          Overview
        </NavLink>
        <NavLink to="/demo/tabs/settings" className={tabLinkClass}>
          Settings
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

export default TabsLayout;
