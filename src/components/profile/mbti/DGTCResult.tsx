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
import { WP_BASE_URL } from '@/lib/auth/api';
import { personalityData } from '@/data/personalityData';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface DGTCResultData { // Đổi tên interface
  result: string;
  scores: { [key: string]: number };
  clarity: { [key: string]: string };
  percent: { [key: string]: string };
  answers: { [key: string]: string };
}

interface DGTCResultProps { // Đổi tên interface
  token: string;
  onRetake: () => void;
}

const API_URL = `${WP_BASE_URL}/wp-json/mbti/v1`; // Giữ nguyên endpoint API nhưng đổi tên biến

const DGTCResult: React.FC<DGTCResultProps> = ({ token, onRetake }) => { // Đổi tên component
  const [result, setResult] = useState<DGTCResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dgtcDescription, setDgtcDescription] = useState<string | null>(null); // Đổi tên biến

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
          throw new Error(errorData.message || `Lỗi khi tải kết quả ĐGTC: ${res.status}`); // Đổi tên log
        }
        const data: DGTCResultData = await res.json();
        
        setResult(data);

        // Lấy mô tả từ personalityData
        if (data.result && personalityData[data.result as keyof typeof personalityData]) {
          setDgtcDescription(personalityData[data.result as keyof typeof personalityData].description); // Đổi tên biến
        } else {
          setDgtcDescription('Không tìm thấy mô tả cho loại tính cách này.'); // Đổi tên biến
        }

      } catch (err: any) {
        console.error("Error fetching ĐGTC result:", err); // Đổi tên log
        setError(err.message || 'Không thể tải kết quả ĐGTC.');
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

  // Dữ liệu cho biểu đồ radar
  const radarData = {
    labels: ['E', 'S', 'T', 'J', 'I', 'N', 'F', 'P'],
    datasets: [
      {
        label: 'Điểm số',
        data: [
          result.scores.E || 0,
          result.scores.S || 0,
          result.scores.T || 0,
          result.scores.J || 0,
          result.scores.I || 0,
          result.scores.N || 0,
          result.scores.F || 0,
          result.scores.P || 0,
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
        max: 10, // Điểm số từ 0-10
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
          label: (context: any) => `${context.label}: ${context.raw}`,
        },
      },
    },
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-green-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold mb-4 ${getTypeColor(result.result)}`}>
            {result.result}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Kết Quả ĐGTC Của Bạn
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">{dgtcDescription}</p>
        </div>

        {/* Detailed Results and Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="rounded-xl p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Phân tích chi tiết
              </CardTitle>
              <CardDescription>
                Điểm số và độ rõ ràng của bạn trên các khía cạnh tính cách ĐGTC.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3">
                {Object.entries(result.percent).map(([key, percentage]: [string, any]) => {
                  const [type1, type2] = key.split('');
                  const [val1, val2] = percentage.split(' - ').map((s: string) => parseFloat(s.replace('%', '')));
                  const tendency = result.clarity[key];

                  return (
                    <div key={key} className="space-y-2">
                      <h4 className="font-medium text-gray-700">{type1} - {type2}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span>{type1} ({val1}%)</span>
                        <Progress value={val1} className="w-24 h-2 mx-2" />
                        <span>{type2} ({val2}%)</span>
                      </div>
                      <p className="text-xs text-blue-700 font-medium mt-1">
                        Độ rõ ràng: {tendency}
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

export default DGTCResult;