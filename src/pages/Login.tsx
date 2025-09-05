import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import PasswordInput from '@/components/PasswordInput';
import { LoginCredentials } from '@/types'; // Import LoginCredentials from shared types

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isLoadingAuth, naviuResult } = useAuth(); // Lấy isLoadingAuth và naviuResult
  const [searchParams] = useSearchParams(); // Giữ lại để tương thích ngược nếu cần
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy trạng thái đăng ký từ location.state hoặc searchParams
  const registrationSuccess = (location.state as { registered?: boolean })?.registered || searchParams.get('registered') === 'true';

  const from = location.state?.from?.pathname || '/profile';

  useEffect(() => {
    // Tự động điền thông tin nếu có từ trang đăng ký
    const state = location.state as { registered?: boolean; username?: string; password?: string } | undefined;
    if (state?.registered) {
      if (state.username) setUsername(state.username);
      if (state.password) setPassword(state.password);
      // Xóa trạng thái khỏi history để tránh tự động điền lại khi refresh
      navigate(location.pathname, { replace: true, state: { from: state.from } }); // Giữ lại 'from' nếu có
    }

    // Chỉ điều hướng nếu không còn trong trạng thái tải xác thực và đã xác thực
    if (!isLoadingAuth && isAuthenticated) {
      // Nếu không có naviuResult, hiển thị modal chào mừng NaviU
      if (!naviuResult) {
        navigate(from, { state: { showNaviuWelcome: true, username: username }, replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, from, isLoadingAuth, naviuResult, username, location.state, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const credentials: LoginCredentials = { username, password };
      const loggedInUsername = await login(credentials);
      // Logic điều hướng đã được chuyển vào useEffect
    } catch (err: any) {
      setError(err.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>Nhập thông tin của bạn để truy cập báo cáo.</CardDescription>
        </CardHeader>
        {registrationSuccess && (
          <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg mx-6" role="alert">
            Đăng ký thành công! Vui lòng đăng nhập.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                Đăng ký
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;