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
  score?: string | number; // score can be string (MBTI) or number (EQ, Cog)
  value?: string; // for filtering
}

interface ApiQuestion {
  id: string;
  group?: string; // for MBTI, EQ, Cog, Holland
  text: string;
  choices?: { [key: string]: ApiChoice } | number[]; // for MBTI, EQ, Cog, Filtering, Holland
  type?: string; // for filtering (e.g., "complex")
  subjects?: any; // for complex filtering questions
}

interface ApiValuesQuestion {
  id: string;
  text: string;
}

interface QuestionGroup {
  mbti: ApiQuestion[];
  eq: ApiQuestion[];
  cognitive: ApiQuestion[]; // Changed from 'cog' to 'cognitive' to match API
  holland: ApiQuestion[];
  values: ApiValuesQuestion[]; // Specific type for values
  filtering: ApiQuestion[];
}

interface TransformedQuestion {
  id: string;
  text: string;
  options: { key: string; text: string }[];
  group?: string; // Optional group for display/categorization
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

  const [allQuestions, setAllQuestions] = useState<TransformedQuestion[]>([]);
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
      
      const combinedQuestions: TransformedQuestion[] = [];

      const transform = (questions: ApiQuestion[], groupName: string): TransformedQuestion[] => {
        return questions.flatMap(q => {
          // Handle complex filtering questions (e.g., question 128)
          if (q.type === 'complex') {
            // For now, we'll skip complex questions as GenericTestRunner doesn't support them.
            // Or, if we want to include a placeholder, we can do so.
            // For this request, we'll just skip it.
            return []; 
          }

          // Handle Holland questions with choices as number array
          if (groupName === 'holland' && Array.isArray(q.choices)) {
            return {
              id: q.id.toString(),
              text: q.text,
              options: q.choices.map(score => ({
                key: score.toString(),
                text: `Mức độ ${score}`, // Example: "Mức độ 1", "Mức độ 2", etc.
              })),
              group: q.group,
            };
          }

          // Handle Values questions (no choices object, just text)
          if (groupName === 'values' && !q.choices) {
            return {
              id: q.id.toString(),
              text: q.text,
              options: [ // For values, we'll assume a simple "Yes/No" or "Important/Not Important" for now
                { key: 'important', text: 'Quan trọng' },
                { key: 'not_important', text: 'Không quan trọng' },
              ],
              group: q.group,
            };
          }

          // Default handling for MBTI, EQ, Cognitive, and simple Filtering questions
          if (q.choices && typeof q.choices === 'object' && !Array.isArray(q.choices)) {
            return {
              id: q.id.toString(),
              text: q.text,
              options: Object.entries(q.choices).map(([key, choice]) => ({
                key: key,
                text: choice.label,
              })),
              group: q.group,
            };
          }
          return []; // Skip questions with unsupported choice formats
        });
      };

      combinedQuestions.push(...transform(data.mbti, 'mbti'));
      combinedQuestions.push(...transform(data.eq, 'eq'));
      combinedQuestions.push(...transform(data.cognitive, 'cognitive')); // Use 'cognitive'
      combinedQuestions.push(...transform(data.holland, 'holland'));
      combinedQuestions.push(...transform(data.values as ApiQuestion[], 'values')); // Cast to ApiQuestion[]
      combinedQuestions.push(...transform(data.filtering, 'filtering'));

      setAllQuestions(combinedQuestions);
    } catch (err: any) {
      setError(err.message || "Không tải được câu hỏi từ NaviU.");
    } finally {
      setLoadingQuestions(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Bạn chưa đăng nhập.");
      setLoadingQuestions(false);
      return;
    }
    fetchQuestions();
  }, [isAuthenticated, fetchQuestions]);

  const handleSubmit = async (answers: { [key: string]: string }) => {
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
      questions={allQuestions}
      onSubmit={handleSubmit}
      isSubmitting={loading}
    />
  );
};

export default NaviuMBTITestRunner;