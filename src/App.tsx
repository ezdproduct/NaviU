import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouteObject,
  Outlet,
  useNavigate
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileLayout from "./components/profile/ProfileLayout";
import LandingLayout from "./components/landing/LandingLayout";

// Import individual profile views
import DashboardView from '@/components/profile/DashboardView';
import ReportView from '@/components/profile/ReportView';
import TestHubView from '@/components/profile/TestHubView';
import ConnectView from '@/components/profile/ConnectView';
import DoTestView from '@/components/profile/DoTestView';
import { useEffect } from "react";

const queryClient = new QueryClient();

const DashboardViewWrapper = () => {
  const { user } = useAuth();
  return <DashboardView username={user?.username || 'Bạn'} />;
};

export const routes: RouteObject[] = [
  {
    element: <LandingLayout />,
    children: [
      { path: "/", element: <Index /> },
    ],
  },
  {
    element: <Layout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
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
    path: "*",
    element: <NotFound />,
  },
];

const App = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        navigate('/login');
      }
    }
  }, [isAuthenticated, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Outlet />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;