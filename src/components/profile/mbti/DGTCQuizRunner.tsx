import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { WP_BASE_URL } from '@/lib/auth/api';
import { DGTCResultData } from "@/components/profile/mbti/DGTCResult";
import GenericTestRunner from "./GenericTestRunner";
import { showSuccess, showError } from '@/utils/toast';
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ApiQuestion {
  id: string;
  text: string;
  choices: { [key: string]: { label: string } };
}

interface TransformedQuestion {
  id: string;
  text: string;
  options: { key: string; text: string }[];
}

const API_URL = `${WP_BASE_URL}/wp-json/mbti/v1`;

const DGTCQuizRunner = () => {
  const { user } = useAuth();
  const token = user ? localStorage.getItem('jwt_token') : null;
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<TransformedQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    if (!token) return;
    setLoadingQuestions(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/questions`);
      if (!res.ok) throw new Error(`Lỗi HTTP! Trạng thái: ${res.status}`);
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
      setError(err.message || 'Không thể tải câu hỏi ĐGTC.');
    } finally {
      setLoadingQuestions(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setError("Bạn chưa đăng nhập.");
      setLoadingQuestions(false);
      return;
    }
    fetchQuestions();
  }, [token, fetchQuestions]);

  const handleSubmit = async (answers: { [key: string]: string }) => {
    if (!token) return;
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
      showSuccess("Bài test đã hoàn thành! Đang chuyển đến trang kết quả.");
      navigate('/profile/dgtc-result', { state: { resultData: data } });
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi nộp bài test.');
      showError(err.message || 'Có lỗi xảy ra khi nộp bài test.');
    } finally {
      setSubmitting(false);
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
      title="Trắc nghiệm ĐGTC"
      questions={questions}
      onSubmit={handleSubmit}
      isSubmitting={submitting}
    />
  );
};

export default DGTCQuizRunner;