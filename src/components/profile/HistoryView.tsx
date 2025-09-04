import React, 'useEffect', useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { List, Frown, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = 'https://naviu-backend.ezd.vn/wp-json/mbti/v1/history';

interface TestHistoryItem {
  id: number;
  title: string;
  result: string;
  scores: { [key: string]: number };
  clarity: { [key: string]: string };
  percent: { [key: string]: string };
  started_at: string;
  submitted_at: string;
}

const HistoryView = () => {
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          throw new Error("Bạn chưa đăng nhập.");
        }
        
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Không thể tải lịch sử bài test');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm, dd/MM/yyyy');
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Lịch sử làm bài test</h1>
        <p className="text-gray-600 mb-8">Xem lại kết quả các bài test MBTI bạn đã thực hiện.</p>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Frown className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Lịch sử làm bài test</h1>
      <p className="text-gray-600 mb-8">Xem lại kết quả các bài test MBTI bạn đã thực hiện.</p>
      
      {history.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <List className="mx-auto h-12 w-12 text-gray-400" />
            <CardTitle className="mt-4">Chưa có lịch sử</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bạn chưa hoàn thành bài test nào.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {history.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-md">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50 p-4 border-b">
                <div>
                  <CardTitle className="text-lg sm:text-xl">{item.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    <span>Hoàn thành lúc: {formatDate(item.submitted_at)}</span>
                  </div>
                </div>
                <Badge className="text-lg font-bold px-4 py-2" variant="default">Kết quả: {item.result}</Badge>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Điểm số</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    {Object.entries(item.scores).map(([key, value]) => (
                      <p key={key}><strong>{key}:</strong> {value}</p>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Độ rõ ràng</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    {Object.entries(item.clarity).map(([key, value]) => (
                      <p key={key}><strong>{key}:</strong> <Badge variant="secondary">{value}</Badge></p>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Phần trăm</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    {Object.entries(item.percent).map(([key, value]) => (
                      <p key={key}><strong>{key}:</strong> {value}</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;