import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { showError } from '@/utils/toast';
import { NaviuResultData } from '@/components/profile/NaviUTestPage';
import { personalityData } from '@/data/personalityData';
import { hollandCodeData } from '@/data/hollandCodeData';
import { competencyData } from '@/data/competencyData';
import { eqData } from '@/data/eqData';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { BrainCircuit, Compass, HeartHandshake, Sparkles, Briefcase } from 'lucide-react'; // Đã thay đổi HeartHand thành HeartHandshake
import { getCognitiveTitle, getEqTitle } from '@/utils/dataMapping';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const NaviuResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<NaviuResultData | null>(null);

  useEffect(() => {
    if (location.state && location.state.resultData) {
      const resultData = location.state.resultData as NaviuResultData;
      console.log("📊 [DEBUG] Dữ liệu kết quả nhận được:", resultData);
      setResult(resultData);
    } else {
      showError("Không tìm thấy dữ liệu kết quả bài test NaviU.");
      navigate('/profile/do-test/naviu', { replace: true });
    }
  }, [location.state, navigate]);

  const handleRetake = () => {
    navigate('/profile/test/naviu/do-test', { replace: true });
  };

  const getTopHollandCodes = (hollandScores: any) => {
    if (!hollandScores || typeof hollandScores !== 'object') return [];
    return Object.entries(hollandScores)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([code]) => code);
  };

  if (!result) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const topHollandCodes = getTopHollandCodes(result.holland);
  const hollandRadarData = {
    labels: ['R', 'I', 'A', 'S', 'E', 'C'],
    datasets: [{
      label: 'Mức độ phù hợp',
      data: [
        result.holland?.R || 0,
        result.holland?.I || 0,
        result.holland?.A || 0,
        result.holland?.S || 0,
        result.holland?.E || 0,
        result.holland?.C || 0,
      ],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    }],
  };

  // MBTI Radar Data
  const mbtiRadarData = {
    labels: ['E', 'S', 'T', 'J', 'I', 'N', 'F', 'P'],
    datasets: [
      {
        label: 'Điểm số',
        data: [
          result.mbti?.scores?.E || 0,
          result.mbti?.scores?.S || 0,
          result.mbti?.scores?.T || 0,
          result.mbti?.scores?.J || 0,
          result.mbti?.scores?.I || 0,
          result.mbti?.scores?.N || 0,
          result.mbti?.scores?.F || 0,
          result.mbti?.scores?.P || 0,
        ],
        backgroundColor: 'rgba(139, 92, 246, 0.2)', // Purple shade
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(139, 92, 246, 1)'
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 10, // Assuming scores are 0-10
        angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        pointLabels: { font: { size: 12 }, color: '#333' },
        ticks: { display: false, maxTicksLimit: 5 }
      }
    },
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context: any) => `${context.label}: ${context.raw}` } } },
  };

  // Logic để hiển thị tóm tắt cho Cognitive và EQ trên Summary Cards
  const getCognitiveSummary = () => {
    if (!result.cognitive || Object.keys(result.cognitive).length === 0) return 'N/A';
    const topCognitive = Object.entries(result.cognitive)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .find(([key]) => key in competencyData); // Tìm key có ánh xạ
    
    if (topCognitive) {
      const mappedKey = topCognitive[0] as keyof typeof competencyData; // Cast to correct type
      return `${competencyData[mappedKey]?.title || topCognitive[0]}: ${topCognitive[1] || 0}`;
    }
    return 'Có dữ liệu';
  };

  const getEqSummary = () => {
    if (!result.eq?.scores || Object.keys(result.eq.scores).length === 0) return 'N/A';
    const topEq = Object.entries(result.eq.scores)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .find(([key]) => key in eqData); // Tìm key có ánh xạ

    if (topEq) {
      const mappedKey = topEq[0] as keyof typeof eqData; // Cast to correct type
      return `${eqData[mappedKey]?.title || topEq[0]}: ${result.eq.levels?.[topEq[0]] || 'N/A'}`;
    }
    return 'Có dữ liệu';
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Báo cáo Toàn diện NaviU</h1>
          <p className="text-xl text-gray-600 mt-2">
            Kết quả cho nhóm ngành: <span className="font-semibold text-blue-600">{result.result?.major_group_name || 'Chưa xác định'}</span>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><BrainCircuit className="text-purple-500"/>MBTI</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{result.mbti?.result || 'N/A'}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Compass className="text-orange-500"/>Holland</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{topHollandCodes.join('') || 'N/A'}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="text-blue-500"/>Năng lực</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{getCognitiveSummary()}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><HeartHandshake className="text-green-500"/>EQ</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{getEqSummary()}</p></CardContent></Card> {/* Đã thay đổi HeartHand thành HeartHandshake */}
        </div>

        {/* MBTI Details */}
        {result.mbti && personalityData[result.mbti.result as keyof typeof personalityData] && (
          <Card>
            <CardHeader><CardTitle>Phân tích Tính cách (MBTI): {result.mbti.result}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-gray-700">{personalityData[result.mbti.result as keyof typeof personalityData].description}</p>
                <div className="space-y-3 pt-4">
                  {result.mbti.percent && Object.entries(result.mbti.percent).map(([key, value]) => {
                    const [type1, type2] = key.split('');
                    const [val1] = (value as string).split(' - ').map(s => parseFloat(s.replace('%', '')));
                    return (
                      <div key={key}>
                        <div className="flex justify-between font-medium text-sm mb-1"><span>{type1}</span><span>{type2}</span></div>
                        <Progress value={val1 || 0} />
                        <p className="text-xs text-center text-gray-500 mt-1">Độ rõ ràng: {result.mbti.clarity?.[key] || 'N/A'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="relative h-80"><Radar data={mbtiRadarData} options={radarOptions} /></div>
            </CardContent>
          </Card>
        )}

        {/* Holland Details */}
        <Card>
          <CardHeader><CardTitle>Phân tích Sở thích Nghề nghiệp (Holland)</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative h-80"><Radar data={hollandRadarData} options={radarOptions} /></div>
            <div className="space-y-3">
              <h3 className="font-semibold">Top 3 nhóm sở thích của bạn:</h3>
              {topHollandCodes.map(code => (
                <div key={code}>
                  <p className="font-bold text-blue-600">{code} - {hollandCodeData[code as keyof typeof hollandCodeData].title}</p>
                  <p className="text-sm text-gray-600">{hollandCodeData[code as keyof typeof hollandCodeData].description}</p>
                </div>
              ))}
              {topHollandCodes.length === 0 && <p className="text-gray-600">Chưa có dữ liệu Holland.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Competency & EQ Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Năng lực Nhận thức</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside">
                {result.cognitive && Object.entries(result.cognitive).map(([key, value]) => (
                  <li key={key}><strong>{getCognitiveTitle(key, competencyData)}:</strong> {value || 0}</li>
                ))}
                {!result.cognitive && <p className="text-gray-600">Chưa có dữ liệu năng lực nhận thức.</p>}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Trí tuệ Cảm xúc (EQ)</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside">
                {result.eq?.scores && Object.entries(result.eq.scores).map(([key, value]) => (
                  <li key={key}><strong>{getEqTitle(key, eqData)}:</strong> {value || 0} - <span className="font-medium">{result.eq?.levels?.[key] || 'N/A'}</span></li>
                ))}
                {!result.eq && <p className="text-gray-600">Chưa có dữ liệu trí tuệ cảm xúc.</p>}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Career Suggestions */}
        <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800"><Briefcase/>Gợi ý Nghề nghiệp</CardTitle>
                <CardDescription>Dựa trên kết quả phân tích, đây là một số ngành nghề phù hợp với bạn:</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside font-medium text-gray-800 space-y-1">
                    <li>Chuyên viên Tư vấn Tâm lý</li>
                    <li>Nhà thiết kế UI/UX</li>
                    <li>Content Creator / Nhà báo</li>
                    <li>Chuyên viên Marketing</li>
                    <li>Giáo viên / Giảng viên</li>
                </ul>
            </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center pt-4 space-x-4">
          <Button onClick={handleRetake} size="lg">Làm lại Test</Button>
          <Button onClick={() => navigate('/profile/history/naviu')} size="lg" variant="outline">Xem Lịch sử</Button>
        </div>
      </div>
    </div>
  );
};

export default NaviuResultPage;