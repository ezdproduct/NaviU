import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WP_BASE_URL } from '@/lib/auth/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, History, FileQuestion, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardDetailModal from './DashboardDetailModal'; // Import DashboardDetailModal

// Cập nhật interface TestHistoryItem để hỗ trợ nhiều loại bài test
interface TestHistoryItem {
  id: string;
  type: 'ĐGTC' | 'Holland' | 'EQ' | 'Values' | string; // Thêm trường type
  title: string;
  result: string; // Kết quả chính (ví dụ: "ENTP" cho ĐGTC)
  scores?: { [key: string]: number }; // Có thể có hoặc không tùy bài test
  clarity?: { [key: string]: string }; // Có thể có hoặc không tùy bài test
  percent?: { [key: string]: string }; // Có thể có hoặc không tùy bài test
  details?: any; // Chi tiết kết quả đầy đủ, có thể là JSON object
  started_at: string;
  submitted_at: string;
}

// Định nghĩa các API endpoint cho từng loại bài test
const API_ENDPOINTS = {
  ĐGTC: `${WP_BASE_URL}/wp-json/mbti/v1/history`, // Giữ nguyên endpoint API nhưng đổi tên loại test
  // Thêm các API endpoint cho các bài test khác tại đây
  // HOLLAND: `${WP_BASE_URL}/wp-json/holland/v1/history`,
  // EQ: `${WP_BASE_URL}/wp-json/eq/v1/history`,
  // VALUES: `${WP_BASE_URL}/wp-json/values/v1/history`,
};

const HistoryView = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('jwt_token');
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; description: React.ReactNode; content?: React.ReactNode } | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!token) {
      setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để xem lịch sử.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const fetchPromises = Object.entries(API_ENDPOINTS).map(([type, url]) =>
      fetch(url, { headers })
        .then(async res => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || `Lỗi khi tải lịch sử ${type}: ${res.status}`);
          }
          return { type, data };
        })
        .catch(err => {
          console.error(`Error fetching ${type} history:`, err);
          return { type, error: err.message };
        })
    );

    try {
      const results = await Promise.allSettled(fetchPromises);
      let combinedHistory: TestHistoryItem[] = [];
      let hasFetchError = false;

      results.forEach(result => {
        if (result.status === 'fulfilled' && !result.value.error) {
          const { type, data } = result.value;
          // Giả định mỗi API trả về một mảng các item lịch sử
          const typedHistory = data.map((item: any) => ({
            ...item,
            type: type,
            title: item.title || `${type} Test`, // Gán tiêu đề mặc định nếu không có
          }));
          combinedHistory = combinedHistory.concat(typedHistory);
        } else {
          hasFetchError = true;
          // Có thể lưu trữ lỗi cụ thể cho từng API nếu muốn hiển thị chi tiết hơn
        }
      });

      // Sắp xếp lịch sử theo thời gian nộp bài giảm dần (mới nhất trước)
      combinedHistory.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

      setHistory(combinedHistory);
      if (hasFetchError && combinedHistory.length === 0) {
        setError('Không thể tải một số hoặc tất cả lịch sử bài test. Vui lòng kiểm tra cấu hình API.');
      } else if (hasFetchError) {
        // Nếu có lỗi nhưng vẫn có dữ liệu, có thể hiển thị cảnh báo thay vì lỗi toàn màn hình
        // setError('Có lỗi xảy ra khi tải một số lịch sử bài test.');
      }

    } catch (err: any) {
      console.error("Error processing history fetches:", err);
      setError(err.message || 'Có lỗi xảy ra khi tải lịch sử bài test.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'ĐGTC': 'bg-blue-600', // Đổi màu cho ĐGTC
      'Holland': 'bg-orange-600',
      'EQ': 'bg-green-600',
      'Values': 'bg-purple-600',
      // Thêm màu cho các loại test khác
      'default': 'bg-gray-500',
    };
    return colors[type] || colors['default'];
  };

  const getResultColor = (result: string) => {
    const dgtcColors: { [key: string]: string } = { // Đổi tên biến
      'INTJ': 'bg-purple-600', 'INTP': 'bg-blue-600', 'ENTJ': 'bg-red-600', 'ENTP': 'bg-orange-600',
      'INFJ': 'bg-green-600', 'INFP': 'bg-teal-600', 'ENFJ': 'bg-pink-600', 'ENFP': 'bg-yellow-600',
      'ISTJ': 'bg-gray-700', 'ISFJ': 'bg-indigo-600', 'ESTJ': 'bg-red-700', 'ESFJ': 'bg-pink-700',
      'ISTP': 'bg-gray-600', 'ISFP': 'bg-green-500', 'ESTP': 'bg-orange-700', 'ESFP': 'bg-yellow-700'
    };
    return dgtcColors[result] || 'bg-gray-500';
  };

  const formatClarity = (clarity: { [key: string]: string } | undefined) => {
    if (!clarity) return 'N/A';
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
      return dateString;
    }
  };

  const handleViewDetails = (item: TestHistoryItem) => {
    let title = `Kết quả bài test: ${item.title} (${item.type})`;
    let description: React.ReactNode = `Kết quả chính: ${item.result}`;
    let content: React.ReactNode = null;

    if (item.type === 'ĐGTC' && item.scores && item.percent) { // Đổi điều kiện
      description = (
        <>
          <p>Kết quả chính: <Badge className={getResultColor(item.result)}>{item.result}</Badge></p>
          <p className="mt-2">Điểm số: {Object.entries(item.scores).map(([key, value]) => `${key}: ${value}`).join(', ')}</p>
          <p>Độ rõ ràng: {formatClarity(item.clarity)}</p>
          <p>Phần trăm: {Object.entries(item.percent).map(([key, value]) => `${key}: ${value}`).join(', ')}</p>
        </>
      );
    } else if (item.details) {
      // Hiển thị chi tiết chung nếu có trường 'details'
      content = (
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
          {JSON.stringify(item.details, null, 2)}
        </pre>
      );
    } else {
      content = <p className="text-sm text-gray-600">Không có thông tin chi tiết bổ sung.</p>;
    }

    setModalContent({ title, description, content });
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Lịch sử làm bài test</h1>
        <Button onClick={fetchHistory} disabled={loading} className="flex items-center gap-2">
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Cập nhật
        </Button>
      </div>
      <p className="text-gray-600 mb-8">Xem lại tất cả các bài test bạn đã hoàn thành và kết quả của chúng.</p>

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
          <CardDescription>Bạn chưa hoàn thành bài test nào. Hãy bắt đầu làm một bài test mới!</CardDescription>
        </Card>
      )}

      {!loading && !error && history.length > 0 && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Ngày làm</TableHead>
                <TableHead>Loại bài test</TableHead>
                <TableHead>Tên bài test</TableHead>
                <TableHead>Kết quả chính</TableHead>
                <TableHead>Độ rõ ràng</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{formatDate(item.submitted_at)}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                  </TableCell>
                  <TableCell>{item.title || 'Không xác định'}</TableCell>
                  <TableCell>
                    <Badge className={getResultColor(item.result)}>{item.result}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{formatClarity(item.clarity)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(item)}>
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {modalContent && (
        <DashboardDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalContent.title}
          description={modalContent.description}
          content={modalContent.content}
        />
      )}
    </div>
  );
};

export default HistoryView;