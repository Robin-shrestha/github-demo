import { NavLink, Outlet } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";

function demoLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

function ReduxDemoLayout() {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Redux Playground
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        What a store adds over Context: selectors that subscribe to just a slice, and a predictable
        dispatch → reducer → state flow.
      </Typography>

      <Box component="nav" className="app-nav">
        <NavLink to="/redux-demo" end className={demoLinkClass}>
          Selectors & re-renders
        </NavLink>
        <NavLink to="/redux-demo/store-flow" className={demoLinkClass}>
          Store & actions
        </NavLink>
      </Box>

      <Outlet />
    </Paper>
  );
}

export default ReduxDemoLayout;
