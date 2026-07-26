import { NavLink, Outlet } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";

function demoLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

function ContextDemoLayout() {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Context Playground
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Who actually re-renders when a context value changes, and the value-identity gotcha behind
        the "memoize your provider value" advice.
      </Typography>

      <Box component="nav" className="app-nav">
        <NavLink to="/context-demo" end className={demoLinkClass}>
          Consumers & re-renders
        </NavLink>
        <NavLink to="/context-demo/unused-state" className={demoLinkClass}>
          Unused-state re-render
        </NavLink>
        <NavLink to="/context-demo/value-identity" className={demoLinkClass}>
          Value identity
        </NavLink>
      </Box>

      <Outlet />
    </Paper>
  );
}

export default ContextDemoLayout;
