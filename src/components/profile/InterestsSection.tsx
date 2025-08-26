import React, { useState } from 'react';
import HollandChart from '@/components/charts/HollandChart';
import { hollandCodeData } from '@/data/hollandCodeData';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import HoverViewMore from '@/components/HoverViewMore';

interface InterestsSectionProps {
  onCardClick: (cardType: string) => void;
}

const InterestsSection = ({ onCardClick }: InterestsSectionProps) => {
    const userTopResults = ['A', 'I', 'S']; 
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b pb-4 mb-6">Khám phá Sở thích Cốt lõi</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <HollandChart />
                </div>
                <div className="space-y-4">
                    {userTopResults.map(code => {
                        const data = hollandCodeData[code as keyof typeof hollandCodeData];
                        return (
                            <Card
                                key={code}
                                className="group relative cursor-pointer" // Add cursor-pointer
                                onMouseEnter={() => setHoveredCard(code)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => onCardClick(`holland-detail-${code}`)} // Specific click handler for each Holland code
                            >
                                <CardContent className="p-4">
                                    <CardTitle className="text-lg font-bold text-indigo-600 mb-2">
                                        {code} - {data.name} ({data.title})
                                    </CardTitle>
                                    <p className="text-sm text-gray-700">{data.description}</p>
                                </CardContent>
                                <HoverViewMore isVisible={hoveredCard === code} />
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default InterestsSection;