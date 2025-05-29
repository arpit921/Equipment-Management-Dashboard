import React, { useState } from 'react';
import { CalendarRange, CalendarDays } from 'lucide-react';
import RentalList from '../components/Rentals/RentalList';
import RentalCalendar from '../components/Rentals/RentalCalendar';

const RentalsPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <CalendarRange className="h-6 w-6 mr-2 text-blue-500" />
          Rental Management
        </h1>
        
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
              activeView === 'list' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onClick={() => setActiveView('list')}
          >
            <CalendarRange className="h-5 w-5 mr-2" />
            List View
          </button>
          <button
            type="button"
            className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
              activeView === 'calendar' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onClick={() => setActiveView('calendar')}
          >
            <CalendarDays className="h-5 w-5 mr-2" />
            Calendar View
          </button>
        </div>
      </div>
      
      {activeView === 'list' ? <RentalList /> : <RentalCalendar />}
    </div>
  );
};

export default RentalsPage;