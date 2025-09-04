import React, { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Chỉ chuyển hướng nếu quá trình loading đã hoàn tất VÀ người dùng chưa được xác thực
    if (!isLoadingAuth && !isAuthenticated) {
      navigate('/login', { state: { from: location.pathname }, replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate, location]);

  // QUAN TRỌNG: Trong khi trạng thái xác thực đang được xác định, KHÔNG render nội dung con.
  // Lớp phủ loading toàn cục trong App.tsx sẽ xử lý phản hồi trực quan.
  if (isLoadingAuth) {
    return null; // Trả về null để không hiển thị gì trong khi đang tải
  }

  // Nếu quá trình loading đã hoàn tất và người dùng chưa được xác thực,
  // useEffect ở trên sẽ kích hoạt chuyển hướng.
  // Đoạn mã này là một biện pháp bảo vệ.
  if (!isAuthenticated) {
    return null;
  }

  // Nếu quá trình loading đã hoàn tất và người dùng đã được xác thực, render nội dung con
  return <>{children}</>;
};

export default ProtectedRoute;