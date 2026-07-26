import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

type Mode = "light" | "dark";

interface ColorModeValue {
  mode: Mode;
  toggle: () => void;
}

const ColorModeContext = createContext<ColorModeValue | null>(null);

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");

  const value = useMemo<ColorModeValue>(
    () => ({ mode, toggle: () => setMode((m) => (m === "light" ? "dark" : "light")) }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light" ? { background: { default: "#fafafa" } } : {}),
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function useColorMode(): ColorModeValue {
  const value = useContext(ColorModeContext);
  if (!value) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }
  return value;
}
