import React, { useState, useEffect } from 'react';
import { Rental } from '../../types';
import { useRental } from '../../contexts/RentalContext';
import { useEquipment } from '../../contexts/EquipmentContext';
import { useAuth } from '../../contexts/AuthContext';
import { CalendarRange } from 'lucide-react';
import { differenceInDays } from 'date-fns';

interface RentalFormProps {
  rental?: Rental | null;
  onClose: () => void;
}

const RentalForm: React.FC<RentalFormProps> = ({ rental, onClose }) => {
  const { addRental, updateRental } = useRental();
  const { equipment } = useEquipment();
  const { user, getUsers } = useAuth();
  
  // Get users with Customer role for dropdown
  const users = getUsers().filter(u => u.role === 'Customer');
  
  // Get available equipment for dropdown
  const availableEquipment = equipment.filter(e => 
    e.status === 'Available' || (rental && e.id === rental.equipmentId)
  );
  
  const calculateTotalCost = (equipmentId: string, startDate: string, endDate: string): number => {
    const selectedEquipment = equipment.find(e => e.id === equipmentId);
    if (!selectedEquipment || !selectedEquipment.dailyRate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, differenceInDays(end, start) + 1); // Include both start and end days
    
    return selectedEquipment.dailyRate * days;
  };
  
  const [formData, setFormData] = useState<Omit<Rental, 'id'>>({
    equipmentId: rental?.equipmentId || '',
    customerId: rental?.customerId || (user?.role === 'Customer' ? user.id : ''),
    startDate: rental?.startDate || new Date().toISOString().split('T')[0],
    endDate: rental?.endDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // Default to 3 days
    status: rental?.status || 'Reserved',
    notes: rental?.notes || '',
    totalCost: rental?.totalCost || 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Update total cost when relevant fields change
  useEffect(() => {
    if (formData.equipmentId && formData.startDate && formData.endDate) {
      const cost = calculateTotalCost(formData.equipmentId, formData.startDate, formData.endDate);
      setFormData(prev => ({ ...prev, totalCost: cost }));
    }
  }, [formData.equipmentId, formData.startDate, formData.endDate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.equipmentId) {
      newErrors.equipmentId = 'Equipment is required';
    }
    
    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (rental) {
      // Update existing rental
      const success = updateRental(rental.id, formData);
      if (success) {
        onClose();
      }
    } else {
      // Add new rental
      const success = addRental(formData);
      if (success) {
        onClose();
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="equipmentId" className="block text-sm font-medium text-gray-700">
          Equipment*
        </label>
        <select
          id="equipmentId"
          name="equipmentId"
          value={formData.equipmentId}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.equipmentId ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          disabled={rental !== null} // Disable if editing existing rental
        >
          <option value="">Select Equipment</option>
          {availableEquipment.map(item => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.status}) - ${item.dailyRate}/day
            </option>
          ))}
        </select>
        {errors.equipmentId && <p className="mt-1 text-sm text-red-600">{errors.equipmentId}</p>}
      </div>
      
      <div>
        <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
          Customer*
        </label>
        <select
          id="customerId"
          name="customerId"
          value={formData.customerId}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.customerId ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          disabled={user?.role === 'Customer' || rental !== null} // Disable if user is customer or editing existing rental
        >
          <option value="">Select Customer</option>
          {users.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name || customer.email}
            </option>
          ))}
        </select>
        {errors.customerId && <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date*
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
            className={`mt-1 block w-full border ${errors.startDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date*
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={formData.startDate} // Must be after start date
            className={`mt-1 block w-full border ${errors.endDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status*
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="Reserved">Reserved</option>
          <option value="Rented">Rented</option>
          <option value="Returned">Returned</option>
          <option value="Cancelled">Cancelled</option>
          {rental?.status === 'Overdue' && <option value="Overdue">Overdue</option>}
        </select>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Any additional information about this rental"
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex items-center mb-2">
          <CalendarRange className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Rental Summary</h3>
        </div>
        
        <div className="text-sm text-gray-700">
          <p>Total Days: {formData.startDate && formData.endDate ? 
            Math.max(1, differenceInDays(new Date(formData.endDate), new Date(formData.startDate)) + 1) : 0}
          </p>
          <p className="font-semibold mt-1">
            Total Cost: ${formData.totalCost.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {rental ? 'Update' : 'Create'} Rental
        </button>
      </div>
    </form>
  );
};

export default RentalForm;