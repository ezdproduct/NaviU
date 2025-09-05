import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WP_BASE_URL } from '@/lib/auth/api';
import { useAuth } from '@/contexts/AuthContext';
import { showError } from '@/utils/toast';
import TestHistoryTable from '@/components/profile/TestHistoryTable'; // Import component mới
import { DGTCResultData } from '@/types'; // Import DGTCResultData

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

  const [history, setHistory] = useState<DGTCResultData[]>([]);
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
      const data: DGTCResultData[] = await res.json();
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

  const handleViewDetails = (item: DGTCResultData) => {
    navigate('/profile/dgtc-result', { state: { resultData: item } });
  };

  const handleStartNewTest = () => {
    navigate('/profile/do-test/dgtc');
  };

  const handleGoBack = () => {
    navigate('/profile/do-test');
  };

  return (
    <TestHistoryTable
      title="Lịch sử làm bài test ĐGTC"
      description="Xem lại tất cả các bài test ĐGTC bạn đã hoàn thành và kết quả của chúng."
      history={history}
      loadingHistory={loadingHistory}
      error={error}
      onViewDetails={handleViewDetails}
      onStartNewTest={handleStartNewTest}
      onGoBack={handleGoBack}
      testType="dgtc"
    />
  );
};

export default DGTCHistoryPage;