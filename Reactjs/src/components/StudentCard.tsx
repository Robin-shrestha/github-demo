import { memo } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import type { Student } from "../types/types";

interface StudentCardProps extends Student {
  onDelete: (id: number) => void;
}

function StudentCard({ id, name, role, avatar, onDelete }: StudentCardProps) {
  return (
    <Card sx={{ width: 220 }}>
      <CardMedia component="img" image={avatar} alt="Student avatar" sx={{ height: 160 }} />
      <CardContent>
        <Typography variant="h6" component="h3" noWrap>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {role}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/students/${id}`} size="small" variant="outlined">
          View Profile
        </Button>
        <Button size="small" variant="outlined" color="error" onClick={() => onDelete(id)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default memo(StudentCard);
