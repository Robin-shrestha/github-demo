import { Link } from "react-router-dom";
import { Box, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { docs } from "../lib/docs";

function DocsListPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Docs
      </Typography>
      <List sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
        {docs.map((doc) => (
          <ListItemButton key={doc.slug} component={Link} to={`/docs/${doc.slug}`}>
            <ListItemText primary={doc.title} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export default DocsListPage;
