import React, { useState, useEffect } from 'react';
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

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

import HollandChart from '@/components/charts/HollandChart';
import InterestsSection from './InterestsSection';
import OutstandingCompetenciesCard from './OutstandingCompetenciesCard';
import ActionCompassCard from './ActionCompassCard';
import HoverViewMore from '@/components/HoverViewMore';
import DashboardDetailModal from './DashboardDetailModal';
import { personalityData } from '@/data/personalityData';
import { hollandCodeData } from '@/data/hollandCodeData';
import { competencyData } from '@/data/competencyData';
import { eqData } from '@/data/eqData';
import { valuesData } from '@/data/valuesData';
import CareerSection from './CareerSection';
import { WP_BASE_URL } from '@/lib/auth/api'; // Import base URL
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

interface DashboardViewProps {
  username: string;
}

const MBTI_API_URL = `${WP_BASE_URL}/wp-json/mbti/v1`;

const EqChart = () => {
    const data = {
        labels: ['Thấu cảm', 'Kỹ năng Xã hội', 'Tự nhận thức', 'Tự điều chỉnh', 'Động lực'],
        datasets: [{
            label: 'Điểm số',
            data: [95, 80, 85, 50, 30],
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
  description: `Chào mừng trở lại, ${username}! Đây là phân tích tổng quan về tiềm năng của bạn.`,
  content: (
    <p className="text-sm text-gray-700">
      Báo cáo này cung cấp cái nhìn sâu sắc về tính cách, sở thích, năng lực và giá trị nghề nghiệp của bạn, giúp bạn định hướng con đường sự nghiệp phù hợp nhất.
    </p>
  ),
});

const getPersonalityModalDetails = (personalityType: string) => {
  const pData = personalityData[personalityType as keyof typeof personalityData];
  return {
    title: `Loại tính cách: ${pData?.title || 'N/A'} (${personalityType})`,
    description: pData?.description || 'Không tìm thấy mô tả.',
    content: null,
  };
};

const getHollandModalDetails = (hollandCodes: Array<keyof typeof hollandCodeData>) => {
  const title = `Mã Holland: ${hollandCodes.map(code => hollandCodeData[code].name).join(' - ')}`;
  const description = (
    <div className="space-y-2">
      {hollandCodes.map(code => {
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

const getCompetenciesModalDetails = () => ({
  title: 'Năng lực Nổi trội',
  description: (
    <div className="space-y-3">
      <p className="text-sm text-gray-700">
        <strong>Tư duy Ngôn ngữ:</strong> {competencyData.language.cao}
      </p>
      <p className="text-sm text-gray-700">
        <strong>Tư duy Logic:</strong> {competencyData.logic.trung_binh}
      </p>
    </div>
  ),
  content: null,
});

const getActionCompassModalDetails = (mainValue: keyof typeof valuesData) => {
  const vData = valuesData[mainValue];
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

const getEqProfileModalDetails = () => ({
  title: 'Hồ sơ Trí tuệ Cảm xúc',
  description: 'Phân tích chi tiết về các khía cạnh của trí tuệ cảm xúc của bạn.',
  content: (
    <div className="space-y-3">
      {(Object.keys(eqData) as Array<keyof typeof eqData>).map(key => (
        <p key={key} className="text-sm text-gray-700">
          <strong>{eqData[key].title}:</strong> {eqData[key].cao || eqData[key].trung_binh || eqData[key].thap}
        </p>
      ))}
    </div>
  ),
});

const DashboardView = ({ username }: DashboardViewProps) => {
  const { isAuthenticated } = useAuth();
  const [isWelcomeHovered, setIsWelcomeHovered] = useState(false);
  const [isPersonalityHovered, setIsPersonalityHovered] = useState(false);
  const [isHollandHovered, setIsHollandHovered] = useState(false);
  const [isEqHovered, setIsEqHovered] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; description: React.ReactNode; content?: React.ReactNode } | null>(null);

  // State cho kết quả MBTI gần nhất
  const [latestMbtiResult, setLatestMbtiResult] = useState<{ type: string; description: string } | null>(null);
  const [isMbtiLoading, setIsMbtiLoading] = useState(true);
  const [mbtiError, setMbtiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestMbti = async () => {
      setIsMbtiLoading(true);
      setMbtiError(null);
      const token = localStorage.getItem('jwt_token');

      if (!isAuthenticated || !token) {
        setMbtiError('Chưa đăng nhập để xem kết quả MBTI.');
        setIsMbtiLoading(false);
        setLatestMbtiResult(null); // Clear previous result if logged out
        return;
      }

      try {
        const res = await fetch(`${MBTI_API_URL}/result`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Lỗi khi tải kết quả MBTI: ${res.status}`);
        }

        const data = await res.json();
        if (data && data.result) {
          const type = data.result;
          const description = personalityData[type as keyof typeof personalityData]?.description || 'Không tìm thấy mô tả.';
          setLatestMbtiResult({ type, description });
        } else {
          setMbtiError('Không có kết quả MBTI nào được tìm thấy.');
          setLatestMbtiResult(null);
        }
      } catch (err: any) {
        console.error("Error fetching latest MBTI result:", err);
        setMbtiError(err.message || 'Không thể tải kết quả MBTI gần nhất.');
        setLatestMbtiResult(null);
      } finally {
        setIsMbtiLoading(false);
      }
    };

    fetchLatestMbti();
  }, [isAuthenticated, username]); // Re-fetch if auth state or username changes

  const handleCardClick = (cardType: string) => {
    let details;
    switch (cardType) {
      case 'welcome':
        details = getWelcomeModalDetails(username);
        break;
      case 'personality':
        details = latestMbtiResult
          ? getPersonalityModalDetails(latestMbtiResult.type)
          : { title: 'Loại tính cách', description: mbtiError || 'Chưa có kết quả MBTI.', content: null };
        break;
      case 'holland':
        details = getHollandModalDetails(['A', 'I', 'S']); // Assuming AIS for now
        break;
      case 'competencies':
        details = getCompetenciesModalDetails();
        break;
      case 'action-compass':
        details = getActionCompassModalDetails('can_bang'); // Assuming 'Cân bằng Công việc - Cuộc sống'
        break;
      case 'eq-profile':
        details = getEqProfileModalDetails();
        break;
      default:
        details = { title: 'Thông tin chi tiết', description: 'Không có thông tin chi tiết cho mục này.', content: null };
        break;
    }
    setModalContent(details);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="group relative bg-blue-600 text-white rounded-2xl shadow-sm p-6 lg:col-span-2 cursor-pointer"
          onMouseEnter={() => setIsWelcomeHovered(true)}
          onMouseLeave={() => setIsWelcomeHovered(false)}
          onClick={() => handleCardClick('welcome')}
        >
          <h3 className="text-lg font-semibold opacity-80">Chào mừng trở lại, {username}!</h3>
          <p className="text-4xl font-bold mt-2">Hồ sơ Hướng nghiệp</p>
          <p className="opacity-80 mt-1">Đây là phân tích tổng quan về tiềm năng của bạn.</p>
          <HoverViewMore isVisible={isWelcomeHovered} className="text-white" />
        </div>
        <div
          className="group relative bg-white rounded-2xl shadow-sm p-6 cursor-pointer"
          onMouseEnter={() => setIsPersonalityHovered(true)}
          onMouseLeave={() => setIsPersonalityHovered(false)}
          onClick={() => handleCardClick('personality')}
        >
          <h3 className="text-gray-500">Loại tính cách</h3>
          {isMbtiLoading ? (
            <Skeleton className="h-8 w-3/4 mt-2" />
          ) : mbtiError ? (
            <p className="text-sm text-red-500 mt-2">{mbtiError}</p>
          ) : latestMbtiResult ? (
            <>
              <p className="text-2xl font-bold text-gray-800 mt-2">{latestMbtiResult.type}</p>
              <p className="text-sm text-gray-500 mt-1">{latestMbtiResult.description}</p>
            </>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Chưa có kết quả</p>
          )}
          <HoverViewMore isVisible={isPersonalityHovered} />
        </div>
        <div
          className="group relative bg-white rounded-2xl shadow-sm p-6 cursor-pointer"
          onMouseEnter={() => setIsHollandHovered(true)}
          onMouseLeave={() => setIsHollandHovered(false)}
          onClick={() => handleCardClick('holland')}
        >
          <h3 className="text-gray-500">Mã Holland</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">AIS</p>
          <p className="text-sm text-gray-500 mt-1">Nghệ thuật - Nghiên cứu - Xã hội</p>
          <HoverViewMore isVisible={isHollandHovered} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <OutstandingCompetenciesCard onClick={() => handleCardClick('competencies')} />
          <ActionCompassCard onClick={() => handleCardClick('action-compass')} />
        </div>
        <div
          className="group relative bg-white rounded-2xl shadow-sm p-6 flex flex-col min-h-[400px] cursor-pointer"
          onMouseEnter={() => setIsEqHovered(true)}
          onMouseLeave={() => setIsEqHovered(false)}
          onClick={() => handleCardClick('eq-profile')}
        >
          <h3 className="font-semibold text-gray-800 flex-shrink-0">Hồ sơ Trí tuệ Cảm xúc</h3>
          <div className="relative flex-1 mt-4">
            <EqChart />
          </div>
          <HoverViewMore isVisible={isEqHovered} />
        </div>
      </div>
      
      <InterestsSection onCardClick={handleCardClick} />

      <CareerSection />

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
  );
};

export default DashboardView;