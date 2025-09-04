import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); // Lấy vị trí hiện tại

  if (!isAuthenticated) {
    // Chuyển hướng đến trang /login, nhưng lưu lại vị trí hiện tại mà họ đang cố gắng
    // truy cập khi bị chuyển hướng. Điều này cho phép chúng ta đưa họ trở lại
    // trang đó sau khi họ đăng nhập, mang lại trải nghiệm người dùng tốt hơn
    // là đưa họ về trang chủ.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;