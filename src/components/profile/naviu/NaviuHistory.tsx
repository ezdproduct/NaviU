import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileQuestion } from 'lucide-react';
import { NaviuHistoryItem, NaviuResultData } from '@/types'; // Cập nhật import
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface NaviuHistoryProps {
  history: NaviuHistoryItem[];
  loadingHistory: boolean;
  onViewDetails: (item: NaviuHistoryItem) => void;
  onStartNewTest: () => void;
}

const renderHollandHistory = (hollandData: any) => {
  if (!hollandData) return null;
  if (typeof hollandData === 'string') return hollandData;
  if (typeof hollandData === 'object' && hollandData !== null) {
    return Object.entries(hollandData)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([code]) => code)
      .join('');
  }
  return 'N/A';
}

const NaviuHistory: React.FC<NaviuHistoryProps> = ({ history, loadingHistory, onViewDetails, onStartNewTest }) => {
  const navigate = useNavigate(); // Khởi tạo useNavigate

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

  const handleViewDetailsClick = (item: NaviuHistoryItem) => {
    // Điều hướng đến trang kết quả mới với dữ liệu lịch sử
    navigate('/profile/naviu-result', { state: { resultData: item.details || item } });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Lịch sử làm bài test Toàn Diện NaviU</h1>
        <Button onClick={onStartNewTest} className="flex items-center gap-2">
          <FileQuestion className="h-4 w-4" />
          Làm bài test mới
        </Button>
      </div>
      <p className="text-gray-600 mb-8">Xem lại tất cả các bài test NaviU bạn đã hoàn thành và kết quả của chúng.</p>

      {loadingHistory && (
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]"><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead className="text-right"><Skeleton className="h-4 w-20" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {!loadingHistory && history.length === 0 && (
        <Card className="p-6 text-center border-2 border-dashed border-gray-300 bg-gray-50">
          <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <CardTitle className="text-xl font-bold text-gray-800 mb-3">Chưa có bài test nào</CardTitle>
          <CardDescription className="text-lg text-gray-600">
                Bạn chưa hoàn thành bài test NaviU nào. Hãy bắt đầu làm một bài test mới!
          </CardDescription>
          <Button onClick={onStartNewTest} className="mt-4">Bắt đầu làm bài</Button>
        </Card>
      )}

      {!loadingHistory && history.length > 0 && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Ngày hoàn thành</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="font-medium">{formatDate(h.submitted_at)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {h.mbti && <Badge variant="secondary">MBTI: {h.mbti}</Badge>}
                      {h.eq && <Badge variant="secondary">EQ: {h.eq}</Badge>}
                      {h.cog && <Badge variant="secondary">Cog: {h.cog}</Badge>}
                      {h.holland && <Badge variant="secondary">Holland: {renderHollandHistory(h.holland)}</Badge>}
                      {!h.mbti && !h.eq && !h.cog && !h.holland && (
                        <Badge variant="outline">Không có chi tiết</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetailsClick(h)}>
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

export default NaviuHistory;