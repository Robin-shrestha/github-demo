import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { parseMarkdownBlocks } from "./parseMarkdown";
import { renderInline } from "./renderInline";

const HEADING_VARIANT = { 1: "h4", 2: "h5", 3: "h6" } as const;

function Markdown({ content }: { content: string }) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <Box sx={{ "& > *": { mb: 2 } }}>
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        switch (block.type) {
          case "heading": {
            const variant = HEADING_VARIANT[block.level as 1 | 2 | 3] ?? "subtitle1";
            return (
              <Typography
                key={key}
                variant={variant}
                sx={{ fontWeight: 700, mt: index === 0 ? 0 : 2 }}
              >
                {renderInline(block.text)}
              </Typography>
            );
          }

          case "paragraph":
            return (
              <Typography key={key} variant="body1" sx={{ lineHeight: 1.7 }}>
                {renderInline(block.text)}
              </Typography>
            );

          case "code":
            return (
              <Box
                key={key}
                component="pre"
                sx={{
                  bgcolor: "action.hover",
                  p: 2,
                  borderRadius: 1,
                  overflowX: "auto",
                  fontSize: "0.85rem",
                }}
              >
                <code>{block.code}</code>
              </Box>
            );

          case "list":
            return (
              <Box key={key} component={block.ordered ? "ol" : "ul"} sx={{ pl: 3, m: 0 }}>
                {block.items.map((item, i) => (
                  <Typography key={i} component="li" variant="body1" sx={{ lineHeight: 1.7 }}>
                    {renderInline(item)}
                  </Typography>
                ))}
              </Box>
            );

          case "table":
            return (
              <TableContainer
                key={key}
                sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {block.header.map((cell, i) => (
                        <TableCell key={i} sx={{ fontWeight: 700 }}>
                          {renderInline(cell)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {block.rows.map((row, r) => (
                      <TableRow key={r}>
                        {row.map((cell, c) => (
                          <TableCell key={c}>{renderInline(cell)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );

          case "hr":
            return <Divider key={key} />;

          default:
            return null;
        }
      })}
    </Box>
  );
}

export default Markdown;
