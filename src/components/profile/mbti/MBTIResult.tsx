import React, { useEffect, useState } from 'react';
import { Clock, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { WP_BASE_URL } from '@/lib/auth/api'; // Import base URL

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface MBTIResultData {
  mbti_type: string;
  description: string;
  completion_rate: number;
  time_taken: number;
  answered_questions: number;
  total_questions: number;
  details: {
    extraversion_introversion: { tendency: string; Introversion: string; Extraversion: string; };
    sensing_intuition: { tendency: string; Intuition: string; Sensing: string; };
    thinking_feeling: { tendency: string; Feeling: string; Thinking: string; };
    judging_perceiving: { tendency: string; Perceiving: string; Judging: string; };
  };
}

interface MBTIResultProps {
  token: string;
  onRetake: () => void;
}

const API_URL = `${WP_BASE_URL}/wp-json/mbti/v1`;

const MBTIResult: React.FC<MBTIResultProps> = ({ token, onRetake }) => {
  const [result, setResult] = useState<MBTIResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResult() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/result`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Failed to fetch MBTI result: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setResult(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch MBTI result.');
        }
      } catch (err: any) {
        console.error("Error fetching MBTI result:", err);
        setError(err.message || 'Không thể tải kết quả MBTI.');
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [token]);

  if (loading) {
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
          <Button onClick={onRetake} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Thử lại
          </Button>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center p-4">
        <Card className="rounded-xl p-8 max-w-md w-full text-center">
          <CardTitle className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy kết quả</CardTitle>
          <p className="text-gray-600 mb-6">Vui lòng làm bài test để xem kết quả của bạn.</p>
          <Button onClick={onRetake} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Làm bài test
          </Button>
        </Card>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'INTJ': 'bg-purple-600', 'INTP': 'bg-blue-600', 'ENTJ': 'bg-red-600', 'ENTP': 'bg-orange-600',
      'INFJ': 'bg-green-600', 'INFP': 'bg-teal-600', 'ENFJ': 'bg-pink-600', 'ENFP': 'bg-yellow-600',
      'ISTJ': 'bg-gray-700', 'ISFJ': 'bg-indigo-600', 'ESTJ': 'bg-red-700', 'ESFJ': 'bg-pink-700',
      'ISTP': 'bg-gray-600', 'ISFP': 'bg-green-500', 'ESTP': 'bg-orange-700', 'ESFP': 'bg-yellow-700'
    };
    return colors[type] || 'bg-gray-500';
  };

  const radarData = {
    labels: ['Hướng ngoại (E)', 'Cảm giác (S)', 'Lý trí (T)', 'Phán đoán (J)', 'Hướng nội (I)', 'Trực giác (N)', 'Cảm xúc (F)', 'Linh hoạt (P)'],
    datasets: [
      {
        label: 'Điểm số',
        data: [
          parseFloat(result.details.extraversion_introversion.Extraversion),
          parseFloat(result.details.sensing_intuition.Sensing),
          parseFloat(result.details.thinking_feeling.Thinking),
          parseFloat(result.details.judging_perceiving.Judging),
          parseFloat(result.details.extraversion_introversion.Introversion),
          parseFloat(result.details.sensing_intuition.Intuition),
          parseFloat(result.details.thinking_feeling.Feeling),
          parseFloat(result.details.judging_perceiving.Perceiving),
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: {
            size: 12
          },
          color: '#333'
        },
        ticks: {
          display: false,
          maxTicksLimit: 5
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-green-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold mb-4 ${getTypeColor(result.mbti_type)}`}>
            {result.mbti_type}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Kết Quả MBTI Của Bạn
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">{result.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-xl p-6 text-center">
            <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {result.completion_rate}%
            </div>
            <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
          </Card>
          
          <Card className="rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {Math.floor(result.time_taken / 60)}:{(result.time_taken % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600">Thời gian làm bài</div>
          </Card>
          
          <Card className="rounded-xl p-6 text-center">
            <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {result.answered_questions}/{result.total_questions}
            </div>
            <div className="text-sm text-gray-600">Câu đã trả lời</div>
          </Card>
        </div>

        {/* Detailed Results and Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="rounded-xl p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Phân tích chi tiết
              </CardTitle>
              <CardDescription>
                Điểm số của bạn trên các khía cạnh tính cách MBTI.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3">
                {Object.entries(result.details).map(([key, detail]: [string, any]) => {
                  const titles: { [key: string]: string } = {
                    'extraversion_introversion': 'Hướng ngoại - Hướng nội',
                    'sensing_intuition': 'Cảm giác - Trực giác', 
                    'thinking_feeling': 'Lý trí - Cảm xúc',
                    'judging_perceiving': 'Phán đoán - Linh hoạt'
                  };

                  return (
                    <div key={key} className="space-y-2">
                      <h4 className="font-medium text-gray-700">{titles[key]}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span>{Object.keys(detail)[1]}</span>
                        <Progress value={parseFloat(Object.values(detail)[1] as string)} className="w-24 h-2 mx-2" />
                        <span>{Object.values(detail)[1]}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{Object.keys(detail)[2]}</span>
                        <Progress value={parseFloat(Object.values(detail)[2] as string)} className="w-24 h-2 mx-2" />
                        <span>{Object.values(detail)[2]}</span>
                      </div>
                      <p className="text-xs text-blue-700 font-medium mt-1">
                        Xu hướng: {detail.tendency}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl p-6 flex flex-col items-center justify-center">
            <CardTitle className="text-lg font-semibold text-gray-800 mb-4">
              Biểu đồ Tổng quan
            </CardTitle>
            <div className="relative w-full h-80">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="text-center">
          <Button
            onClick={onRetake}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Làm lại test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MBTIResult;