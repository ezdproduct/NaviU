import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { axiosInstance, WP_BASE_URL } from '@/lib/auth/api';
import { showSuccess, showError } from '@/utils/toast';
import GenericTestRunner from "../mbti/GenericTestRunner";
import { NaviuResultData } from '@/types'; // Cập nhật import
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ApiChoice {
  label: string;
  score: string;
}

interface ApiQuestion {
  id: string;
  text: string;
  choices: { [key: string]: ApiChoice };
}

interface QuestionGroup {
  mbti: ApiQuestion[];
  eq: ApiQuestion[];
  cog: ApiQuestion[];
  holland: ApiQuestion[];
}

interface TransformedQuestion {
  id: string;
  text: string;
  options: { key: string; text: string }[];
  group: 'mbti' | 'eq' | 'cog' | 'holland';
}

const API_BASE = `${WP_BASE_URL}/wp-json/naviu/v1`;

const NaviuMBTITestRunner = () => {
  const { isAuthenticated, setNaviuResult } = useAuth();
  const navigate = useNavigate();

  const [mbtiQuestions, setMbtiQuestions] = useState<TransformedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`${API_BASE}/questions`);
      if (response.status !== 200) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      const data: QuestionGroup = response.data;
      
      const transformedMbtiQuestions: TransformedQuestion[] = data.mbti.map(q => ({
        id: q.id,
        text: q.text,
        options: Object.entries(q.choices).map(([key, choice]) => ({
          key: key,
          text: choice.label,
        })),
        group: 'mbti',
      }));
      setMbtiQuestions(transformedMbtiQuestions);
    } catch (err: any) {
      setError(err.message || "Không tải được câu hỏi MBTI từ NaviU.");
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Bạn chưa đăng nhập.");
      setLoadingQuestions(false);
      return;
    }
    fetchQuestions();
  }, [isAuthenticated, fetchQuestions]);

  const handleSubmit = async (mbtiAnswers: { [key: string]: string }) => {
    setLoading(true);
    setError(null);

    const payload = {
      mbti: mbtiAnswers,
      // Các phần khác của bài test toàn diện sẽ trống nếu chỉ làm MBTI
      eq: {},
      cog: {},
      holland: {},
    };

    console.log("🚀 [DEBUG] Dữ liệu MBTI gửi đi:", JSON.stringify(payload, null, 2));

    try {
      const response = await axiosInstance.post(`${API_BASE}/submit`, payload);

      console.log("✅ [DEBUG] Phản hồi từ server:", response);

      if (response.status !== 200) {
        const errorData = response.data;
        console.error("❌ [DEBUG] Lỗi từ API:", errorData);
        throw new Error(errorData.message || `Lỗi ${response.status}: ${response.statusText}`);
      }

      const data: NaviuResultData = response.data;
      console.log("🎉 [DEBUG] Dữ liệu kết quả NaviU (MBTI):", data);

      setNaviuResult(data); // Update global state with the full NaviU result
      showSuccess("Đã nộp bài test MBTI NaviU thành công!");
      navigate('/profile/naviu-result', { state: { resultData: data } });

    } catch (err: any) {
      console.error("🔥 [DEBUG] Lỗi trong khối catch:", err);
      showError(err.message || "Lỗi kết nối server khi nộp bài MBTI NaviU.");
    } finally {
      setLoading(false);
    }
  };

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
          <Button onClick={fetchQuestions} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Thử lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <GenericTestRunner
      title="Trắc nghiệm MBTI (NaviU)"
      questions={mbtiQuestions}
      onSubmit={handleSubmit}
      isSubmitting={loading}
    />
  );
};

export default NaviuMBTITestRunner;