import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface FeatureSectionProps {
  title: string;
  description: string;
  features: {
    icon: React.ElementType;
    name: string;
    description: string;
  }[];
  ctaText: string;
  ctaLink: string;
  reverse?: boolean;
}

const FeatureSection = ({ title, description, features, ctaText, ctaLink, reverse }: FeatureSectionProps) => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {title}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {description}
            </p>
            <Link to={ctaLink}>
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                {ctaText} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl">
                <CardHeader className="pb-4">
                  <feature.icon className="h-10 w-10 text-blue-600 mb-3" />
                  <CardTitle className="text-xl font-semibold text-gray-800">{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;