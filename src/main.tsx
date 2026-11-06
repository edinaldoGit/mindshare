import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@/app/routes/app-router";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/manrope/wght.css";
import "@/styles/globals.css";
import "@/styles/participant.css";
import "@/styles/instructor.css";
import "@/styles/curation.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);

import "./styles/evolution.css";
