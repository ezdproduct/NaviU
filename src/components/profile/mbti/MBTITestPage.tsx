import React, { useEffect, useState, useCallback } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '@/components/ui/card';
import { WP_BASE_URL } from '@/lib/auth/api';
import DGTCResult, { DGTCResultData } from "./DGTCResult"; // Import DGTCResultData
import GenericTestRunner from "./GenericTestRunner";
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, FileQuestion } from 'lucide-react';

// Định nghĩa interface cho cấu trúc câu hỏi từ API
interface ApiQuestion {
  id: string;
  text: string;
  choices: { [key: string]: { label: string } };
}

// Định nghĩa interface cho cấu trúc câu hỏi mà GenericTestRunner mong đợi
interface TransformedQuestion {
  id: string;
  text: string;
  options: { key: string; text: string }[];
}

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

export default function MBTITestPage() {
  const { user } = useAuth();
  const token = user ? localStorage.getItem('jwt_token') : null;

  const [questions, setQuestions] = useState<TransformedQuestion[]>([]);
  const [currentResult, setCurrentResult] = useState<DGTCResultData | null>(null);
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'intro' | 'test' | 'result' | 'history'>('intro'); // Quản lý các view

  const navigate = useNavigate();

  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/questions`);
      if (!res.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${res.status}`);
      }
      const data: ApiQuestion[] = await res.json();
      
      const transformedQuestions: TransformedQuestion[] = data.map(q => ({
        id: q.id,
        text: q.text,
        options: Object.entries(q.choices).map(([key, choice]) => ({
          key: key,
          text: choice.label,
        })),
      }));
      setQuestions(transformedQuestions);
    } catch (err: any) {
      console.error("Error fetching MBTI questions:", err);
      setError(err.message || 'Không thể tải câu hỏi MBTI.');
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  const fetchLatestResult = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/result`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Lỗi khi tải kết quả MBTI: ${res.status}`);
      }
      const data: DGTCResultData = await res.json();
      setCurrentResult(data);
      setView('result'); // Chuyển sang view kết quả nếu có kết quả mới nhất
    } catch (err: any) {
      console.error("Error fetching latest MBTI result:", err);
      // Không set error toàn cục nếu chỉ là không có kết quả
      setCurrentResult(null);
      setView('intro'); // Quay về intro nếu không có kết quả
    }
  }, [token]);

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
        throw new Error(errorData.message || `Lỗi khi tải lịch sử MBTI: ${res.status}`);
      }
      const data: TestHistoryItem[] = await res.json();
      setHistory(data.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()));
    } catch (err: any) {
      console.error("Error fetching MBTI history:", err);
      setError(err.message || 'Không thể tải lịch sử MBTI.');
    } finally {
      setLoadingHistory(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để làm bài test.");
      setLoadingQuestions(false);
      setLoadingHistory(false);
      return;
    }
    fetchQuestions();
    fetchLatestResult(); // Cố gắng tải kết quả mới nhất khi component mount
    fetchHistory();
  }, [token, fetchQuestions, fetchLatestResult, fetchHistory]);

  const handleSubmit = async (answers: { [key: string]: string }) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to submit answers: ${res.status}`);
      }
      const data: DGTCResultData = await res.json();
      setCurrentResult(data);
      showSuccess("Bài test đã hoàn thành! Kết quả của bạn đã được cập nhật.");
      setView('result'); // Chuyển sang view kết quả
      fetchHistory(); // Cập nhật lịch sử sau khi nộp bài
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi nộp bài test.');
      showError(err.message || 'Có lỗi xảy ra khi nộp bài test.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setCurrentResult(null);
    setView('test'); // Chuyển sang view test để làm lại
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

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bạn chưa đăng nhập</h2>
          <p className="text-gray-600">Vui lòng đăng nhập để làm bài trắc nghiệm MBTI.</p>
          <Button onClick={() => navigate('/login')} className="mt-4">Đăng nhập</Button>
        </div>
      </div>
    );
  }

  if (loadingQuestions) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
      {view === 'intro' && (
        <Card className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg p-6 text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800">Trắc nghiệm ĐGTC</CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-2">
              Khám phá 16 nhóm tính cách để hiểu sâu hơn về bản thân và cách bạn tương tác với thế giới.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Bài test này sẽ giúp bạn nhận diện những đặc điểm tính cách nổi bật, từ đó đưa ra những gợi ý hữu ích cho định hướng sự nghiệp và phát triển bản thân.
            </p>
            <Button onClick={() => setView('test')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">
              Bắt đầu làm bài
            </Button>
            <Button variant="outline" onClick={() => setView('history')} className="ml-4 px-8 py-3 rounded-lg font-medium">
              Xem lịch sử làm bài
            </Button>
          </CardContent>
        </Card>
      )}

      {view === 'test' && (
        <GenericTestRunner
          title="Trắc nghiệm ĐGTC"
          questions={questions}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      )}

      {view === 'result' && currentResult && (
        <DGTCResult
          resultData={currentResult}
          onRetake={handleRetake}
          loading={false}
          error={null}
        />
      )}

      {view === 'history' && (
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Lịch sử làm bài test ĐGTC</h1>
            <Button onClick={() => setView('intro')} className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              Làm bài test mới
            </Button>
          </div>
          <p className="text-gray-600 mb-8">Xem lại tất cả các bài test ĐGTC bạn đã hoàn thành và kết quả của chúng.</p>

          {loadingHistory && (
            <Card className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </Card>
          )}

          {!loadingHistory && history.length === 0 && (
            <Card className="p-6 text-center">
              <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl font-bold text-gray-800 mb-2">Chưa có bài test nào</CardTitle>
              <CardDescription>Bạn chưa hoàn thành bài test ĐGTC nào. Hãy bắt đầu làm một bài test mới!</CardDescription>
              <Button onClick={() => setView('test')} className="mt-4">Bắt đầu làm bài</Button>
            </Card>
          )}

          {!loadingHistory && history.length > 0 && (
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Ngày làm</TableHead>
                    <TableHead>Kết quả chính</TableHead>
                    {/* Đã loại bỏ cột Độ rõ ràng */}
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
                      {/* Đã loại bỏ cột Độ rõ ràng */}
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => { setCurrentResult(item as DGTCResultData); setView('result'); }}>
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
      )}
    </div>
  );
}