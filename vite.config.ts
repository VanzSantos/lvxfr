import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { buildManifest } from "./scripts/prototable-manifest.mjs";

/** Serve o manifesto do ProtoTable sob demanda em dev — roda `git log` a cada
    request, então reflete o estado real do repositório sem precisar reiniciar
    o servidor. Fora do dev server (build/preview), o ProtoTablePage cai pro
    JSON estático gerado por `npm run build` (script "prebuild", ver
    package.json) — mesma lógica de scripts/prototable-manifest.mjs nos dois
    casos, sem duplicar. */
function prototableManifestPlugin(): Plugin {
  return {
    name: "prototable-manifest",
    configureServer(server) {
      server.middlewares.use("/__prototable-manifest", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(buildManifest()));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), prototableManifestPlugin()],
});
