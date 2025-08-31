import React from "react"; // Import React
import { createRoot } from "react-dom/client";
import App, { routes } from "./App.tsx"; // Import App and routes
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Import createBrowserRouter and RouterProvider

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);