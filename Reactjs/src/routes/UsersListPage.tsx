import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useUsers from "../hooks/useUsers";
import { deleteUser, updateUserRoles } from "../api/users";
import { withTokenRefresh } from "../api/httpClient";
import { refreshAccessToken } from "../auth/authApi";
import { setToken } from "../auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const ROLE_OPTIONS = ["student", "admin"];

function UsersListPage() {
  const token = useAppSelector((state) => state.auth.token);
  const permissions = useAppSelector((state) => state.auth.user?.permissions ?? []);
  const dispatch = useAppDispatch();
  const { state, reload } = useUsers(token);
  const [busyId, setBusyId] = useState<string | null>(null);

  const canUpdate = permissions.includes("user:update");
  const canDelete = permissions.includes("user:delete");

  async function handleRoleChange(id: string, role: string): Promise<void> {
    if (!token) return;

    setBusyId(id);
    try {
      await withTokenRefresh(
        (t) => updateUserRoles(id, [role], t),
        token,
        refreshAccessToken,
        (newToken) => dispatch(setToken(newToken))
      );
      reload();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string): Promise<void> {
    if (!token) return;

    setBusyId(id);
    try {
      await withTokenRefresh(
        (t) => deleteUser(id, t),
        token,
        refreshAccessToken,
        (newToken) => dispatch(setToken(newToken))
      );
      reload();
    } finally {
      setBusyId(null);
    }
  }

  if (state.status === "loading") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, padding: 2 }}>
        <CircularProgress size={20} />
        <Typography>Loading users...</Typography>
      </Box>
    );
  }

  if (state.status === "error") {
    return <Alert severity="error">Could not load users: {state.error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Users
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              {canDelete && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {state.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {canUpdate ? (
                    <Select
                      size="small"
                      value={user.roles[0] ?? ""}
                      disabled={busyId === user.id}
                      onChange={(event) => handleRoleChange(user.id, event.target.value)}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    user.roles.join(", ")
                  )}
                </TableCell>
                {canDelete && (
                  <TableCell align="right">
                    <Button
                      size="small"
                      color="error"
                      disabled={busyId === user.id}
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UsersListPage;
