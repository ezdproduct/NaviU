import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { showError, showSuccess } from '@/utils/toast';
import { NaviuResultData, NaviuHistoryItem } from '@/types'; // Import NaviuHistoryItem
import { personalityData } from '@/data/personalityData';
import { hollandCodeData } from '@/data/hollandCodeData';
import { competencyData } from '@/data/competencyData';
import { eqData } from '@/data/eqData';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { BrainCircuit, Compass, HeartHandshake, Sparkles, Briefcase, Download } from 'lucide-react';
import { getCognitiveTitle, getEqTitle } from '@/utils/dataMapping';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WP_BASE_URL } from '@/lib/auth/api'; // Import WP_BASE_URL
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const API_URL_NAVIU = `${WP_BASE_URL}/wp-json/naviu/v1`; // Define API URL for NaviU

const NaviuResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user for token
  const token = user ? localStorage.getItem('jwt_token') : null;

  const [result, setResult] = useState<NaviuResultData | null>(null);
  const [loadingResult, setLoadingResult] = useState(true); // New loading state
  const resultRef = useRef<HTMLDivElement>(null);

  const generateMockNaviuResult = (): NaviuResultData => ({
    result: { major_group_name: 'Chưa xác định', major_group_code: 'N/A' },
    mbti: {
      result: 'N/A',
      scores: { E: 0, S: 0, T: 0, J: 0, I: 0, N: 0, F: 0, P: 0 },
      clarity: { 'EI': 'Không rõ ràng', 'SN': 'Không rõ ràng', 'TF': 'Không rõ ràng', 'JP': 'Không rõ ràng' },
      percent: { 'EI': '0% - 0%', 'SN': '0% - 0%', 'TF': '0% - 0%', 'JP': '0% - 0%' },
    },
    eq: {
      scores: { 'Tự nhận thức': 0, 'Tự điều chỉnh': 0, 'Động lực': 0, 'Thấu cảm': 0, 'Kỹ năng xã hội': 0 },
      levels: { 'Tự nhận thức': 'Thấp', 'Tự điều chỉnh': 'Thấp', 'Động lực': 'Thấp', 'Thấu cảm': 'Thấp', 'Kỹ năng xã hội': 'Thấp' },
    },
    cognitive: { Logic: 0, Ngôn_ngữ: 0, Không_gian: 0 },
    holland: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
    values: { 'can_bang': 0, 'moi_truong': 0, 'giup_do': 0, 'on_dinh': 0, 'phat_trien': 0, 'thu_nhap': 0, 'thang_tien': 0, 'cong_nhan': 0, 'tu_chu': 0, 'sang_tao': 0, 'thu_thach': 0, 'anh_huong': 0 },
  });

  useEffect(() => {
    const fetchOrSetResult = async () => {
      setLoadingResult(true);
      if (location.state && location.state.resultData) {
        // Case 1: Result data is directly provided (e.g., from history page or test submission)
        const resultData = location.state.resultData as NaviuResultData;
        setResult(resultData);
      } else if (location.state && location.state.testType === 'naviu-mbti') {
        // Case 2: User clicked "Xem báo cáo" from TestHub, no direct result data
        if (!token) {
          showError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem báo cáo.");
          navigate('/login', { replace: true });
          setLoadingResult(false);
          return;
        }
        try {
          const res = await fetch(`${API_URL_NAVIU}/history`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (!res.ok) {
            throw new Error(`Lỗi khi tải lịch sử NaviU: ${res.status}`);
          }
          const historyData: NaviuHistoryItem[] = await res.json(); // Correct type
          if (historyData && historyData.length > 0) {
            const latestHistoryItem = historyData.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())[0];
            if (latestHistoryItem.details) {
                setResult(latestHistoryItem.details);
            } else {
                // If history item exists but no full details, generate mock
                setResult(generateMockNaviuResult());
                showError("Không có chi tiết báo cáo NaviU. Đang hiển thị báo cáo mẫu.");
            }
          } else {
            // No history found, generate mock result
            setResult(generateMockNaviuResult());
            showError("Bạn chưa có kết quả NaviU. Đang hiển thị báo cáo mẫu.");
          }
        } catch (err: any) {
          console.error("Error fetching NaviU history for report:", err);
          showError(err.message || 'Không thể tải báo cáo NaviU. Đang hiển thị báo cáo mẫu.');
          setResult(generateMockNaviuResult());
        }
      } else {
        // Fallback if no relevant state is found
        showError("Không tìm thấy dữ liệu kết quả bài test NaviU.");
        navigate('/profile/do-test/naviu-mbti', { replace: true });
      }
      setLoadingResult(false);
    };

    fetchOrSetResult();
  }, [location.state, navigate, token]);

  const handleRetake = () => {
    navigate('/profile/test/naviu-mbti/do-test', { replace: true });
  };

  const handleExportPdf = async () => {
    if (resultRef.current) {
      showSuccess("Đang tạo PDF báo cáo...");
      const canvas = await html2canvas(resultRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`BaoCaoNaviU_${result?.result?.major_group_code || 'KetQua'}.pdf`);
      showSuccess("Đã tải xuống PDF báo cáo thành công!");
    } else {
      showError("Không thể tạo PDF. Vui lòng thử lại.");
    }
  };

  const getTopHollandCodes = (hollandScores: any) => {
    if (!hollandScores || typeof hollandScores !== 'object' || Object.keys(hollandScores).length === 0) return [];
    return Object.entries(hollandScores)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([code]) => code);
  };

  if (loadingResult) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-red-50 flex items-center justify-center p-4">
        <Card className="rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <CardTitle className="text-xl font-semibold text-gray-800 mb-2">Không có dữ liệu báo cáo</CardTitle>
          <p className="text-gray-600 mb-6">Đã xảy ra lỗi khi tải báo cáo hoặc không tìm thấy dữ liệu.</p>
          <Button onClick={() => navigate('/profile/do-test')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Quay lại Test Hub
          </Button>
        </Card>
      </div>
    );
  }

  const hasMbtiResult = !!result.mbti?.result && personalityData[result.mbti.result as keyof typeof personalityData];
  const hasHollandResult = !!result.holland && Object.keys(result.holland).length > 0;
  const hasCognitiveResult = !!result.cognitive && Object.keys(result.cognitive).length > 0;
  const hasEqResult = !!result.eq?.scores && Object.keys(result.eq.scores).length > 0;

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
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
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

  const getCognitiveSummary = () => {
    if (!result.cognitive || Object.keys(result.cognitive).length === 0) return 'N/A';
    const topCognitive = Object.entries(result.cognitive)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .find(([key]) => key in competencyData);
    
    if (topCognitive) {
      const mappedKey = topCognitive[0] as keyof typeof competencyData;
      return `${competencyData[mappedKey]?.title || topCognitive[0]}: ${topCognitive[1] || 0}`;
    }
    return 'Có dữ liệu';
  };

  const getEqSummary = () => {
    if (!result.eq?.scores || Object.keys(result.eq.scores).length === 0) return 'N/A';
    const topEq = Object.entries(result.eq.scores)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .find(([key]) => key in eqData);

    if (topEq) {
      const mappedKey = topEq[0] as keyof typeof eqData;
      return `${eqData[mappedKey]?.title || topEq[0]}: ${result.eq.levels?.[topEq[0]] || 'N/A'}`;
    }
    return 'Có dữ liệu';
  };

  const NoDataCard = ({ title, description, testLink }: { title: string; description: string; testLink: string }) => (
    <Card className="bg-gray-50 border-dashed border-gray-300 text-center p-6 flex flex-col items-center justify-center rounded-xl">
      <CardTitle className="text-xl font-bold text-gray-700 mb-2">{title}</CardTitle>
      <CardDescription className="text-gray-500 mb-4">{description}</CardDescription>
      <Button variant="outline" onClick={() => navigate(testLink)} className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Làm bài test</Button>
    </Card>
  );

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gray-50 p-4 sm:p-8">
      <div ref={resultRef} className="max-w-5xl mx-auto space-y-8 bg-white p-6 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold mb-4 bg-blue-600`}>
            {result.result?.major_group_code || 'N/A'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Báo cáo Toàn diện NaviU
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Kết quả cho nhóm ngành: <span className="font-semibold text-blue-600">{result.result?.major_group_name || 'Chưa xác định'}</span>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-xl"><CardHeader><CardTitle className="flex items-center gap-2"><BrainCircuit className="text-purple-500"/>MBTI</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{result.mbti?.result || 'N/A'}</p></CardContent></Card>
          <Card className="rounded-xl"><CardHeader><CardTitle className="flex items-center gap-2"><Compass className="text-orange-500"/>Holland</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{topHollandCodes.join('') || 'N/A'}</p></CardContent></Card>
          <Card className="rounded-xl"><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="text-blue-500"/>Năng lực</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{getCognitiveSummary()}</p></CardContent></Card>
          <Card className="rounded-xl"><CardHeader><CardTitle className="flex items-center gap-2"><HeartHandshake className="text-green-500"/>EQ</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{getEqSummary()}</p></CardContent></Card>
        </div>

        {/* MBTI Details */}
        {hasMbtiResult ? (
          <Card className="rounded-xl">
            <CardHeader><CardTitle>Phân tích Tính cách (MBTI): {result.mbti?.result}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-gray-700">{personalityData[result.mbti!.result as keyof typeof personalityData].description}</p>
                <div className="space-y-3 pt-4">
                  {result.mbti?.percent && Object.entries(result.mbti.percent).map(([key, value]) => {
                    const [type1, type2] = key.split('');
                    const [val1] = (value as string).split(' - ').map(s => parseFloat(s.replace('%', '')));
                    return (
                      <div key={key}>
                        <div className="flex justify-between font-medium text-sm mb-1"><span>{type1}</span><span>{type2}</span></div>
                        <Progress value={val1 || 0} />
                        <p className="text-xs text-center text-gray-500 mt-1">Độ rõ ràng: {result.mbti?.clarity?.[key] || 'N/A'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="relative h-80"><Radar data={mbtiRadarData} options={radarOptions} /></div>
            </CardContent>
          </Card>
        ) : (
          <NoDataCard
            title="Chưa có kết quả MBTI"
            description="Hãy làm bài test MBTI để khám phá tính cách của bạn."
            testLink="/profile/test/naviu-mbti/do-test"
          />
        )}

        {/* Holland Details */}
        {hasHollandResult ? (
          <Card className="rounded-xl">
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
              </div>
            </CardContent>
          </Card>
        ) : (
          <NoDataCard
            title="Chưa có kết quả Holland"
            description="Hãy làm bài test Holland để xác định sở thích nghề nghiệp của bạn."
            testLink="/profile/test/naviu-mbti/do-test"
          />
        )}

        {/* Competency & EQ Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hasCognitiveResult ? (
            <Card className="rounded-xl">
              <CardHeader><CardTitle>Năng lực Nhận thức</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside">
                  {result.cognitive && Object.entries(result.cognitive).map(([key, value]) => (
                    <li key={key}><strong>{getCognitiveTitle(key, competencyData)}:</strong> {value || 0}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <NoDataCard
              title="Chưa có kết quả Năng lực Nhận thức"
              description="Hoàn thành bài test NaviU toàn diện để đánh giá năng lực của bạn."
              testLink="/profile/test/naviu-mbti/do-test"
            />
          )}

          {hasEqResult ? (
            <Card className="rounded-xl">
              <CardHeader><CardTitle>Trí tuệ Cảm xúc (EQ)</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside">
                  {result.eq?.scores && Object.entries(result.eq.scores).map(([key, value]) => (
                    <li key={key}><strong>{getEqTitle(key, eqData)}:</strong> {value || 0} - <span className="font-medium">{result.eq?.levels?.[key] || 'N/A'}</span></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <NoDataCard
              title="Chưa có kết quả EQ"
              description="Hoàn thành bài test NaviU toàn diện để đánh giá trí tuệ cảm xúc của bạn."
              testLink="/profile/test/naviu-mbti/do-test"
            />
          )}
        </div>
        
        {/* Career Suggestions */}
        <Card className="bg-blue-50 border-blue-200 rounded-xl">
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
      </div>

      {/* Actions */}
      <div className="text-center pt-8 space-x-4">
        <Button onClick={handleRetake} size="lg" className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Làm lại Test</Button>
        <Button onClick={() => navigate('/profile/history/naviu')} size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg">Xem Lịch sử</Button>
        <Button onClick={handleExportPdf} size="lg" className="bg-green-600 text-white hover:bg-green-700 rounded-lg">
          <Download className="mr-2 h-5 w-5" /> Tải PDF
        </Button>
      </div>
    </div>
  );
};

export default NaviuResultPage;