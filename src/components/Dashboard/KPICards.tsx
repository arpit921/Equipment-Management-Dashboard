import React from 'react';
import { Package, Check, AlertTriangle, PenTool as Tool, Clock, Users } from 'lucide-react';
import { Equipment, Rental, Maintenance } from '../../types';

interface KPICardsProps {
  equipment: Equipment[];
  rentals: Rental[];
  maintenance: Maintenance[];
}

const KPICards: React.FC<KPICardsProps> = ({ equipment, rentals, maintenance }) => {
  // Calculate KPIs
  const totalEquipment = equipment.length;
  
  const availableEquipment = equipment.filter(item => item.status === 'Available').length;
  const rentedEquipment = equipment.filter(item => item.status === 'Rented').length;
  const availablePercentage = totalEquipment > 0 
    ? Math.round((availableEquipment / totalEquipment) * 100) 
    : 0;
  
  const overdueRentals = rentals.filter(rental => rental.status === 'Overdue').length;
  
  const today = new Date().toISOString().split('T')[0];
  const upcomingMaintenance = maintenance.filter(
    record => record.date >= today && (record.status === 'Scheduled' || !record.status)
  ).length;
  
  const activeCustomers = [...new Set(rentals
    .filter(rental => rental.status === 'Rented' || rental.status === 'Reserved')
    .map(rental => rental.customerId))].length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Equipment */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md">
        <div className="px-6 py-5 flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Equipment</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{totalEquipment}</div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3">
          <div className="text-sm">
            <span className="font-medium text-blue-700">
              {rentedEquipment} rented • {availableEquipment} available
            </span>
          </div>
        </div>
      </div>
      
      {/* Available vs Rented */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md">
        <div className="px-6 py-5 flex items-center">
          <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Availability Rate</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{availablePercentage}%</div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${availablePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Overdue Rentals */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md">
        <div className="px-6 py-5 flex items-center">
          <div className="flex-shrink-0 bg-amber-100 rounded-full p-3">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Overdue Rentals</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{overdueRentals}</div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3">
          <div className="text-sm">
            <span className={`font-medium ${overdueRentals > 0 ? 'text-amber-700' : 'text-green-700'}`}>
              {overdueRentals > 0 
                ? `${overdueRentals} rental${overdueRentals > 1 ? 's' : ''} need attention` 
                : 'No overdue rentals'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Upcoming Maintenance */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md">
        <div className="px-6 py-5 flex items-center">
          <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
            <Tool className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Maintenance</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{upcomingMaintenance}</div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3">
          <div className="text-sm">
            <span className="font-medium text-purple-700">
              {upcomingMaintenance > 0 
                ? `${upcomingMaintenance} scheduled maintenance task${upcomingMaintenance > 1 ? 's' : ''}` 
                : 'No upcoming maintenance'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Average Rental Duration */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md">
        <div className="px-6 py-5 flex items-center">
          <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
            <Clock className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Active Rentals</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {rentals.filter(r => r.status === 'Rented').length}
                </div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3">
          <div className="text-sm">
            <span className="font-medium text-indigo-700">
              {rentals.filter(r => r.status === 'Reserved').length} upcoming reservations
            </span>
          </div>
        </div>
      </div>
      
      {/* Active Customers */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md">
        <div className="px-6 py-5 flex items-center">
          <div className="flex-shrink-0 bg-pink-100 rounded-full p-3">
            <Users className="h-6 w-6 text-pink-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Active Customers</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{activeCustomers}</div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3">
          <div className="text-sm">
            <span className="font-medium text-pink-700">
              {rentals.filter(r => 
                r.status === 'Rented' || r.status === 'Reserved'
              ).length} active rentals
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICards;