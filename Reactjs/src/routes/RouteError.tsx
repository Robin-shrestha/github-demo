import { Link, useRouteError } from "react-router-dom";
import { Alert, Button } from "@mui/material";

function RouteError() {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : "Something went wrong.";

  return (
    <Alert
      severity="error"
      sx={{ mt: 2 }}
      action={
        <Button component={Link} to="/" color="inherit" size="small">
          Home
        </Button>
      }
    >
      {message}
    </Alert>
  );
}

export default RouteError;
