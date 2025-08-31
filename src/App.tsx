import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
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
import ProfileInfo from "./pages/ProfileInfo";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileLayout from "./components/profile/ProfileLayout"; // Import ProfileLayout

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />

            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-user" element={<CreateUser />} />
            </Route>
            
            {/* Route /profile sẽ sử dụng ProfileLayout và hiển thị các chế độ xem con */}
            <Route 
              path="/profile/*" // Sử dụng wildcard để ProfileLayout có thể quản lý các route con
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile-info" 
              element={
                <ProtectedRoute>
                  <ProfileInfo />
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