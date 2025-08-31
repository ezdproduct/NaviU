import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  // Removed BrowserRouter, Routes
  RouteObject, // Import RouteObject type
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateUser from "./pages/CreateUser";
import ProfileInfo from "./pages/ProfileInfo";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileLayout from "./components/profile/ProfileLayout";

// Import individual profile views
import DashboardView from '@/components/profile/DashboardView';
import ReportView from '@/components/profile/ReportView';
import TestHubView from '@/components/profile/TestHubView';
import ConnectView from '@/components/profile/ConnectView';
import DoTestView from '@/components/profile/DoTestView';

const queryClient = new QueryClient();

// Wrapper component to access AuthContext for DashboardView
const DashboardViewWrapper = () => {
  const { user } = useAuth();
  return <DashboardView username={user?.username || 'Bạn'} />;
};

// Define routes as an array of RouteObject
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    element: <Layout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/create-user", element: <CreateUser /> },
    ],
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfileLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardViewWrapper /> },
      { path: "dashboard", element: <DashboardViewWrapper /> },
      { path: "report", element: <ReportView /> },
      { path: "testhub", element: <TestHubView /> },
      { path: "connect", element: <ConnectView /> },
      { path: "do-test", element: <DoTestView /> },
    ],
  },
  {
    path: "/profile-info",
    element: (
      <ProtectedRoute>
        <ProfileInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

// App component now provides contexts
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        {/* The RouterProvider will render the actual routes in main.tsx */}
        {/* This component now just provides the contexts */}
        {/* The Outlet will be rendered by the RouterProvider */}
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;