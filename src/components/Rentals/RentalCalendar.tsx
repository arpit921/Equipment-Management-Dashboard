import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths } from 'date-fns';
import { Rental } from '../../types';
import { useRental } from '../../contexts/RentalContext';
import { useEquipment } from '../../contexts/EquipmentContext';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const RentalCalendar: React.FC = () => {
  const { rentals } = useRental();
  const { equipment } = useEquipment();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [rentalsForSelectedDate, setRentalsForSelectedDate] = useState<Rental[]>([]);
  
  // Get equipment names for display
  const getEquipmentName = (id: string) => {
    const item = equipment.find(e => e.id === id);
    return item ? item.name : `Equipment ${id}`;
  };
  
  // Get customer names for display
  const getCustomerName = (id: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.id === id);
    return user ? user.name || user.email : `Customer ${id}`;
  };
  
  // Filter rentals for selected date
  useEffect(() => {
    if (selectedDate) {
      const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const relevantRentals = rentals.filter(rental => {
        const start = rental.startDate;
        const end = rental.endDate;
        
        return (
          (start <= formattedSelectedDate && end >= formattedSelectedDate) &&
          (rental.status === 'Reserved' || rental.status === 'Rented' || rental.status === 'Overdue')
        );
      });
      
      setRentalsForSelectedDate(relevantRentals);
    } else {
      setRentalsForSelectedDate([]);
    }
  }, [selectedDate, rentals]);
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDate(null);
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDate(null);
  };
  
  const getRentalsForDay = (day: Date) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    
    return rentals.filter(rental => {
      const start = rental.startDate;
      const end = rental.endDate;
      
      return (
        (start <= formattedDay && end >= formattedDay) &&
        (rental.status === 'Reserved' || rental.status === 'Rented' || rental.status === 'Overdue')
      );
    });
  };
  
  const getStatusColor = (status: Rental['status']) => {
    switch (status) {
      case 'Reserved':
        return 'bg-purple-500';
      case 'Rented':
        return 'bg-blue-500';
      case 'Overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            Rental Calendar
          </h2>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={previousMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-medium text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500 text-sm">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 auto-rows-fr">
          {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, index) => (
            <div key={`empty-start-${index}`} className="h-24 md:h-28 lg:h-32 border border-gray-200 bg-gray-50 rounded-md"></div>
          ))}
          
          {days.map((day) => {
            const rentalsForDay = getRentalsForDay(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const today = isSameDay(day, new Date());
            
            return (
              <div 
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`h-24 md:h-28 lg:h-32 border rounded-md p-1 transition-all cursor-pointer overflow-hidden
                  ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'}
                  ${today ? 'bg-blue-50' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium ${today ? 'text-blue-700' : 'text-gray-700'}`}>
                    {format(day, 'd')}
                  </span>
                  {rentalsForDay.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {rentalsForDay.length}
                    </span>
                  )}
                </div>
                
                <div className="mt-1 space-y-1 max-h-16 md:max-h-20 overflow-y-auto">
                  {rentalsForDay.slice(0, 3).map(rental => (
                    <div 
                      key={rental.id}
                      className="text-xs truncate px-1 py-0.5 rounded"
                      style={{ backgroundColor: `${getStatusColor(rental.status)}20` }}
                    >
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(rental.status)}`}></div>
                        <span className="truncate">{getEquipmentName(rental.equipmentId)}</span>
                      </div>
                    </div>
                  ))}
                  {rentalsForDay.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{rentalsForDay.length - 3} more...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {Array.from({ length: (7 - (days.length + startOfMonth(currentMonth).getDay()) % 7) % 7 }).map((_, index) => (
            <div key={`empty-end-${index}`} className="h-24 md:h-28 lg:h-32 border border-gray-200 bg-gray-50 rounded-md"></div>
          ))}
        </div>
      </div>
      
      {selectedDate && (
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Rentals for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          
          {rentalsForSelectedDate.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipment
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rentalsForSelectedDate.map((rental) => (
                    <tr key={rental.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {getEquipmentName(rental.equipmentId)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {getCustomerName(rental.customerId)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {format(parseISO(rental.startDate), 'MMM d')} - {format(parseISO(rental.endDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${rental.status === 'Reserved' ? 'bg-purple-100 text-purple-800' : ''}
                          ${rental.status === 'Rented' ? 'bg-blue-100 text-blue-800' : ''}
                          ${rental.status === 'Overdue' ? 'bg-red-100 text-red-800' : ''}`}
                        >
                          {rental.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-500">
              No rentals scheduled for this date.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RentalCalendar;