import { useEffect, useRef, useState } from "react";
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
import useUploadStudentPhoto from "../hooks/useUploadStudentPhoto";

function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const state = useStudent(id);
  const { state: uploadState, upload } = useUploadStudentPhoto();

  const avatarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function cancelSelection() {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  useEffect(() => {
    if (uploadState.status === "success") {
      cancelSelection();
    }
  }, [uploadState]);

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
  const savedAvatar =
    uploadState.status === "success" ? uploadState.student.avatar : student.avatar;
  const avatarSrc = previewUrl ?? savedAvatar;

  return (
    <Card sx={{ maxWidth: 360, margin: "0 auto" }}>
      <CardContent>
        <Stack sx={{ alignItems: "center" }} spacing={1}>
          <Avatar
            ref={avatarRef}
            src={avatarSrc}
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
              src={avatarSrc}
              alt="Student avatar, full size"
              sx={{ width: 280, height: 280, objectFit: "cover", display: "block" }}
            />
          </Popover>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          />

          {!selectedFile && (
            <Button size="small" onClick={() => fileInputRef.current?.click()}>
              Change photo
            </Button>
          )}

          {selectedFile && (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                disabled={uploadState.status === "uploading"}
                onClick={() => id && upload(id, selectedFile)}
              >
                Submit
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={uploadState.status === "uploading"}
                onClick={cancelSelection}
              >
                Cancel
              </Button>
            </Stack>
          )}

          {uploadState.status === "uploading" && (
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <CircularProgress size={16} />
              <Typography variant="body2">Uploading...</Typography>
            </Stack>
          )}

          {uploadState.status === "error" && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {uploadState.error}
            </Alert>
          )}

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
