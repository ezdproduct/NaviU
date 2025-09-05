import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import PasswordInput from '@/components/PasswordInput';
import { LoginCredentials } from '@/types';
import AuthLayout from '@/components/AuthLayout'; // Import AuthLayout
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isLoadingAuth, naviuResult } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const registrationSuccess = (location.state as { registered?: boolean })?.registered || searchParams.get('registered') === 'true';
  const from = location.state?.from?.pathname || '/profile';

  useEffect(() => {
    const state = location.state as { registered?: boolean; username?: string; password?: string } | undefined;
    if (state?.registered) {
      if (state.username) setUsername(state.username);
      if (state.password) setPassword(state.password);
      navigate(location.pathname, { replace: true, state: { from: state.from } });
    }

    if (!isLoadingAuth && isAuthenticated) {
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
      await login(credentials);
    } catch (err: any) {
      setError(err.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng nhập"
      description="Vui lòng đăng nhập vào tài khoản của bạn để tiếp tục."
      isLogin={true}
    >
      {registrationSuccess && (
        <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          Đăng ký thành công! Vui lòng đăng nhập.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Tên đăng nhập hoặc Email</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="rounded-lg"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mật khẩu</Label>
            <Link to="#" className="text-sm font-medium text-blue-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="remember-me" />
          <Label htmlFor="remember-me" className="text-sm text-gray-600">Ghi nhớ tôi</Label>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-lg" type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Đăng ký
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;