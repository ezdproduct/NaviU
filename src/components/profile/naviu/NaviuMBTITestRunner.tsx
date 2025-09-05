import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { axiosInstance, WP_BASE_URL } from '@/lib/auth/api';
import { showSuccess, showError } from '@/utils/toast';
import GenericTestRunner from "../mbti/GenericTestRunner";
import { NaviuResultData } from '@/types'; // Cập nhật import
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { personalityData } from "@/data/personalityData"; // Import personality data
import { valuesData } from "@/data/valuesData"; // Import values data
import { eqData } from "@/data/eqData"; // Import EQ data

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

// Helper function to generate random result data
const generateRandomNaviuResult = (): NaviuResultData => {
  const mbtiTypes = Object.keys(personalityData);
  const randomMbtiType = mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)];

  const randomScore = (max = 10) => Math.floor(Math.random() * (max + 1));
  const randomPercent = () => Math.floor(Math.random() * 101);

  const eqLevels = ['Thấp', 'Trung bình', 'Cao'];
  const clarityLevels = ['Không rõ ràng', 'Trung bình', 'Rõ ràng'];

  const eiPercent = randomPercent();
  const snPercent = randomPercent();
  const tfPercent = randomPercent();
  const jpPercent = randomPercent();

  return {
    result: {
      major_group_name: 'Nhóm ngành Xã hội (Mẫu)',
      major_group_code: 'S',
    },
    mbti: {
      result: randomMbtiType,
      scores: { E: randomScore(), S: randomScore(), T: randomScore(), J: randomScore(), I: randomScore(), N: randomScore(), F: randomScore(), P: randomScore() },
      clarity: {
        'EI': clarityLevels[Math.floor(Math.random() * clarityLevels.length)],
        'SN': clarityLevels[Math.floor(Math.random() * clarityLevels.length)],
        'TF': clarityLevels[Math.floor(Math.random() * clarityLevels.length)],
        'JP': clarityLevels[Math.floor(Math.random() * clarityLevels.length)],
      },
      percent: {
        'EI': `${eiPercent}% - ${100 - eiPercent}%`,
        'SN': `${snPercent}% - ${100 - snPercent}%`,
        'TF': `${tfPercent}% - ${100 - tfPercent}%`,
        'JP': `${jpPercent}% - ${100 - jpPercent}%`,
      },
    },
    eq: {
      scores: Object.keys(eqData).reduce((acc, key) => ({ ...acc, [key]: randomScore(100) }), {}),
      levels: Object.keys(eqData).reduce((acc, key) => ({ ...acc, [key]: eqLevels[Math.floor(Math.random() * eqLevels.length)] }), {}),
    },
    cognitive: {
      Logic: randomScore(100),
      'Ngôn_ngữ': randomScore(100),
      'Không_gian': randomScore(100),
    },
    holland: {
      R: randomScore(100), I: randomScore(100), A: randomScore(100), S: randomScore(100), E: randomScore(100), C: randomScore(100),
    },
    values: Object.keys(valuesData).reduce((acc, key) => ({ ...acc, [key]: randomScore(100) }), {}),
  };
};


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

    // Simulate API call and generate random data
    setTimeout(() => {
      try {
        const randomResult = generateRandomNaviuResult();
        console.log("🎉 [DEBUG] Dữ liệu kết quả ngẫu nhiên:", randomResult);

        setNaviuResult(randomResult); // Update global state
        showSuccess("Đã hoàn thành bài test! Đang tạo báo cáo của bạn...");
        navigate('/profile/naviu-result', { state: { resultData: randomResult } });

      } catch (err: any) {
        console.error("🔥 [DEBUG] Lỗi khi tạo dữ liệu ngẫu nhiên:", err);
        showError(err.message || "Lỗi khi tạo dữ liệu kết quả.");
      } finally {
        setLoading(false);
      }
    }, 1500); // Simulate a 1.5 second network delay
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
      questions={mbtiQuestions}
      onSubmit={handleSubmit}
      isSubmitting={loading}
    />
  );
};

export default NaviuMBTITestRunner;