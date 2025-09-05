import React, { useState } from 'react';
import { Expert } from '@/data/expertData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { showSuccess } from '@/utils/toast';

interface BookingModalProps {
  expert: Expert | null;
  onClose: () => void;
}

const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

const BookingModal = ({ expert, onClose }: BookingModalProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  if (!expert) return null;

  const handleBooking = () => {
    if (date && selectedTime) {
      showSuccess(`Đã đặt lịch thành công với ${expert.name} vào lúc ${selectedTime} ngày ${date.toLocaleDateString('vi-VN')}.`);
      onClose();
    }
  };

  return (
    <Dialog open={!!expert} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đặt lịch với {expert.name}</DialogTitle>
          <DialogDescription>Chọn ngày và giờ phù hợp với bạn.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
          />
          <div className="w-full">
            <h4 className="font-semibold mb-2 text-center">Chọn giờ</h4>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  className={cn(
                    "rounded-lg border-blue-600 text-blue-600 hover:bg-blue-50", // Default outline style
                    { "bg-blue-600 text-white hover:bg-blue-700": selectedTime === time } // Selected style
                  )}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg">Hủy</Button>
          <Button onClick={handleBooking} disabled={!date || !selectedTime} className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
            Xác nhận đặt lịch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;