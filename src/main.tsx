import React from "react";
import { createRoot } from "react-dom/client";
import App, { routes } from "./App.tsx";
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Removed AuthProvider import

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App /> {/* App sẽ chứa AuthProvider và các context khác */}
    </RouterProvider>
  </React.StrictMode>
);