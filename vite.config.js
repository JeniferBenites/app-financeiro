import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

// Versão do app embutida no pacote web: é ela que o app compara com o
// manifesto OTA para saber se saiu versão nova.
const { version } = JSON.parse(readFileSync("./package.json", "utf8"));

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(version) },
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
