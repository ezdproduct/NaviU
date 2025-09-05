import React, { useState } from 'react';
import { expertData, Expert } from '@/data/expertData';
import ExpertCard from './ExpertCard';
import ExpertProfileModal from './ExpertProfileModal';
import BookingModal from './BookingModal';

const ConnectView = () => {
  const [selectedExpertForProfile, setSelectedExpertForProfile] = useState<Expert | null>(null);
  const [selectedExpertForBooking, setSelectedExpertForBooking] = useState<Expert | null>(null);

  const handleViewProfile = (expert: Expert) => {
    setSelectedExpertForProfile(expert);
  };

  const handleBookSession = (expert: Expert) => {
    setSelectedExpertForBooking(expert);
  };

  const handleSwitchToBooking = (expert: Expert) => {
    setSelectedExpertForProfile(null);
    setSelectedExpertForBooking(expert);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expertData.map((expert) => (
          <ExpertCard
            key={expert.id}
            expert={expert}
            onViewProfile={handleViewProfile}
            onBook={handleBookSession}
          />
        ))}
      </div>

      <ExpertProfileModal
        expert={selectedExpertForProfile}
        onClose={() => setSelectedExpertForProfile(null)}
        onBook={handleSwitchToBooking}
      />

      <BookingModal
        expert={selectedExpertForBooking}
        onClose={() => setSelectedExpertForBooking(null)}
      />
    </div>
  );
};

export default ConnectView;