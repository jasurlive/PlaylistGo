import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async () => {
  const viteTsconfigPaths = (await import("vite-tsconfig-paths")).default;
  return {
    base: "/DJ/",
    plugins: [react(), viteTsconfigPaths()],
    server: {
      open: true,
    },

  };
});
