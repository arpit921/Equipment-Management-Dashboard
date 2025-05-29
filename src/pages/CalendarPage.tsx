import React from 'react';
import { Calendar } from 'lucide-react';
import RentalCalendar from '../components/Rentals/RentalCalendar';

const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-blue-500" />
          Calendar View
        </h1>
      </div>
      
      <RentalCalendar />
    </div>
  );
};

export default CalendarPage;