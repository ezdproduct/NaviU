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

interface DashboardViewProps {
  username: string;
}

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

const getPersonalityModalDetails = (personalityType: keyof typeof personalityData) => {
  const pData = personalityData[personalityType];
  return {
    title: `Loại tính cách: ${pData.title} (${personalityType})`,
    description: pData.description,
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
  const [isWelcomeHovered, setIsWelcomeHovered] = useState(false);
  const [isPersonalityHovered, setIsPersonalityHovered] = useState(false);
  const [isHollandHovered, setIsHollandHovered] = useState(false);
  const [isEqHovered, setIsEqHovered] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; description: React.ReactNode; content?: React.ReactNode } | null>(null);

  // Placeholder for user's actual report data
  const userReportData = {
    personalityType: 'INFP' as keyof typeof personalityData,
    hollandCodes: ['A', 'I', 'S'] as Array<keyof typeof hollandCodeData>,
    mainValue: 'can_bang' as keyof typeof valuesData,
    competencies: {
      language: 'cao' as 'cao' | 'trung_binh' | 'thap',
      logic: 'trung_binh' as 'cao' | 'trung_binh' | 'thap',
    },
    eqScores: {
      self_awareness: 'cao' as 'cao' | 'trung_binh' | 'thap',
      self_regulation: 'trung_binh' as 'cao' | 'trung_binh' | 'thap',
      motivation: 'thap' as 'cao' | 'trung_binh' | 'thap',
      empathy: 'thap' as 'cao' | 'trung_binh' | 'thap',
      social_skills: 'trung_binh' as 'cao' | 'trung_binh' | 'thap',
    }
  };

  const handleCardClick = (cardType: string) => {
    let details;
    switch (cardType) {
      case 'welcome':
        details = getWelcomeModalDetails(username);
        break;
      case 'personality':
        details = getPersonalityModalDetails(userReportData.personalityType);
        break;
      case 'holland':
        details = getHollandModalDetails(userReportData.hollandCodes);
        break;
      case 'competencies':
        details = getCompetenciesModalDetails(); // This still uses hardcoded values within the helper
        break;
      case 'action-compass':
        details = getActionCompassModalDetails(userReportData.mainValue);
        break;
      case 'eq-profile':
        details = getEqProfileModalDetails(); // This still uses hardcoded values within the helper
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
          <p className="text-2xl font-bold text-gray-800 mt-2">{userReportData.personalityType}</p>
          <p className="text-sm text-gray-500 mt-1">{personalityData[userReportData.personalityType].title}</p>
          <HoverViewMore isVisible={isPersonalityHovered} />
        </div>
        <div
          className="group relative bg-white rounded-2xl shadow-sm p-6 cursor-pointer"
          onMouseEnter={() => setIsHollandHovered(true)}
          onMouseLeave={() => setIsHollandHovered(false)}
          onClick={() => handleCardClick('holland')}
        >
          <h3 className="text-gray-500">Mã Holland</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">{userReportData.hollandCodes.join('')}</p>
          <p className="text-sm text-gray-500 mt-1">{userReportData.hollandCodes.map(code => hollandCodeData[code].name).join(' - ')}</p>
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