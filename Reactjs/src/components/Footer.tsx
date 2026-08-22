import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{ mt: 4, py: 2, borderTop: "1px solid", borderColor: "divider", textAlign: "center" }}
    >
      <Typography variant="body2" color="text.secondary">
        Built with React + Vite
      </Typography>
    </Box>
  );
}

export default Footer;
