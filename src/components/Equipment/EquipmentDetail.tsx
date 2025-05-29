import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, PenTool as Tool, ArrowLeft, Check, Edit, Clock, DollarSign, CalendarRange } from 'lucide-react';
import { Equipment, Rental, Maintenance } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useRental } from '../../contexts/RentalContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import EquipmentForm from './EquipmentForm';
import { format, parseISO } from 'date-fns';

interface EquipmentDetailProps {
  equipment: Equipment;
}

const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ equipment }) => {
  const { user } = useAuth();
  const { rentals, getRentalsByEquipment } = useRental();
  const { maintenance, getMaintenanceByEquipment } = useMaintenance();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'rentals' | 'maintenance'>('details');
  
  const equipmentRentals = getRentalsByEquipment(equipment.id);
  const equipmentMaintenance = getMaintenanceByEquipment(equipment.id);
  
  // Check if user has permission to edit
  const canEdit = user && (user.role === 'Admin' || user.role === 'Staff');

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rented':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Reserved':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getConditionColor = (condition: Equipment['condition']) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Fair':
        return 'bg-amber-100 text-amber-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRentalStatusColor = (status: Rental['status']) => {
    switch (status) {
      case 'Reserved':
        return 'bg-purple-100 text-purple-800';
      case 'Rented':
        return 'bg-blue-100 text-blue-800';
      case 'Returned':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaintenanceTypeColor = (type: Maintenance['type']) => {
    switch (type) {
      case 'Routine Check':
        return 'bg-blue-100 text-blue-800';
      case 'Repair':
        return 'bg-amber-100 text-amber-800';
      case 'Replacement':
        return 'bg-red-100 text-red-800';
      case 'Cleaning':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaintenanceStatusColor = (status?: Maintenance['status']) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserName = (id: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.id === id);
    return user ? user.name || user.email : `Customer ${id}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/equipment')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Equipment
          </button>
          
          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="md:flex md:items-start">
          {/* Equipment image */}
          <div className="md:flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            {equipment.imageUrl ? (
              <img
                className="h-48 w-full md:w-48 object-cover rounded-lg"
                src={equipment.imageUrl}
                alt={equipment.name}
              />
            ) : (
              <div className="h-48 w-full md:w-48 bg-gray-200 flex items-center justify-center rounded-lg">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Equipment details */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 mr-2">
                {equipment.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                {equipment.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Category:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">{equipment.category}</span>
              </div>
              
              <div className="flex items-center">
                <Check className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Condition:</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getConditionColor(equipment.condition)}`}>
                  {equipment.condition}
                </span>
              </div>
              
              {equipment.purchaseDate && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">Purchase Date:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {formatDate(equipment.purchaseDate)}
                  </span>
                </div>
              )}
              
              {equipment.dailyRate !== undefined && (
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">Daily Rate:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    ${equipment.dailyRate.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            
            {equipment.description && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm text-gray-900">{equipment.description}</p>
              </div>
            )}
            
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex border-b border-gray-200">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'details'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  <span className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Details
                  </span>
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'rentals'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('rentals')}
                >
                  <span className="flex items-center">
                    <CalendarRange className="h-4 w-4 mr-2" />
                    Rental History
                    {equipmentRentals.length > 0 && (
                      <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        {equipmentRentals.length}
                      </span>
                    )}
                  </span>
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'maintenance'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('maintenance')}
                >
                  <span className="flex items-center">
                    <Tool className="h-4 w-4 mr-2" />
                    Maintenance
                    {equipmentMaintenance.length > 0 && (
                      <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        {equipmentMaintenance.length}
                      </span>
                    )}
                  </span>
                </button>
              </div>
              
              <div className="mt-4">
                {activeTab === 'details' && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Equipment Details</h3>
                    <p className="text-sm text-gray-700">
                      {equipment.description || 'No additional details available for this equipment.'}
                    </p>
                    
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Current Status
                      </h4>
                      <div className={`p-3 rounded-md ${getStatusColor(equipment.status)}`}>
                        <div className="flex items-center">
                          {equipment.status === 'Available' && <Check className="h-5 w-5 mr-2" />}
                          {equipment.status === 'Rented' && <Calendar className="h-5 w-5 mr-2" />}
                          {equipment.status === 'Maintenance' && <Tool className="h-5 w-5 mr-2" />}
                          {equipment.status === 'Reserved' && <Clock className="h-5 w-5 mr-2" />}
                          <span className="font-medium">{equipment.status}</span>
                        </div>
                        <p className="text-sm mt-1">
                          {equipment.status === 'Available' && 'This equipment is available for rent.'}
                          {equipment.status === 'Rented' && 'This equipment is currently rented out.'}
                          {equipment.status === 'Maintenance' && 'This equipment is undergoing maintenance.'}
                          {equipment.status === 'Reserved' && 'This equipment is reserved for an upcoming rental.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'rentals' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Rental History</h3>
                    {equipmentRentals.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Period
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              {equipment.dailyRate !== undefined && (
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Cost
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {equipmentRentals
                              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                              .map((rental) => (
                                <tr key={rental.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {getUserName(rental.customerId)}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRentalStatusColor(rental.status)}`}>
                                      {rental.status}
                                    </span>
                                  </td>
                                  {equipment.dailyRate !== undefined && (
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                      ${rental.totalCost?.toFixed(2) || '—'}
                                    </td>
                                  )}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-500">
                        No rental history available for this equipment.
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'maintenance' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Maintenance Records</h3>
                    {equipmentMaintenance.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Notes
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {equipmentMaintenance
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(record.date)}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMaintenanceTypeColor(record.type)}`}>
                                      {record.type}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMaintenanceStatusColor(record.status)}`}>
                                      {record.status || 'Scheduled'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500">
                                    {record.notes}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-500">
                        No maintenance records available for this equipment.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Equipment Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Edit Equipment
              </h2>
              
              <EquipmentForm 
                equipment={equipment}
                onClose={() => setIsEditing(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDetail;