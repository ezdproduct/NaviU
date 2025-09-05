import React, { useState } from 'react';
import HollandChart from '@/components/charts/HollandChart';
import { hollandCodeData } from '@/data/hollandCodeData';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import HoverViewMore from '@/components/HoverViewMore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Import cn utility

interface InterestsSectionProps {
  onCardClick: (cardType: string) => void;
  hollandScores?: { [key: string]: number };
}

const InterestsSection = ({ onCardClick, hollandScores }: InterestsSectionProps) => {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const hasHollandScores = !!hollandScores && Object.keys(hollandScores).length > 0;

    const topHollandCodes = hasHollandScores
        ? Object.entries(hollandScores!)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 3)
            .map(([code]) => code)
        : [];

    const hollandChartData = {
        labels: ['Nghệ thuật (A)', 'Nghiên cứu (I)', 'Xã hội (S)', 'Quản lý (E)', 'Nghiệp vụ (C)', 'Kỹ thuật (R)'],
        datasets: [{
            label: 'Mức độ phù hợp',
            data: [
                hollandScores?.A || 0,
                hollandScores?.I || 0,
                hollandScores?.S || 0,
                hollandScores?.E || 0,
                hollandScores?.C || 0,
                hollandScores?.R || 0,
            ],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2
        }]
    };

    const hollandChartOptions = { 
        responsive: true, 
        maintainAspectRatio: false, 
        scales: { r: { beginAtZero: true, max: 100, pointLabels: { color: '#fff' } } }, // Adjusted pointLabels color
        plugins: { legend: { position: 'top' as const, labels: { color: '#fff' } } } // Adjusted legend labels color
    };

    return (
        <div className={cn(
            "bg-profile-gradient rounded-2xl shadow-sm p-6 text-white", // Changed bg-gray-50 to bg-profile-gradient and added text-white
        )}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white border-b pb-4 mb-6">Khám phá Sở thích Cốt lõi</h2> {/* Changed text-gray-800 to text-white */}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    {hasHollandScores ? (
                        <HollandChart data={hollandChartData} options={hollandChartOptions} />
                    ) : (
                        <div className="text-center text-blue-100 space-y-3"> {/* Changed text-gray-500 to text-blue-100 */}
                            <p className="mb-4">Chưa có dữ liệu Holland. Hãy làm bài test để xem biểu đồ của bạn!</p>
                            <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')} className="bg-blue-900 text-white hover:bg-blue-700 rounded-lg">Làm Bài Test Toàn Diện NaviU</Button> {/* Adjusted button color */}
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    {hasHollandScores ? (
                        topHollandCodes.map(code => {
                            const data = hollandCodeData[code as keyof typeof hollandCodeData];
                            return (
                                <Card
                                    key={code}
                                    className="group relative cursor-pointer bg-white border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300" // Changed bg-orange-100 border-orange-200 to bg-white border-gray-200
                                    onMouseEnter={() => setHoveredCard(code)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onClick={() => onCardClick(`holland-detail-${code}`)}
                                >
                                    <CardContent className="p-4">
                                        <CardTitle className="text-lg font-bold text-gray-800 mb-2"> {/* Changed text-orange-800 to text-gray-800 */}
                                            {code} - {data.name} ({data.title})
                                        </CardTitle>
                                        <p className="text-sm text-gray-700">{data.description}</p> {/* Changed text-orange-700 to text-gray-700 */}
                                    </CardContent>
                                    <HoverViewMore isVisible={hoveredCard === code && hasHollandScores} className="text-gray-800" /> {/* Changed text-orange-800 to text-gray-800 */}
                                </Card>
                            );
                        })
                    ) : (
                        <Card className="p-4 text-center text-blue-100 bg-blue-800 border-blue-700 space-y-3"> {/* Changed bg-gray-100 border-gray-200 to bg-blue-800 border-blue-700 and text-gray-500 to text-blue-100 */}
                            <CardTitle className="text-lg font-bold mb-2 text-white">Chưa có kết quả Holland</CardTitle> {/* Changed text-gray-800 to text-white */}
                            <p>Hãy làm Bài Test Toàn Diện NaviU để khám phá sở thích nghề nghiệp của bạn.</p>
                            <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')} className="mt-4 bg-blue-900 text-white hover:bg-blue-700 rounded-lg">Làm bài test ngay</Button> {/* Adjusted button color */}
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterestsSection;