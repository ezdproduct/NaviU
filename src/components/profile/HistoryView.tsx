import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { useAuth } from '@/contexts/AuthContext';
import { WP_BASE_URL } from '@/lib/auth/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, History, FileQuestion, RefreshCw } from 'lucide-react'; // Import RefreshCw icon
import { Button } from '@/components/ui/button'; // Import Button

interface TestHistoryItem {
  id: string;
  title: string;
  result: string; // e.g., "ENTP"
  scores: { [key: string]: number };
  clarity: { [key: string]: string };
  percent: { [key: string]: string };
  started_at: string;
  submitted_at: string;
}

const API_URL = `${WP_BASE_URL}/wp-json/mbti/v1`;

const HistoryView = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('jwt_token'); // Get token from localStorage
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => { // Wrap fetchHistory in useCallback
    if (!token) {
      setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để xem lịch sử.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Lỗi khi tải lịch sử: ${response.status}`);
      }

      const data: TestHistoryItem[] = await response.json();
      setHistory(data);
    } catch (err: any) {
      console.error("Error fetching MBTI history:", err);
      setError(err.message || 'Không thể tải lịch sử bài test.');
    } finally {
      setLoading(false);
    }
  }, [token]); // Dependency array for useCallback

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]); // Call fetchHistory when component mounts or fetchHistory changes

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'INTJ': 'bg-purple-600', 'INTP': 'bg-blue-600', 'ENTJ': 'bg-red-600', 'ENTP': 'bg-orange-600',
      'INFJ': 'bg-green-600', 'INFP': 'bg-teal-600', 'ENFJ': 'bg-pink-600', 'ENFP': 'bg-yellow-600',
      'ISTJ': 'bg-gray-700', 'ISFJ': 'bg-indigo-600', 'ESTJ': 'bg-red-700', 'ESFJ': 'bg-pink-700',
      'ISTP': 'bg-gray-600', 'ISFP': 'bg-green-500', 'ESTP': 'bg-orange-700', 'ESFP': 'bg-yellow-700'
    };
    return colors[type] || 'bg-gray-500';
  };

  const formatClarity = (clarity: { [key: string]: string }) => {
    return Object.entries(clarity)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString; // Fallback if date is invalid
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Lịch sử làm bài test MBTI</h1>
        <Button onClick={fetchHistory} disabled={loading} className="flex items-center gap-2">
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Cập nhật
        </Button>
      </div>
      <p className="text-gray-600 mb-8">Xem lại các bài test MBTI bạn đã hoàn thành và kết quả của chúng.</p>

      {loading && (
        <Card className="p-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full mt-6" />
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && history.length === 0 && (
        <Card className="p-6 text-center">
          <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <CardTitle className="text-xl font-bold text-gray-800 mb-2">Chưa có bài test nào</CardTitle>
          <CardDescription>Bạn chưa hoàn thành bài test MBTI nào. Hãy bắt đầu làm một bài test mới!</CardDescription>
        </Card>
      )}

      {!loading && !error && history.length > 0 && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Ngày làm</TableHead>
                <TableHead>Tên bài test</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead>Độ rõ ràng</TableHead>
                {/* <TableHead>Chi tiết</TableHead> */} {/* Tạm ẩn chi tiết để giữ bảng gọn gàng */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{formatDate(item.submitted_at)}</TableCell>
                  <TableCell>{item.title || 'Trắc nghiệm MBTI'}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(item.result)}>{item.result}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{formatClarity(item.clarity)}</TableCell>
                  {/* <TableCell>
                    <Button variant="outline" size="sm">Xem chi tiết</Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default HistoryView;