import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react/hooks'; // Đã thay đổi đường dẫn import
import { REGISTER_USER_MUTATION } from '@/graphql/mutations/authMutations';
import { showSuccess, showError } from '@/utils/toast'; // Import toast utilities

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [registerUser, { loading, error }] = useMutation(REGISTER_USER_MUTATION, {
    onCompleted: (data) => {
      // console.log('Registration successful:', data);
      setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
      showSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setUsername('');
      setEmail('');
      setPassword('');
      // Optionally navigate to login after a short delay
      setTimeout(() => {
        navigate('/login?registered=true');
      }, 2000);
    },
    onError: (err) => {
      // console.error('Registration error:', err);
      showError(err.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null); // Clear previous success message
    try {
      await registerUser({ variables: { username, email, password } });
    } catch (err) {
      // Error is handled by onError callback of useMutation
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng ký</CardTitle>
          <CardDescription>Tạo tài khoản mới để bắt đầu.</CardDescription>
        </CardHeader>
        {successMessage && (
          <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg mx-6" role="alert">
            {successMessage}
          </div>
        )}
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
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
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