import React, { useState } from 'react';
import { personalityData } from '@/data/personalityData';

const PersonalitySection = () => {
    const [selectedType, setSelectedType] = useState('INFP');
    const { title, description } = personalityData[selectedType as keyof typeof personalityData];
    return (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b pb-4 mb-6">Chương 2: Thấu hiểu Phong cách Cá nhân</h2>
            <div className="mb-8">
                <label htmlFor="personality-selector" className="block text-sm font-medium text-gray-700 mb-2">Khám phá các nhóm tính cách khác:</label>
                <select id="personality-selector" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    {Object.keys(personalityData).map(key => (<option key={key} value={key}>{personalityData[key as keyof typeof personalityData].title} {key === 'INFP' && '(Kết quả của bạn)'}</option>))}
                </select>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-3">{title}</h3>
                <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

export default PersonalitySection;