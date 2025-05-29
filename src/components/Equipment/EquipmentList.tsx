import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  Check,
  X,
  AlertTriangle 
} from 'lucide-react';
import { Equipment } from '../../types';
import { useEquipment } from '../../contexts/EquipmentContext';
import { useAuth } from '../../contexts/AuthContext';
import EquipmentForm from './EquipmentForm';

const EquipmentList: React.FC = () => {
  const { equipment, deleteEquipment } = useEquipment();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(null);

  // Get unique categories for the filter dropdown
  const categories = [...new Set(equipment.map(item => item.category))];
  
  // Filter equipment based on search term and filters
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEquipmentClick = (id: string) => {
    navigate(`/equipment/${id}`);
  };

  const handleEditClick = (e: React.MouseEvent, item: Equipment) => {
    e.stopPropagation();
    setEditingEquipment(item);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setEquipmentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (equipmentToDelete) {
      deleteEquipment(equipmentToDelete);
      setIsDeleteModalOpen(false);
      setEquipmentToDelete(null);
    }
  };

  const getStatusBadgeColor = (status: Equipment['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Rented':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-amber-100 text-amber-800';
      case 'Reserved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionBadgeColor = (condition: Equipment['condition']) => {
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

  // Check if user has permission to add/edit/delete
  const canModify = user && (user.role === 'Admin' || user.role === 'Staff');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-500" />
            Equipment Inventory
          </h2>
          
          {canModify && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </button>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Reserved">Reserved</option>
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
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condition
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {canModify && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => handleEquipmentClick(item.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.imageUrl ? (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-md object-cover\" src={item.imageUrl} alt={item.name} />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">ID: {item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getConditionBadgeColor(item.condition)}`}>
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  {canModify && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => handleEditClick(e, item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {user?.role === 'Admin' && (
                        <button 
                          onClick={(e) => handleDeleteClick(e, item.id)}
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
                <td colSpan={canModify ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No equipment found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add/Edit Equipment Modal */}
      {(showAddForm || editingEquipment) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
                </h2>
                <button 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEquipment(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <EquipmentForm 
                equipment={editingEquipment}
                onClose={() => {
                  setShowAddForm(false);
                  setEditingEquipment(null);
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
                <h3 className="text-lg font-medium text-gray-900">Delete Equipment</h3>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this equipment? This action cannot be undone.
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

export default EquipmentList;