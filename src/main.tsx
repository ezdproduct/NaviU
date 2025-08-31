import React from "react"; // Import React
import { createRoot } from "react-dom/client";
import App, { routes } from "./App.tsx"; // Import App and routes
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Import createBrowserRouter and RouterProvider
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider> {/* AuthProvider now wraps RouterProvider */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);