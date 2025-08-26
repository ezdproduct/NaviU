import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // Thử loại trừ @apollo/client khỏi quá trình pre-bundling của Vite
    // để xem liệu điều này có giải quyết được lỗi export hay không.
    exclude: ['@apollo/client'],
  },
}));