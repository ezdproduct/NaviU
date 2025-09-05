import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import HistoryHubView from '@/components/profile/HistoryHubView';
import TestHubView from '@/components/profile/TestHubView';
import ConnectView from '@/components/profile/ConnectView';
import DoTestView from '@/components/profile/DoTestView';
import UserProfile from '@/pages/UserProfile';
import TestRunnerPage from "@/components/profile/TestRunnerPage";
import LoadingPage from "@/components/LoadingPage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NaviuResultPage from "./pages/NaviuResultPage";
import DGTCResultPage from "./pages/DGTCResultPage";
import NaviuHistoryPage from "./pages/NaviuHistoryPage";
import DGTCHistoryPage from "./pages/DGTCHistoryPage";
import DGTCQuizRunner from "./components/profile/mbti/DGTCQuizRunner";
// import NaviuTestRunner from "./components/profile/naviu/NaviuTestRunner"; // Đã xóa
import NaviuMBTITestRunner from "./components/profile/naviu/NaviuMBTITestRunner";

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
      { path: "report", element: <HistoryHubView /> },
      { path: "testhub", element: <TestHubView /> },
      { path: "connect", element: <ConnectView /> },
      { path: "do-test", element: <DoTestView /> },
      { path: "do-test/:testId", element: <TestRunnerPage /> },
      { path: "test/dgtc/do-test", element: <DGTCQuizRunner /> },
      // { path: "test/naviu/do-test", element: <NaviuTestRunner /> }, // Đã xóa
      // New route for NaviU MBTI
      { path: "test/naviu-mbti/do-test", element: <NaviuMBTITestRunner /> }, 
      { path: "naviu-result", element: <NaviuResultPage /> },
      { path: "dgtc-result", element: <DGTCResultPage /> },
      { path: "history/naviu", element: <NaviuHistoryPage /> },
      { path: "history/dgtc", element: <DGTCHistoryPage /> },
      { path: "settings", element: <UserProfile /> },
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
        <Outlet />

        {isLoadingAuth && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-600/50 backdrop-blur-sm">
            <img src="/naviU.png" alt="NaviU Logo" className="h-16 mb-4" />
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;