import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { WP_BASE_URL } from '@/lib/auth/api'; // Import base URL
import MBTIResult from "./MBTIResult"; // Import MBTIResult component

interface Question {
  id: string;
  text: string;
  options: { key: string; text: string }[]; // Assuming options are structured like this
}

interface MBTIQuizProps {
  token: string;
}

const API_URL = `${WP_BASE_URL}/wp-json/mbti/v1`; // Dòng này đã cấu hình đúng

export default function MBTIQuiz({ token }: MBTIQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState<"quiz" | "result">("quiz"); // "quiz" | "result"
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách câu hỏi từ backend
  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/questions`); // Gọi API với URL đã cấu hình
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Failed to fetch questions: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setQuestions(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch questions.');
        }
      } catch (err: any) {
        console.error("Error fetching MBTI questions:", err);
        setError(err.message || 'Không thể tải câu hỏi MBTI. Vui lòng kiểm tra kết nối hoặc cấu hình API.');
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  // ... (phần còn lại của component)
}