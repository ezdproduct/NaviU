import React from 'react';
import { competencyData } from '@/data/competencyData';
import { eqData } from '@/data/eqData';

// Định nghĩa kiểu cho userScores để dễ quản lý và mở rộng
interface UserScores {
    logic: 'cao' | 'trung_binh' | 'thap';
    language: 'cao' | 'trung_binh' | 'thap';
    spatial: 'cao' | 'trung_binh' | 'thap';
    self_awareness: 'cao' | 'trung_binh' | 'thap';
    self_regulation: 'cao' | 'trung_binh' | 'thap';
    motivation: 'cao' | 'trung_binh' | 'thap';
    empathy: 'cao' | 'trung_binh' | 'thap';
    social_skills: 'cao' | 'trung_binh' | 'thap';
}

// Giả định dữ liệu userScores sẽ được truyền vào qua props hoặc context
// Tạm thời sử dụng dữ liệu mẫu để component không bị lỗi
const defaultUserScores: UserScores = {
    logic: 'cao',
    language: 'cao',
    spatial: 'thap',
    self_awareness: 'cao',
    self_regulation: 'trung_binh',
    motivation: 'thap',
    empathy: 'thap',
    social_skills: 'trung_binh'
};

interface CompetencySectionProps {
    userScores?: UserScores; // Cho phép truyền userScores qua props
}

const CompetencySection = ({ userScores = defaultUserScores }: CompetencySectionProps) => {
    return (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b pb-4 mb-6">Chương 4: Năng lực & Trí tuệ Cảm xúc</h2>
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Phần 1: Năng lực Nổi trội</h3>
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-bold text-lg sm:text-xl text-indigo-600">{competencyData.logic.title}</h4><p className="mt-2 text-gray-700">{competencyData.logic[userScores.logic]}</p></div>
                        <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-bold text-lg sm:text-xl text-indigo-600">{competencyData.language.title}</h4><p className="mt-2 text-gray-700">{competencyData.language[userScores.language]}</p></div>
                        <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-bold text-lg sm:text-xl text-indigo-600">{competencyData.spatial.title}</h4><p className="mt-2 text-gray-700">{competencyData.spatial[userScores.spatial]}</p></div>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Phần 2: Thấu hiểu Cảm xúc</h3>
                    <div className="space-y-6">
                         {(Object.keys(eqData) as Array<keyof typeof eqData>).map(key => (
                             <div key={key} className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-lg sm:text-xl text-teal-600">{eqData[key].title}</h4>
                                <p className="mt-2 text-gray-700">{eqData[key][userScores[key]]}</p>
                            </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompetencySection;