import "./theme.ts"
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "roku-ui/style.css";
import { ThemeProvider } from "./components/ThemeProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <App />
    </ThemeProvider>
  </React.StrictMode>
);
