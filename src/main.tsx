import React from "react";
import { createRoot } from "react-dom/client";
import App, { routes } from "./App.tsx";
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider> {/* AuthProvider bao bọc toàn bộ ứng dụng */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);