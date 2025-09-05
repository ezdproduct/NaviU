import React, { useState } from 'react';
import { valuesData } from '@/data/valuesData';

const ValuesSection = () => {
    const [activeTab, setActiveTab] = useState('can_bang');
    const userTopResults = ['can_bang', 'moi_truong', 'giup_do', 'on_dinh', 'phat_trien'];
    const { name, description, role, questions } = valuesData[activeTab as keyof typeof valuesData];
    return (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b pb-4 mb-6">Chương 5: La bàn Giá trị</h2>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {Object.keys(valuesData).map(key => (<button key={key} onClick={() => setActiveTab(key)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{valuesData[key as keyof typeof valuesData].name}{userTopResults.includes(key) && <span className="bg-blue-100 text-blue-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded-full">Nổi bật</span>}</button>))}
                </nav>
            </div>
            <div className="mt-6"><div className="bg-gray-50 p-6 rounded-lg border space-y-4"><h3 className="text-xl sm:text-2xl font-bold text-indigo-600">{name}</h3><h4 className="font-semibold text-gray-800 text-lg">Diễn giải Tổng quan</h4><p className="text-gray-700 leading-relaxed">{description}</p><h4 className="font-semibold text-gray-800 text-lg">Vai trò trong việc ra quyết định</h4><p className="text-gray-700 leading-relaxed">{role}</p><h4 className="font-semibold text-gray-800 text-lg">Câu hỏi Tự vấn:</h4><ul className="list-disc list-inside space-y-2 text-gray-600">{questions.map((q, index) => <li key={index}>{q}</li>)}</ul></div></div>
        </div>
    );
};

export default ValuesSection;