import React, { useState } from 'react';
import { 
  CalendarRange, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Package,
  User
} from 'lucide-react';
import { Rental } from '../../types';
import { useRental } from '../../contexts/RentalContext';
import { useEquipment } from '../../contexts/EquipmentContext';
import { useAuth } from '../../contexts/AuthContext';
import RentalForm from './RentalForm';
import { format, parseISO } from 'date-fns';

const RentalList: React.FC = () => {
  const { rentals, updateRentalStatus, deleteRental } = useRental();
  const { equipment } = useEquipment();
  const { user, getUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRental, setEditingRental] = useState<Rental | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rentalToDelete, setRentalToDelete] = useState<string | null>(null);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [rentalToUpdate, setRentalToUpdate] = useState<Rental | null>(null);
  const [newStatus, setNewStatus] = useState<Rental['status']>('Rented');
  
  const users = getUsers();
  
  // Get equipment and customer names for display
  const getEquipmentName = (id: string) => {
    const item = equipment.find(e => e.id === id);
    return item ? item.name : `Equipment ${id}`;
  };
  
  const getCustomerName = (id: string) => {
    const customer = users.find(u => u.id === id);
    return customer ? (customer.name || customer.email) : `Customer ${id}`;
  };
  
  // Filter rentals based on search and status filter
  const filteredRentals = rentals.filter(rental => {
    const equipmentName = getEquipmentName(rental.equipmentId).toLowerCase();
    const customerName = getCustomerName(rental.customerId).toLowerCase();
    
    const matchesSearch = 
      equipmentName.includes(searchTerm.toLowerCase()) || 
      customerName.includes(searchTerm.toLowerCase()) ||
      rental.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? rental.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleEditClick = (rental: Rental) => {
    setEditingRental(rental);
  };
  
  const handleDeleteClick = (id: string) => {
    setRentalToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (rentalToDelete) {
      deleteRental(rentalToDelete);
      setIsDeleteModalOpen(false);
      setRentalToDelete(null);
    }
  };
  
  const handleUpdateStatusClick = (rental: Rental) => {
    setRentalToUpdate(rental);
    setNewStatus(rental.status);
    setIsUpdateStatusModalOpen(true);
  };
  
  const confirmUpdateStatus = () => {
    if (rentalToUpdate && newStatus) {
      updateRentalStatus(rentalToUpdate.id, newStatus);
      setIsUpdateStatusModalOpen(false);
      setRentalToUpdate(null);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const getStatusBadgeColor = (status: Rental['status']) => {
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
  
  // Check if user has permission
  const canCreate = user && (user.role === 'Admin' || user.role === 'Staff');
  const canUpdate = user && (user.role === 'Admin' || user.role === 'Staff');
  const canDelete = user && user.role === 'Admin';
  
  // For customers, only show their own rentals
  const userRentals = user?.role === 'Customer' 
    ? filteredRentals.filter(r => r.customerId === user.id)
    : filteredRentals;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <CalendarRange className="h-5 w-5 mr-2 text-blue-500" />
            Rental Orders
          </h2>
          
          {canCreate && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Rental
            </button>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search rentals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Reserved">Reserved</option>
              <option value="Rented">Rented</option>
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rental ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipment
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {canUpdate && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userRentals.length > 0 ? (
              userRentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rental.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{getEquipmentName(rental.equipmentId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{getCustomerName(rental.customerId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(rental.status)}`}>
                      {rental.status}
                    </span>
                  </td>
                  {canUpdate && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleUpdateStatusClick(rental)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Update Status"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditClick(rental)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Edit Rental"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {canDelete && (
                        <button 
                          onClick={() => handleDeleteClick(rental.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Rental"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canUpdate ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No rentals found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add/Edit Rental Modal */}
      {(showAddForm || editingRental) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingRental ? 'Edit Rental' : 'Create New Rental'}
                </h2>
                <button 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingRental(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <RentalForm 
                rental={editingRental}
                onClose={() => {
                  setShowAddForm(false);
                  setEditingRental(null);
                }} 
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Delete Rental</h3>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this rental? This action cannot be undone.
              </p>
              
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Status Modal */}
      {isUpdateStatusModalOpen && rentalToUpdate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Update Rental Status</h3>
                <button 
                  onClick={() => setIsUpdateStatusModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  Current status: <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(rentalToUpdate.status)}`}>{rentalToUpdate.status}</span>
                </p>
                
                <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <select
                  id="newStatus"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Rental['status'])}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Reserved">Reserved</option>
                  <option value="Rented">Rented</option>
                  <option value="Returned">Returned</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmUpdateStatus}
                >
                  Update Status
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsUpdateStatusModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalList;