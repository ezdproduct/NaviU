import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, FileQuestion, ArrowLeft } from 'lucide-react';
import { WP_BASE_URL } from '@/lib/auth/api';
import { useAuth } from '@/contexts/AuthContext';
import { showError } from '@/utils/toast';

interface TestHistoryItem {
  id: string;
  type: 'ĐGTC' | string;
  title: string;
  result: string;
  scores?: { [key: string]: number };
  clarity?: { [key: string]: string };
  percent?: { [key: string]: string };
  started_at: string;
  submitted_at: string;
}

const API_URL = `${WP_BASE_URL}/wp-json/mbti/v1`;

const DGTCHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const token = user ? localStorage.getItem('jwt_token') : null;
  const navigate = useNavigate();

  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!token) {
      setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để xem lịch sử.');
      setLoadingHistory(false);
      return;
    }

    setLoadingHistory(true);
    try {
      const res = await fetch(`${API_URL}/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Lỗi khi tải lịch sử ĐGTC: ${res.status}`);
      }
      const data: TestHistoryItem[] = await res.json();
      setHistory(data.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()));
    } catch (err: any) {
      console.error("Error fetching DGTC history:", err);
      setError(err.message || 'Không thể tải lịch sử ĐGTC.');
      showError(err.message || 'Không thể tải lịch sử ĐGTC.');
    } finally {
      setLoadingHistory(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Ngày không hợp lệ";
      }
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (error) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-red-50 flex items-center justify-center p-4">
        <Card className="rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <CardTitle className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</CardTitle>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Thử lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <History className="h-8 w-8 text-blue-600" />
          Lịch sử làm bài test ĐGTC
        </h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/profile/do-test')} className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
            </Button>
            <Button onClick={() => navigate('/profile/do-test/dgtc')} className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2">
                <FileQuestion className="h-4 w-4" />
                Làm bài test mới
            </Button>
        </div>
      </div>
      <p className="text-gray-600 mb-8">Xem lại tất cả các bài test ĐGTC bạn đã hoàn thành và kết quả của chúng.</p>

      {loadingHistory && (
        <Card className="p-6 rounded-xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </Card>
      )}

      {!loadingHistory && history.length === 0 && (
        <Card className="p-6 text-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50">
          <FileQuestion className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <CardTitle className="text-xl font-bold text-gray-800 mb-2">Chưa có bài test nào</CardTitle>
          <CardDescription className="text-gray-600">Bạn chưa hoàn thành bài test ĐGTC nào. Hãy bắt đầu làm một bài test mới!</CardDescription>
          <Button onClick={() => navigate('/profile/do-test/dgtc')} className="mt-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Bắt đầu làm bài</Button>
        </Card>
      )}

      {!loadingHistory && history.length > 0 && (
        <Card className="overflow-hidden rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Ngày hoàn thành</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{formatDate(item.submitted_at)}</TableCell>
                  <TableCell>
                    <Badge className={`bg-blue-600 text-white`}>{item.result}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => { navigate('/profile/dgtc-result', { state: { resultData: item } }); }} className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg">
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default DGTCHistoryPage;