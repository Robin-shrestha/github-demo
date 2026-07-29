import { Link, useParams } from "react-router-dom";
import { Alert, Box, Button } from "@mui/material";
import Markdown from "../components/markdown/Markdown";
import { getDocBySlug } from "../lib/docs";

function DocPage() {
  const { slug } = useParams<{ slug: string }>();
  const doc = slug ? getDocBySlug(slug) : undefined;

  if (!doc) {
    return (
      <Alert
        severity="warning"
        action={
          <Button component={Link} to="/docs" size="small">
            Back
          </Button>
        }
      >
        No doc found for "{slug}".
      </Alert>
    );
  }

  return (
    <Box>
      <Button component={Link} to="/docs" size="small" sx={{ mb: 2 }}>
        Back to Docs
      </Button>
      <Markdown content={doc.content} />
    </Box>
  );
}

export default DocPage;
