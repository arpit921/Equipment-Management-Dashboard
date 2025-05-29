import React, { useState } from 'react';
import { PenTool as Tool, Search, Plus, Edit, Trash2, X, AlertTriangle, Package, Clock } from 'lucide-react';
import { Maintenance } from '../../types';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { useEquipment } from '../../contexts/EquipmentContext';
import { useAuth } from '../../contexts/AuthContext';
import MaintenanceForm from './MaintenanceForm';
import { format, parseISO } from 'date-fns';

const MaintenanceList: React.FC = () => {
  const { maintenance, deleteMaintenance } = useMaintenance();
  const { equipment } = useEquipment();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<string | null>(null);
  
  // Get equipment names for display
  const getEquipmentName = (id: string) => {
    const item = equipment.find(e => e.id === id);
    return item ? item.name : `Equipment ${id}`;
  };
  
  // Filter maintenance records based on search and status filter
  const filteredMaintenance = maintenance.filter(record => {
    const equipmentName = getEquipmentName(record.equipmentId).toLowerCase();
    
    const matchesSearch = 
      equipmentName.includes(searchTerm.toLowerCase()) || 
      (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? (record.status || 'Scheduled') === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleEditClick = (record: Maintenance) => {
    setEditingMaintenance(record);
  };
  
  const handleDeleteClick = (id: string) => {
    setMaintenanceToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (maintenanceToDelete) {
      deleteMaintenance(maintenanceToDelete);
      setIsDeleteModalOpen(false);
      setMaintenanceToDelete(null);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const getTypeBadgeColor = (type: Maintenance['type']) => {
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

  const getStatusBadgeColor = (status?: Maintenance['status']) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-purple-100 text-purple-800'; // Default to Scheduled
    }
  };
  
  // Check if user has permission
  const canModify = user && (user.role === 'Admin' || user.role === 'Staff');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Tool className="h-5 w-5 mr-2 text-blue-500" />
            Maintenance Records
          </h2>
          
          {canModify && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Maintenance
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
              placeholder="Search maintenance records..."
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
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipment
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              {canModify && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMaintenance.length > 0 ? (
              filteredMaintenance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{getEquipmentName(record.equipmentId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{formatDate(record.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(record.type)}`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(record.status)}`}>
                      {record.status || 'Scheduled'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 line-clamp-2">{record.notes}</span>
                  </td>
                  {canModify && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditClick(record)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {user?.role === 'Admin' && (
                        <button 
                          onClick={() => handleDeleteClick(record.id)}
                          className="text-red-600 hover:text-red-900"
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
                <td colSpan={canModify ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No maintenance records found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add/Edit Maintenance Modal */}
      {(showAddForm || editingMaintenance) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingMaintenance ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
                </h2>
                <button 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMaintenance(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <MaintenanceForm 
                maintenance={editingMaintenance}
                onClose={() => {
                  setShowAddForm(false);
                  setEditingMaintenance(null);
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
                <h3 className="text-lg font-medium text-gray-900">Delete Maintenance Record</h3>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this maintenance record? This action cannot be undone.
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
    </div>
  );
};

export default MaintenanceList;