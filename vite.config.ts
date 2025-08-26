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
    // Thay vì 'include', chúng ta sẽ thử 'exclude' @apollo/client
    // Điều này buộc Vite phải xử lý module này trực tiếp, có thể khắc phục lỗi exports.
    exclude: ['@apollo/client'],
  },
}));