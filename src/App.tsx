import { Toaster as Sonner } from "@/components/ui/sonner"; // Giữ lại Sonner
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateUser from "./pages/CreateUser";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Đã loại bỏ <Toaster /> */}
      <Sonner /> {/* Chỉ giữ lại Sonner */}
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Route cho trang chủ với header riêng */}
            <Route path="/" element={<Index />} />

            {/* Các route sử dụng Layout chung với Header cố định */}
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-user" element={<CreateUser />} />
            </Route>
            
            {/* Route /profile sẽ quản lý bố cục riêng của nó */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;