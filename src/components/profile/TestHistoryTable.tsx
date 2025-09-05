import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { History, FileQuestion, ArrowLeft } from 'lucide-react';
import { NaviuHistoryItem, DGTCResultData, NaviuResultData } from '@/types'; // Import cả ba loại dữ liệu

interface TestHistoryTableProps {
  title: string;
  description: string;
  history: NaviuHistoryItem[] | DGTCResultData[];
  loadingHistory: boolean;
  error: string | null;
  onViewDetails: (item: NaviuHistoryItem | DGTCResultData) => void;
  onStartNewTest: () => void;
  onGoBack: () => void;
  testType: 'naviu' | 'dgtc';
}

const renderHollandHistory = (hollandData: NaviuResultData['holland'] | string | undefined) => {
  if (!hollandData) return 'N/A';
  if (typeof hollandData === 'string') return hollandData;
  if (typeof hollandData === 'object' && hollandData !== null) {
    return Object.entries(hollandData)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([code]) => code)
      .join('');
  }
  return 'N/A';
};

const renderEqHistory = (eqData: NaviuResultData['eq'] | string | undefined) => {
  if (!eqData) return 'N/A';
  if (typeof eqData === 'string') return eqData;
  if (typeof eqData === 'object' && eqData.levels) {
    return Object.entries(eqData.levels)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }
  if (typeof eqData === 'object' && Object.keys(eqData).length > 0) {
      return 'Có dữ liệu'; 
  }
  return 'N/A';
};

const renderCogHistory = (cogData: NaviuResultData['cognitive'] | string | undefined) => {
  if (!cogData) return 'N/A';
  if (typeof cogData === 'string') return cogData;
  if (typeof cogData === 'object' && cogData !== null) {
    return Object.entries(cogData)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }
  return 'N/A';
};

const TestHistoryTable: React.FC<TestHistoryTableProps> = ({
  title,
  description,
  history,
  loadingHistory,
  error,
  onViewDetails,
  onStartNewTest,
  onGoBack,
  testType,
}) => {
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
          {title}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onGoBack} className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <Button onClick={onStartNewTest} className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2">
            <FileQuestion className="h-4 w-4" />
            Làm bài test mới
          </Button>
        </div>
      </div>
      <p className="text-gray-600 mb-8">{description}</p>

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
        <Card className="p-6 text-center rounded-xl border-2 border-dashed border-blue-600 bg-profile-gradient text-white"> {/* Changed bg-blue-50 border-blue-300 to bg-profile-gradient border-blue-600 and added text-white */}
          <FileQuestion className="h-16 w-16 text-blue-200 mx-auto mb-4" /> {/* Changed text-blue-400 to text-blue-200 */}
          <CardTitle className="text-xl font-bold text-white mb-2">Chưa có bài test nào</CardTitle> {/* Changed text-gray-800 to text-white */}
          <CardDescription className="text-blue-100">Bạn chưa hoàn thành bài test nào. Hãy bắt đầu làm một bài test mới!</CardDescription> {/* Changed text-gray-600 to text-blue-100 */}
          <Button onClick={onStartNewTest} className="mt-4 bg-blue-800 text-white hover:bg-blue-700 rounded-lg">Bắt đầu làm bài</Button> {/* Adjusted button color */}
        </Card>
      )}

      {!loadingHistory && history.length > 0 && (
        <Card className="overflow-hidden rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-900 text-white"> {/* Changed bg-gray-50 to bg-blue-900 and added text-white */}
                <TableHead className="w-[180px] text-blue-100">Ngày hoàn thành</TableHead> {/* Adjusted text color */}
                <TableHead className="text-blue-100">Kết quả</TableHead> {/* Adjusted text color */}
                <TableHead className="text-right text-blue-100">Hành động</TableHead> {/* Adjusted text color */}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-blue-800 text-white"> {/* Changed bg-white to bg-blue-800 and added text-white */}
              {history.map((item: NaviuHistoryItem | DGTCResultData) => (
                <TableRow key={item.id} className="border-blue-700 hover:bg-blue-700"> {/* Adjusted border and hover color */}
                  <TableCell className="font-medium text-white">{formatDate(item.submitted_at)}</TableCell> {/* Adjusted text color */}
                  <TableCell>
                    {testType === 'naviu' ? (
                      <div className="flex flex-wrap gap-1">
                        {(item as NaviuHistoryItem).mbti && <Badge variant="secondary" className="bg-blue-500 text-white">MBTI: {(item as NaviuHistoryItem).mbti}</Badge>}
                        {(item as NaviuHistoryItem).eq && <Badge variant="secondary" className="bg-blue-500 text-white">EQ: {renderEqHistory((item as NaviuHistoryItem).eq)}</Badge>}
                        {(item as NaviuHistoryItem).cog && <Badge variant="secondary" className="bg-blue-500 text-white">Cog: {renderCogHistory((item as NaviuHistoryItem).cog)}</Badge>}
                        {(item as NaviuHistoryItem).holland && <Badge variant="secondary" className="bg-blue-500 text-white">Holland: {renderHollandHistory((item as NaviuHistoryItem).holland)}</Badge>}
                        {!((item as NaviuHistoryItem).mbti || (item as NaviuHistoryItem).eq || (item as NaviuHistoryItem).cog || (item as NaviuHistoryItem).holland) && (
                          <Badge variant="outline" className="text-blue-100 border-blue-300">Không có chi tiết</Badge> 
                        )}
                      </div>
                    ) : (
                      <Badge className={`bg-blue-500 text-white`}>{(item as DGTCResultData).result}</Badge> 
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(item)} className="border-blue-300 text-blue-300 hover:bg-blue-700 hover:text-white rounded-lg"> {/* Adjusted button color */}
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

export default TestHistoryTable;