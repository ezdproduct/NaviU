import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../lib/auth/api';
import PasswordInput from '@/components/PasswordInput';
import AuthLayout from '@/components/AuthLayout'; // Import AuthLayout

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await register(username, email, password);
      navigate('/login', { state: { registered: true, username: username, password: password }, replace: true });
    } catch (err) {
      if (err instanceof Error) {
        console.error("Registration error:", err.message);
        setError(err.message);
      } else {
        console.error("Unknown registration error:", err);
        setError('Đã xảy ra lỗi không xác định trong quá trình đăng ký.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng ký"
      description="Tạo tài khoản mới để bắt đầu."
      isLogin={false}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Tên đăng nhập</Label>
          <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="rounded-lg" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-lg" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="rounded-lg"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-lg" type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </Button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;