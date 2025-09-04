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
import UserProfile from '@/pages/UserProfile';
import TestRunnerPage from "@/components/profile/TestRunnerPage";
import HistoryView from "@/components/profile/HistoryView";

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
      { path: "do-test/:testId", element: <TestRunnerPage /> },
      { path: "settings", element: <UserProfile /> },
      { path: "history", element: <HistoryView /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const App = () => {
  const { isLoadingAuth } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Outlet /> {/* Luôn render Outlet để nội dung trang có thể hiển thị bên dưới */}

        {isLoadingAuth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;