import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WP_BASE_URL } from '@/lib/auth/api';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

const API_URL = `${WP_BASE_URL}/wp-json/naviu/v1`;

const NaviuTestPage = () => {
  const { user } = useAuth();
  const token = user ? localStorage.getItem('jwt_token') : null;
  const navigate = useNavigate();

  const [mbtiResult, setMbtiResult] = useState('');
  const [eqResult, setEqResult] = useState('');
  const [cogResult, setCogResult] = useState('');
  const [hollandResult, setHollandResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError("Bạn chưa đăng nhập. Vui lòng đăng nhập để nộp bài test.");
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    // Giả định các trường này là kết quả cuối cùng từ các bài test khác
    // Trong thực tế, bạn có thể fetch kết quả thực tế từ các API tương ứng
    const payload = {
      mbti: mbtiResult ? JSON.parse(mbtiResult) : {},
      eq: eqResult ? JSON.parse(eqResult) : {},
      cog: cogResult ? JSON.parse(cogResult) : {},
      holland: hollandResult ? JSON.parse(hollandResult) : {},
    };

    try {
      const res = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Lỗi khi nộp bài test NaviU: ${res.status}`);
      }

      await res.json();
      showSuccess("Bài test NaviU đã hoàn thành! Kết quả tổng hợp của bạn đã được lưu.");
      navigate('/profile/dashboard', { replace: true }); // Hoặc hiển thị kết quả tổng hợp
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi nộp bài test NaviU.');
      showError(err.message || 'Có lỗi xảy ra khi nộp bài test NaviU.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bạn chưa đăng nhập</h2>
          <p className="text-gray-600">Vui lòng đăng nhập để làm bài trắc nghiệm NaviU.</p>
          <Button onClick={() => navigate('/login')} className="mt-4">Đăng nhập</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-[calc(100vh-6rem)] flex items-center justify-center">
      <Card className="w-full max-w-2xl rounded-2xl shadow-lg p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Trắc nghiệm Tổng hợp NaviU</CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            Gửi kết quả tổng hợp từ các bài test khác của bạn.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <div>
              <Label htmlFor="mbti-result">Kết quả MBTI (JSON)</Label>
              <Input
                id="mbti-result"
                type="text"
                value={mbtiResult}
                onChange={(e) => setMbtiResult(e.target.value)}
                placeholder='{"1":"a","2":"b"}'
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Ví dụ: `{"1":"a","2":"b"}`</p>
            </div>

            <div>
              <Label htmlFor="eq-result">Kết quả EQ (JSON)</Label>
              <Input
                id="eq-result"
                type="text"
                value={eqResult}
                onChange={(e) => setEqResult(e.target.value)}
                placeholder='{"41":"a","44":"b"}'
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Ví dụ: `{"41":"a","44":"b"}`</p>
            </div>

            <div>
              <Label htmlFor="cog-result">Kết quả Cognitive (JSON)</Label>
              <Input
                id="cog-result"
                type="text"
                value={cogResult}
                onChange={(e) => setCogResult(e.target.value)}
                placeholder='{"56":"b"}'
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Ví dụ: `{"56":"b"}`</p>
            </div>

            <div>
              <Label htmlFor="holland-result">Kết quả Holland (JSON)</Label>
              <Input
                id="holland-result"
                type="text"
                value={hollandResult}
                onChange={(e) => setHollandResult(e.target.value)}
                placeholder='{"1":5,"8":4}'
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Ví dụ: `{"1":5,"8":4}`</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Hoàn thành Test NaviU'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NaviuTestPage;