import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Vẫn giữ Input cho username và email
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../lib/auth/api';
import PasswordInput from '@/components/PasswordInput'; // Import PasswordInput mới

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
      navigate('/login?registered=true');
    } catch (err) {
      if (err instanceof Error) {
        console.error("Registration error:", err.message); // Log the error message
        setError(err.message);
      } else {
        console.error("Unknown registration error:", err); // Log unknown errors
        setError('Đã xảy ra lỗi không xác định trong quá trình đăng ký.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng ký</CardTitle>
          <CardDescription>Tạo tài khoản mới để bắt đầu.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <PasswordInput // Sử dụng PasswordInput mới
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8} // Thêm minLength cho mật khẩu
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;