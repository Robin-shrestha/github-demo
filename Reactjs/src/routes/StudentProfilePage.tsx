import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import useStudent from "../hooks/useStudent";

function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const state = useStudent(id);

  const avatarRef = useRef<HTMLDivElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (state.status === "loading") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, padding: 2 }}>
        <CircularProgress size={20} />
        <Typography>Loading student...</Typography>
      </Box>
    );
  }

  if (state.status === "not-found") {
    return (
      <Alert
        severity="warning"
        action={
          <Button component={Link} to="/" size="small">
            Back
          </Button>
        }
      >
        No student found with id "{id}".
      </Alert>
    );
  }

  if (state.status === "error") {
    return <Alert severity="error">Could not load student: {state.error}</Alert>;
  }

  const { student } = state;

  return (
    <Card sx={{ maxWidth: 360, margin: "0 auto" }}>
      <CardContent>
        <Stack sx={{ alignItems: "center" }} spacing={1}>
          <Avatar
            ref={avatarRef}
            src={student.avatar}
            alt="Student avatar"
            onClick={() => setIsPreviewOpen(true)}
            sx={{ width: 88, height: 88, cursor: "pointer" }}
          />
          <Popover
            open={isPreviewOpen}
            anchorEl={avatarRef.current}
            onClose={() => setIsPreviewOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Box
              component="img"
              src={student.avatar}
              alt="Student avatar, full size"
              sx={{ width: 280, height: 280, objectFit: "cover", display: "block" }}
            />
          </Popover>
          <Typography variant="h5">{student.name}</Typography>

          <Stack direction="row" spacing={1}>
            <Chip label={student.role} color="primary" size="small" />
            {typeof student.experienceYears === "number" && (
              <Chip label={`${student.experienceYears} yrs experience`} size="small" />
            )}
          </Stack>

          {student.email && (
            <Typography variant="body2" color="text.secondary">
              {student.email}
            </Typography>
          )}
        </Stack>

        {student.bio && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2">{student.bio}</Typography>
          </>
        )}

        {student.hobbies && student.hobbies.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Hobbies
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {student.hobbies.map((hobby) => (
                <Chip key={hobby} label={hobby} size="small" variant="outlined" />
              ))}
            </Stack>
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StudentProfilePage;
