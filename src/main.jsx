import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";
import "./i18n";
import { initDatabase } from "./data/database";

// Inicializar banco de dados local antes de renderizar
initDatabase()
  .then(() => {
    console.log("Banco de dados local inicializado");
  })
  .catch((error) => {
    console.error("Erro ao inicializar banco de dados:", error);
  });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);