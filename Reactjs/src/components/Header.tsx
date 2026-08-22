import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useColorMode } from "../theme/ColorModeContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/authSlice";

// Docs and the React-concept demos aren't things you use every visit, so
// they live behind this menu instead of sitting in the main nav.
const MORE_LINKS = [
  { to: "/docs", label: "Docs" },
  { to: "/context-demo", label: "Context Demo" },
  { to: "/redux-demo", label: "Redux Demo" },
];

function Header() {
  const { mode, toggle } = useColorMode();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  function handleLogout(): void {
    dispatch(logout());
    navigate("/");
  }

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}
        >
          Course Students
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
          <Button component={Link} to="/">
            Students
          </Button>

          <Button
            id="more-menu-button"
            aria-controls={anchorEl ? "more-menu" : undefined}
            aria-haspopup="true"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            endIcon={<ExpandMoreIcon />}
          >
            More
          </Button>
          <Menu
            id="more-menu"
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(null)}
          >
            {MORE_LINKS.map((link) => (
              <MenuItem
                key={link.to}
                component={Link}
                to={link.to}
                onClick={() => setAnchorEl(null)}
              >
                {link.label}
              </MenuItem>
            ))}
          </Menu>
        </Stack>

        {user && (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Avatar src={user.profilePic} alt={user.username} sx={{ width: 32, height: 32 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user.firstName} {user.lastName}
            </Typography>
          </Stack>
        )}

        {token ? (
          <Button size="small" onClick={handleLogout}>
            Log out
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button component={Link} to="/login" size="small">
              Log in
            </Button>
            <Button component={Link} to="/signup" size="small" variant="outlined">
              Sign up
            </Button>
          </Stack>
        )}

        <Tooltip title={mode === "light" ? "Switch to dark" : "Switch to light"}>
          <IconButton size="small" onClick={toggle} aria-label="Toggle color mode">
            {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
