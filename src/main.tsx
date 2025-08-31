import React from "react";
import { createRoot } from "react-dom/client";
import App, { routes } from "./App.tsx";
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router}> {/* RouterProvider is now the parent */}
      <AuthProvider> {/* AuthProvider is now a child of RouterProvider */}
        <App /> {/* App contains other context providers */}
      </AuthProvider>
    </RouterProvider>
  </React.StrictMode>
);