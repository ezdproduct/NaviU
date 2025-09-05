import React from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '@/data/testimonialData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <Card className="bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
      <CardContent className="p-0 flex-grow">
        <p className="text-gray-600 mb-6 flex-grow">"{testimonial.quote}"</p>
        <div className="flex items-center mt-auto">
          <Avatar className="w-16 h-16">
            <AvatarImage src={testimonial.avatar} alt={`Chân dung ${testimonial.name}`} />
            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
            <p className="text-sm text-gray-500">{testimonial.title}</p>
            <div className="flex mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;