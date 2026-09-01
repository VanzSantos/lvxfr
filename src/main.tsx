import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./interface/App";
import "../tokens/tokens.css";
import "./base.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
