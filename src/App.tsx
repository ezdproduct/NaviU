import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouteObject,
  Outlet,
  useNavigate
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useEffect, lazy, Suspense } from "react"; // Import lazy and Suspense
import LoadingSpinner from "./components/LoadingSpinner"; // Import the new spinner

// Lazy load pages
const NotFound = lazy(() => import("./pages/NotFound"));
const Index = lazy(() => import("./pages/Index"));
const Layout = lazy(() => import("./components/Layout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ProfileInfo = lazy(() => import("./pages/ProfileInfo"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const ProfileLayout = lazy(() => import("./components/profile/ProfileLayout"));
const LandingLayout = lazy(() => import("./components/landing/LandingLayout"));

// Lazy load profile views
const DashboardView = lazy(() => import('@/components/profile/DashboardView'));
const ReportView = lazy(() => import('@/components/profile/ReportView'));
const TestHubView = lazy(() => import('@/components/profile/TestHubView'));
const ConnectView = lazy(() => import('@/components/profile/ConnectView'));
const DoTestView = lazy(() => import('@/components/profile/DoTestView'));

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
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;