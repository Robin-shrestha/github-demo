import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store/store";
import { ColorModeProvider } from "./theme/ColorModeContext";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ColorModeProvider>
      <App />
    </ColorModeProvider>
  </Provider>
);
