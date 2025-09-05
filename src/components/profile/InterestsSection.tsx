import React, { useState } from 'react';
import HollandChart from '@/components/charts/HollandChart';
import { hollandCodeData } from '@/data/hollandCodeData';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'; // Import CardDescription
import HoverViewMore from '@/components/HoverViewMore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Import cn utility
import { Compass } from 'lucide-react'; // Import Compass icon

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
            "bg-gray-50 rounded-2xl shadow-sm p-6",
        )}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b pb-4 mb-6">Khám phá Sở thích Cốt lõi</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    {hasHollandScores ? (
                        <HollandChart data={hollandChartData} options={hollandChartOptions} />
                    ) : (
                        <div className="text-center text-gray-500 space-y-3">
                            <p className="mb-4">Chưa có dữ liệu Holland. Hãy làm bài test để xem biểu đồ của bạn!</p>
                            <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')} className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Làm Bài Test Toàn Diện NaviU</Button>
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
                                    className="group relative cursor-pointer bg-orange-100 border-orange-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    onMouseEnter={() => setHoveredCard(code)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onClick={() => onCardClick(`holland-detail-${code}`)}
                                >
                                    <CardContent className="p-4">
                                        <CardTitle className="text-lg font-bold text-orange-800 mb-2">
                                            {code} - {data.name} ({data.title})
                                        </CardTitle>
                                        <p className="text-sm text-orange-700">{data.description}</p>
                                    </CardContent>
                                    <HoverViewMore isVisible={hoveredCard === code && hasHollandScores} className="text-orange-800" />
                                </Card>
                            );
                        })
                    ) : (
                        <Card className="p-6 text-center rounded-xl border-2 border-dashed border-orange-300 bg-orange-50">
                            <Compass className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                            <CardTitle className="text-xl font-bold text-gray-800 mb-2">Chưa có kết quả Holland</CardTitle>
                            <CardDescription className="text-gray-600">
                                Hãy làm Bài Test Toàn Diện NaviU để khám phá sở thích nghề nghiệp của bạn.
                            </CardDescription>
                            <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')} className="mt-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                                Làm bài test ngay
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterestsSection;