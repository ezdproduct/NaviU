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
        scales: { r: { beginAtZero: true, max: 100 } }, 
        plugins: { legend: { position: 'top' as const } } 
    };

    return (
        <div className={cn(
            "bg-gray-50 rounded-2xl shadow-sm p-6", // Changed background to bg-gray-50
            !hasHollandScores && "opacity-50 grayscale" // Removed pointer-events-none
        )}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b pb-4 mb-6">Khám phá Sở thích Cốt lõi</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    {hasHollandScores ? (
                        <HollandChart data={hollandChartData} options={hollandChartOptions} />
                    ) : (
                        <div className="text-center text-gray-500">
                            <p className="mb-4">Chưa có dữ liệu Holland. Hãy làm bài test để xem biểu đồ của bạn!</p>
                            <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')}>Làm bài test MBTI NaviU</Button> {/* Changed link to naviu-mbti */}
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
                                    className="group relative cursor-pointer bg-orange-100 border-orange-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300" // Updated card background and hover
                                    onMouseEnter={() => setHoveredCard(code)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onClick={() => onCardClick(`holland-detail-${code}`)}
                                >
                                    <CardContent className="p-4">
                                        <CardTitle className="text-lg font-bold text-orange-800 mb-2"> {/* Updated text color */}
                                            {code} - {data.name} ({data.title})
                                        </CardTitle>
                                        <p className="text-sm text-orange-700">{data.description}</p> {/* Updated text color */}
                                    </CardContent>
                                    <HoverViewMore isVisible={hoveredCard === code && hasHollandScores} className="text-orange-800" /> {/* Updated text color */}
                                </Card>
                            );
                        })
                    ) : (
                        <Card className="p-4 text-center text-gray-500 bg-gray-100 border-gray-200"> {/* Updated no data card background */}
                            <CardTitle className="text-lg font-bold mb-2">Chưa có kết quả Holland</CardTitle>
                            <p>Hãy làm bài test MBTI NaviU để khám phá sở thích nghề nghiệp của bạn.</p> {/* Updated text */}
                            <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')} className="mt-4">Làm bài test ngay</Button> {/* Updated link */}
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterestsSection;