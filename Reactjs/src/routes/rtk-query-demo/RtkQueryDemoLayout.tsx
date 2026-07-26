import { NavLink, Outlet } from "react-router-dom";
import { Alert, Box, Paper, Typography } from "@mui/material";

function demoLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

function RtkQueryDemoLayout() {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        RTK Query Playground
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Data fetching + caching as part of the store — generated hooks handle loading/error state,
        deduping, and re-fetching.
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Needs the json-server running on port 3000 (it serves <code>/students</code>).
      </Alert>

      <Box component="nav" className="app-nav">
        <NavLink to="/rtk-query-demo" end className={demoLinkClass}>
          Auto-fetch & cache
        </NavLink>
        <NavLink to="/rtk-query-demo/mutations" className={demoLinkClass}>
          Mutations & invalidation
        </NavLink>
      </Box>

      <Outlet />
    </Paper>
  );
}

export default RtkQueryDemoLayout;
