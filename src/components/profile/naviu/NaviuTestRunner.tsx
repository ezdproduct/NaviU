import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { axiosInstance, WP_BASE_URL } from '@/lib/auth/api'; // Import axiosInstance
import { showSuccess, showError } from '@/utils/toast';
import GenericTestRunner from "../mbti/GenericTestRunner";
import { NaviuResultData } from '../NaviUTestPage';
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ApiQuestion {
  id: string;
  text: string;
  choices: { [key: string]: { label: string } };
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

const NaviuTestRunner = () => {
  const { isAuthenticated, setNaviuResult } = useAuth();
  const navigate = useNavigate();

  const [allQuestions, setAllQuestions] = useState<TransformedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`${API_BASE}/questions`); // Sử dụng axiosInstance
      if (response.status !== 200) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      const data: QuestionGroup = response.data;
      
      const transformedQuestions: TransformedQuestion[] = [];
      (Object.keys(data) as Array<keyof QuestionGroup>).forEach(groupName => {
        data[groupName].forEach(q => {
          transformedQuestions.push({
            id: q.id,
            text: q.text,
            options: Object.entries(q.choices).map(([key, choice]) => ({
              key: key,
              text: choice.label,
            })),
            group: groupName,
          });
        });
      });
      setAllQuestions(transformedQuestions);
    } catch (err: any) {
      setError(err.message || "Không tải được câu hỏi NaviU.");
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

  const handleSubmit = async (flatAnswers: { [key: string]: string }) => {
    setLoading(true);
    const groupedAnswers: { [key: string]: { [qid: string]: string } } = {
      mbti: {}, eq: {}, cog: {}, holland: {}
    };

    allQuestions.forEach(q => {
      if (flatAnswers[q.id]) {
        // KIỂM TRA AN TOÀN: Chỉ gán nếu nhóm tồn tại
        if (groupedAnswers[q.group]) {
          groupedAnswers[q.group][q.id] = flatAnswers[q.id];
        } else {
          console.warn(`[DEBUG] Gặp nhóm câu hỏi không xác định: '${q.group}'. Câu trả lời này sẽ bị bỏ qua.`);
        }
      }
    });

    const payload = {
      mbti: groupedAnswers.mbti,
      eq: groupedAnswers.eq,
      cog: groupedAnswers.cog,
      holland: groupedAnswers.holland,
    };

    console.log("🚀 [DEBUG] Dữ liệu gửi đi:", JSON.stringify(payload, null, 2));

    try {
      const response = await axiosInstance.post(`${API_BASE}/submit`, payload); // Sử dụng axiosInstance

      console.log("✅ [DEBUG] Phản hồi từ server:", response);

      if (response.status !== 200) {
        try {
            const errorData = response.data;
            console.error("❌ [DEBUG] Lỗi từ API (JSON):", errorData);
            throw new Error(errorData.message || `Lỗi ${response.status}: ${response.statusText}`);
        } catch (e) {
            const errorText = JSON.stringify(response.data); // Axios response.data is already parsed
            console.error("❌ [DEBUG] Lỗi từ API (Không phải JSON):", errorText);
            throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
        }
      }

      const data: NaviuResultData = response.data;
      console.log("🎉 [DEBUG] Dữ liệu kết quả (JSON):", data);

      setNaviuResult(data); // Update global state
      showSuccess("Đã nộp bài test NaviU thành công!");
      navigate('/profile/naviu-result', { state: { resultData: data } });

    } catch (err: any) {
      console.error("🔥 [DEBUG] Lỗi trong khối catch:", err);
      showError(err.message || "Lỗi kết nối server khi nộp bài NaviU.");
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
      title="Bài Test Toàn Diện NaviU"
      questions={allQuestions}
      onSubmit={handleSubmit}
      isSubmitting={loading}
    />
  );
};

export default NaviuTestRunner;