import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// A checagem de versão nova (e o botão "Atualizar agora") vive no hook
// useAppUpdate, dentro do App — nada é aplicado sem o usuário tocar no botão.
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
