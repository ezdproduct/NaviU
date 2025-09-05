import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WP_BASE_URL } from '@/lib/auth/api';
import { useAuth } from '@/contexts/AuthContext';
import { showError } from '@/utils/toast';
import { NaviuHistoryItem } from '@/types';
import TestHistoryTable from '@/components/profile/TestHistoryTable'; // Import component mới

const API_URL = `${WP_BASE_URL}/wp-json/naviu/v1`;

const NaviuHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const token = user ? localStorage.getItem('jwt_token') : null;
  const navigate = useNavigate();

  const [history, setHistory] = useState<NaviuHistoryItem[]>([]);
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
        throw new Error(errorData.message || `Lỗi khi tải lịch sử NaviU: ${res.status}`);
      }
      const data: NaviuHistoryItem[] = await res.json();
      setHistory(data.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()));
    } catch (err: any) {
      console.error("Error fetching NaviU history:", err);
      setError(err.message || 'Không thể tải lịch sử NaviU.');
      showError(err.message || 'Không thể tải lịch sử NaviU.');
    } finally {
      setLoadingHistory(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleViewDetails = (item: NaviuHistoryItem) => {
    navigate('/profile/naviu-result', {
      state: { resultData: item.details, testId: item.id },
    });
  };

  const handleStartNewTest = () => {
    navigate('/profile/test/naviu-mbti/do-test');
  };

  const handleGoBack = () => {
    navigate('/profile/do-test');
  };

  return (
    <TestHistoryTable
      title="Lịch sử làm bài test Toàn Diện NaviU"
      description="Xem lại tất cả các bài test NaviU bạn đã hoàn thành và kết quả của chúng."
      history={history}
      loadingHistory={loadingHistory}
      error={error}
      onViewDetails={handleViewDetails}
      onStartNewTest={handleStartNewTest}
      onGoBack={handleGoBack}
      testType="naviu"
    />
  );
};

export default NaviuHistoryPage;