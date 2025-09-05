import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InterestsSection from './InterestsSection';
import OutstandingCompetenciesCard from './OutstandingCompetenciesCard';
import ActionCompassCard from './ActionCompassCard';
import HoverViewMore from '@/components/HoverViewMore';
import DashboardDetailModal from './DashboardDetailModal';
import { personalityData } from '@/data/personalityData';
import { hollandCodeData } from '@/data/hollandCodeData';
import { competencyData } from '@/data/competencyData';
import { eqData } from '@/data/eqData';
import { valuesData } from '@/data/valuesData'; // Import valuesData
import { getCognitiveTitle, getEqTitle } from '@/utils/dataMapping';
import CareerSection from './CareerSection';
import { cn } from '@/lib/utils'; // Import cn utility
import { FileText, UserSquare, Compass, Lightbulb, Target, HeartHandshake } from 'lucide-react'; // Import new icons

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const DynamicEqChart = ({ scores }: { scores: { [key: string]: number } | undefined }) => {
    const data = {
        labels: ['Thấu cảm', 'Kỹ năng Xã hội', 'Tự nhận thức', 'Tự điều chỉnh', 'Động lực'],
        datasets: [{
            label: 'Điểm số',
            data: [
                scores?.['Thấu cảm'] || 0,
                scores?.['Kỹ năng xã hội'] || 0,
                scores?.['Tự nhận thức'] || 0,
                scores?.['Tự điều chỉnh'] || 0,
                scores?.['Động lực'] || 0,
            ],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2
        }]
    };
    const options = { responsive: true, maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 100 } }, plugins: { legend: { position: 'top' as const } } };
    return <Radar data={data} options={options} />;
};

// Helper functions to generate modal content
const getWelcomeModalDetails = (username: string) => ({
  title: 'Hồ sơ Hướng nghiệp của bạn',
  description: `Chào mừng trở lại, ${username}! Đây là phân tích tổng quan về tính cách, sở thích, năng lực và giá trị nghề nghiệp của bạn, giúp bạn định hướng con đường sự nghiệp phù hợp nhất.`,
  content: null,
});

const getPersonalityModalDetails = (personalityType: string | null) => {
  if (!personalityType || !personalityData[personalityType as keyof typeof personalityData]) {
    return {
      title: 'Loại tính cách',
      description: 'Chưa có kết quả ĐGTC hoặc không tìm thấy mô tả.',
      content: null,
    };
  }
  const pData = personalityData[personalityType as keyof typeof personalityData];
  return {
    title: `Loại tính cách: ${pData.title} (${personalityType})`,
    description: pData.description,
    content: null,
  };
};

const getHollandModalDetails = (hollandScores: { [key: string]: number } | undefined) => {
  if (!hollandScores || Object.keys(hollandScores).length === 0) {
    return {
      title: 'Mã Holland',
      description: 'Chưa có kết quả Holland.',
      content: null,
    };
  }
  const topHollandCodes = Object.entries(hollandScores)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([code]) => code as keyof typeof hollandCodeData);

  const title = `Mã Holland: ${topHollandCodes.map(code => hollandCodeData[code].name).join(' - ')}`;
  const description = (
    <div className="space-y-2">
      {topHollandCodes.map(code => {
        const hData = hollandCodeData[code];
        return (
          <p key={code} className="text-sm text-gray-700">
            <strong>{code} - {hData.name} ({hData.title}):</strong> {hData.description}
          </p>
        );
      })}
    </div>
  );
  return { title, description, content: null };
};

const getCompetenciesModalDetails = (cognitiveScores: { [key: string]: number } | undefined) => {
  if (!cognitiveScores || Object.keys(cognitiveScores).length === 0) {
    return {
      title: 'Năng lực Nổi trội',
      description: 'Chưa có dữ liệu năng lực nhận thức.',
      content: null,
    };
  }
  return {
    title: 'Năng lực Nổi trội',
    description: (
      <div className="space-y-3">
        {Object.entries(cognitiveScores).map(([key, value]) => (
          <p key={key} className="text-sm text-gray-700">
            <strong>{getCognitiveTitle(key, competencyData)}:</strong> {value || 0}
          </p>
        ))}
      </div>
    ),
    content: null,
  };
};

const getActionCompassModalDetails = (mainValueKey: string | null) => {
  if (!mainValueKey || !valuesData[mainValueKey as keyof typeof valuesData]) {
    return {
      title: 'Kim Chỉ Nam Hành Động',
      description: 'Chưa có dữ liệu giá trị nghề nghiệp.',
      content: null,
    };
  }
  const vData = valuesData[mainValueKey as keyof typeof valuesData];
  return {
    title: `Kim Chỉ Nam Hành Động: ${vData.name}`,
    description: vData.description,
    content: (
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Vai trò trong việc ra quyết định:</strong> {vData.role}</p>
        <p><strong>Câu hỏi Tự vấn:</strong></p>
        <ul className="list-disc list-inside">
          {vData.questions.map((q, i) => <li key={i}>{q}</li>)}
        </ul>
      </div>
    ),
  };
};

const getEqProfileModalDetails = (eqScores: { [key: string]: number } | undefined, eqLevels: { [key: string]: string } | undefined) => {
  if (!eqScores || Object.keys(eqScores).length === 0) {
    return {
      title: 'Hồ sơ Trí tuệ Cảm xúc',
      description: 'Chưa có dữ liệu trí tuệ cảm xúc.',
      content: null,
    };
  }
  return {
    title: 'Hồ sơ Trí tuệ Cảm xúc',
    description: 'Phân tích chi tiết về các khía cạnh của trí tuệ cảm xúc của bạn.',
    content: (
      <div className="space-y-3">
        {Object.entries(eqScores).map(([key, value]) => (
          <p key={key} className="text-sm text-gray-700">
            <strong>{getEqTitle(key, eqData)}:</strong> {value || 0} - <span className="font-medium">{eqLevels?.[key] || 'N/A'}</span>
          </p>
        ))}
      </div>
    ),
    content: null,
  };
};

interface DashboardViewProps {
  username: string;
}

const DashboardView = ({ username }: DashboardViewProps) => {
  const navigate = useNavigate();
  const { naviuResult, isLoadingResult } = useAuth();

  const [isWelcomeHovered, setIsWelcomeHovered] = useState(false);
  const [isPersonalityHovered, setIsPersonalityHovered] = useState(false);
  const [isHollandHovered, setIsHollandHovered] = useState(false);
  const [isEqHovered, setIsEqHovered] = useState(false);
  const [isActionCompassHovered, setIsActionCompassHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; description: React.ReactNode; content?: React.ReactNode } | null>(null);

  const handleCardClick = (cardType: string) => {
    let details;
    switch (cardType) {
      case 'welcome':
        details = getWelcomeModalDetails(username);
        break;
      case 'personality':
        details = getPersonalityModalDetails(naviuResult?.mbti?.result || null);
        break;
      case 'holland':
        details = getHollandModalDetails(naviuResult?.holland);
        break;
      case 'competencies':
        details = getCompetenciesModalDetails(naviuResult?.cognitive);
        break;
      case 'action-compass':
        const topValueKey = naviuResult?.values && Object.keys(naviuResult.values).length > 0
          ? Object.entries(naviuResult.values)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([key]) => key)[0]
          : null;
        details = getActionCompassModalDetails(topValueKey); 
        break;
      case 'eq-profile':
        details = getEqProfileModalDetails(naviuResult?.eq?.scores, naviuResult?.eq?.levels);
        break;
      default:
        details = { title: 'Thông tin chi tiết', description: 'Không có thông tin chi tiết cho mục này.', content: null };
        break;
    }
    setModalContent(details);
    setIsModalOpen(true);
  };

  const DashboardSkeleton = () => (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-48 lg:col-span-2 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
        <Skeleton className="h-full min-h-[400px] rounded-2xl" />
      </div>
    </div>
  );

  if (isLoadingResult) {
    return <DashboardSkeleton />;
  }

  const hasNaviuResult = !!naviuResult;
  const hasMbtiResult = !!naviuResult?.mbti?.result;
  const hasHollandResult = !!naviuResult?.holland && Object.keys(naviuResult.holland).length > 0;
  const hasCognitiveResult = !!naviuResult?.cognitive && Object.keys(naviuResult.cognitive).length > 0;
  const hasEqResult = !!naviuResult?.eq?.scores && Object.keys(naviuResult.eq.scores).length > 0;
  const hasValuesResult = !!naviuResult?.values && Object.keys(naviuResult.values).length > 0;

  const topHollandCodes = hasHollandResult
    ? Object.entries(naviuResult!.holland!)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
    : [];

  const topValueKey = hasValuesResult
    ? Object.entries(naviuResult!.values!)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([key]) => key)[0] as keyof typeof valuesData
    : null;

  const actionCompassValueData = topValueKey ? valuesData[topValueKey] : undefined;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className={cn(
              "group relative bg-blue-600 text-white rounded-2xl shadow-sm p-6 lg:col-span-2 cursor-pointer",
            )}
            onMouseEnter={() => setIsWelcomeHovered(true)}
            onMouseLeave={() => setIsWelcomeHovered(false)}
            onClick={() => navigate('/profile/report')}
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-6 w-6 text-white" />
              <h3 className="text-lg font-semibold opacity-80">Chào mừng trở lại!</h3> {/* Removed username */}
            </div>
            <p className="text-4xl font-bold mt-2">Hồ sơ Hướng nghiệp</p>
            <p className="opacity-80 mt-1">Đây là phân tích tổng quan về tiềm năng của bạn.</p>
            <HoverViewMore isVisible={isWelcomeHovered} className="text-white" />
          </div>
          <div
            className={cn(
              "group relative bg-white text-gray-800 rounded-2xl shadow-sm p-6 cursor-pointer border border-gray-200",
            )}
            onMouseEnter={() => setIsPersonalityHovered(true)}
            onMouseLeave={() => setIsPersonalityHovered(false)}
            onClick={() => handleCardClick('personality')}
          >
            <div className="flex items-center gap-3 mb-2">
              <UserSquare className="h-6 w-6 text-blue-600" />
              <h3 className="text-gray-500">Loại tính cách</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">{naviuResult?.mbti?.result || 'N/A'}</p>
            <p className="text-sm text-gray-700 mt-1">
            {hasMbtiResult ? personalityData[naviuResult!.mbti!.result as keyof typeof personalityData]?.title : 'Chưa có dữ liệu'}
            </p>
            <HoverViewMore isVisible={isPersonalityHovered} className="text-gray-800" />
          </div>
          <div
            className={cn(
              "group relative bg-white text-gray-800 rounded-2xl shadow-sm p-6 cursor-pointer border border-gray-200",
            )}
            onMouseEnter={() => setIsHollandHovered(true)}
            onMouseLeave={() => setIsHollandHovered(false)}
            onClick={() => handleCardClick('holland')}
          >
            <div className="flex items-center gap-3 mb-2">
              <Compass className="h-6 w-6 text-blue-600" />
              <h3 className="text-gray-500">Mã Holland</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {topHollandCodes.map(([code]) => code).join('') || 'N/A'}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {hasHollandResult ? topHollandCodes.map(([code]) => hollandCodeData[code as keyof typeof hollandCodeData].name).join(' - ') : 'Chưa có dữ liệu'}
            </p>
            <HoverViewMore isVisible={isHollandHovered} className="text-gray-800" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <OutstandingCompetenciesCard 
              onClick={() => handleCardClick('competencies')}
              competencies={naviuResult?.cognitive} 
              isFaded={!hasCognitiveResult}
              icon={Lightbulb}
            />
            <ActionCompassCard 
              onClick={() => handleCardClick('action-compass')}
              valueData={actionCompassValueData}
              isFaded={!hasValuesResult}
              icon={Target}
            />
          </div>
          <div
            className={cn(
              "group relative bg-white text-gray-800 rounded-2xl shadow-sm p-6 flex flex-col min-h-[400px] cursor-pointer border border-gray-200",
            )}
            onMouseEnter={() => setIsEqHovered(true)}
            onMouseLeave={() => setIsEqHovered(false)}
            onClick={() => handleCardClick('eq-profile')}
          >
            <div className="flex items-center gap-3 mb-2">
              <HeartHandshake className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-gray-800 flex-shrink-0">Hồ sơ Trí tuệ Cảm xúc</h3>
            </div>
            <div className="relative flex-1 mt-4">
              {hasEqResult ? (
                <DynamicEqChart scores={naviuResult!.eq!.scores} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center space-y-3">
                  <p>Chưa có dữ liệu EQ.</p>
                  <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')} size="sm" className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Làm Bài Test Toàn Diện NaviU</Button>
                </div>
              )}
            </div>
            <HoverViewMore isVisible={isEqHovered} className="text-gray-800" />
          </div>
        </div>
        
        <InterestsSection onCardClick={handleCardClick} hollandScores={naviuResult?.holland} />

        <CareerSection naviuResult={naviuResult} isLoadingResult={isLoadingResult} /> {/* Pass props here */}

        {modalContent && (
          <DashboardDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={modalContent.title}
            description={modalContent.description}
            content={modalContent.content}
          />
        )}
      </div>
    </>
  );
};

export default DashboardView;