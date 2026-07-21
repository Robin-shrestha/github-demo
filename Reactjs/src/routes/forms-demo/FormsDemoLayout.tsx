import { NavLink, Outlet } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";

function demoLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

function FormsDemoLayout() {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Forms & Form State Playground
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Standalone pages showing how inputs hold their values and what "form state" really covers.
      </Typography>

      <Box component="nav" className="app-nav">
        <NavLink to="/forms-demo" end className={demoLinkClass}>
          Controlled vs Uncontrolled
        </NavLink>
        <NavLink to="/forms-demo/form-state" className={demoLinkClass}>
          Form State
        </NavLink>
      </Box>

      <Outlet />
    </Paper>
  );
}

export default FormsDemoLayout;
