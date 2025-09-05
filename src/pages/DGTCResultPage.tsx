import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { showError, showSuccess } from '@/utils/toast'; // Import showSuccess
import { DGTCResultData } from '@/types'; // Import DGTCResultData
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
import { personalityData } from '@/data/personalityData';
import { Progress } from '@/components/ui/progress'; // Import Progress
import { Download } from 'lucide-react'; // Import Download icon
import html2canvas from 'html22canvas'; // Import html2canvas
import jsPDF from 'jspdf'; // Import jspdf

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const DGTCResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<DGTCResultData | null>(null);
  const [dgtcDescription, setDgtcDescription] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null); // Ref for the content to be exported

  useEffect(() => {
    if (location.state && location.state.resultData) {
      const resultData = location.state.resultData as DGTCResultData;
      setResult(resultData);
      if (resultData.result && personalityData[resultData.result as keyof typeof personalityData]) {
        setDgtcDescription(personalityData[resultData.result as keyof typeof personalityData].description);
      } else {
        setDgtcDescription('Không tìm thấy mô tả cho loại tính cách này.');
      }
    } else {
      showError("Không tìm thấy dữ liệu kết quả bài test ĐGTC.");
      navigate('/profile/do-test/dgtc', { replace: true }); // Quay về trang làm bài test nếu không có dữ liệu
    }
  }, [location.state, navigate]);

  const handleRetake = () => {
    navigate('/profile/do-test/dgtc', { replace: true }); // Quay về trang làm bài test ĐGTC
  };

  const handleExportPdf = async () => {
    if (resultRef.current) {
      showSuccess("Đang tạo PDF báo cáo...");
      const canvas = await html2canvas(resultRef.current, { scale: 2 }); // Tăng scale để chất lượng tốt hơn
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
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
      pdf.save(`BaoCaoDGTC_${result?.result || 'KetQua'}.pdf`);
      showSuccess("Đã tải xuống PDF báo cáo thành công!");
    } else {
      showError("Không thể tạo PDF. Vui lòng thử lại.");
    }
  };

  if (!result) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
    labels: ['E', 'S', 'T', 'J', 'I', 'N', 'F', 'P'],
    datasets: [
      {
        label: 'Điểm số',
        data: [
          result.scores?.E || 0,
          result.scores?.S || 0,
          result.scores?.T || 0,
          result.scores?.J || 0,
          result.scores?.I || 0,
          result.scores?.N || 0,
          result.scores?.F || 0,
          result.scores?.P || 0,
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
        max: 10,
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
      <div ref={resultRef} className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg"> {/* Added ref and styling for PDF export */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold mb-4 ${getTypeColor(result.result)}`}>
            {result.result}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Kết Quả ĐGTC Của Bạn
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">{dgtcDescription}</p>
        </div>

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
                {result.percent && Object.entries(result.percent).map(([key, percentage]: [string, any]) => {
                  const [type1, type2] = key.split('');
                  const [val1, val2] = percentage.split(' - ').map((s: string) => parseFloat(s.replace('%', '')));
                  const tendency = result.clarity?.[key];

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
      </div> {/* End of resultRef div */}

      <div className="text-center pt-8 space-x-4">
        <Button
          onClick={handleRetake}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Làm lại test
        </Button>
        <Button onClick={handleExportPdf} size="lg" className="bg-green-600 text-white hover:bg-green-700 rounded-lg">
          <Download className="mr-2 h-5 w-5" /> Tải PDF
        </Button>
      </div>
    </div>
  );
};

export default DGTCResultPage;