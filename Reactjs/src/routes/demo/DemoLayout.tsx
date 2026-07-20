import { NavLink, Outlet, useMatch } from "react-router-dom";

function demoLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

function DemoLayout() {
  const onTabsDemo = useMatch("/demo/tabs/*");

  return (
    <div style={{ border: "grey solid 1px", padding: "1rem", borderRadius: 8 }}>
      <h2>React Router Playground</h2>
      <p className="status-message">
        Standalone demo pages for router concepts beyond the main app: nested routes, query params,
        route state, and a couple of extra hooks.
        {onTabsDemo && " (currently viewing the nested-routes demo, per useMatch)"}
      </p>

      <nav className="app-nav">
        <NavLink to="/demo" end className={demoLinkClass}>
          Overview
        </NavLink>
        <NavLink to="/demo/tabs" className={demoLinkClass}>
          Nested Routes
        </NavLink>
        <NavLink to="/demo/search-params" className={demoLinkClass}>
          Query Params
        </NavLink>
        <NavLink to="/demo/route-state" className={demoLinkClass}>
          Route State
        </NavLink>
      </nav>

      <Outlet context={{ visitedAt: new Date().toLocaleTimeString() }} />
    </div>
  );
}

export default DemoLayout;
