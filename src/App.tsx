import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouteObject,
  Outlet, // Import Outlet để App có thể render các route con
  useNavigate // Import useNavigate ở đây
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateUser from "./pages/CreateUser";
import ProfileInfo from "./pages/ProfileInfo";
import { useAuth } from "./contexts/AuthContext"; // Chỉ import useAuth
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileLayout from "./components/profile/ProfileLayout";
import LandingLayout from "./components/landing/LandingLayout";

// Import individual profile views
import DashboardView from '@/components/profile/DashboardView';
import ReportView from '@/components/profile/ReportView';
import TestHubView from '@/components/profile/TestHubView';
import ConnectView from '@/components/profile/ConnectView';
import DoTestView from '@/components/profile/DoTestView';
import { useEffect } from "react"; // Import useEffect

// Import APITest component
import APITest from "./components/debug/APITest";
import SimpleAPITest from "./components/debug/SimpleAPITest"; // Import SimpleAPITest

const queryClient = new QueryClient();

const DashboardViewWrapper = () => {
  const { user } = useAuth();
  return <DashboardView username={user?.username || 'Bạn'} />;
};

export const routes: RouteObject[] = [
  {
    element: <LandingLayout />, // Sử dụng LandingLayout làm layout cha cho trang landing
    children: [
      { path: "/", element: <Index /> },
    ],
  },
  {
    element: <Layout />, // Layout chung cho các trang không phải profile
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/create-user", element: <CreateUser /> },
      { path: "/api-test", element: <APITest /> }, // Thêm route cho APITest
      { path: "/simple-api-test", element: <SimpleAPITest /> }, // Thêm route cho SimpleAPITest
    ],
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        {/* ProfileLayout là layout cho các trang profile */}
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

// App component bao bọc các context và render Outlet
const App = () => {
  const { isAuthenticated } = useAuth(); // useAuth an toàn vì AuthProvider ở main.tsx
  const navigate = useNavigate(); // useNavigate an toàn vì App ở trong RouterProvider

  useEffect(() => {
    // Điều hướng đến trang đăng nhập khi người dùng không còn xác thực
    if (!isAuthenticated) {
      // Tránh điều hướng lặp lại nếu đã ở trang đăng nhập/đăng ký
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
        {/* AuthProvider đã được chuyển ra main.tsx */}
        <Outlet /> {/* Outlet sẽ render các route được định nghĩa trong RouterProvider */}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;