import React, { useState } from 'react';
import { Maintenance } from '../../types';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { useEquipment } from '../../contexts/EquipmentContext';

interface MaintenanceFormProps {
  maintenance?: Maintenance | null;
  onClose: () => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ maintenance, onClose }) => {
  const { addMaintenance, updateMaintenance } = useMaintenance();
  const { equipment } = useEquipment();
  
  // Filter out equipment in maintenance if creating new record
  const availableEquipment = maintenance 
    ? equipment 
    : equipment.filter(e => e.status !== 'Maintenance');
  
  const [formData, setFormData] = useState<Omit<Maintenance, 'id'>>({
    equipmentId: maintenance?.equipmentId || '',
    date: maintenance?.date || new Date().toISOString().split('T')[0],
    type: maintenance?.type || 'Routine Check',
    notes: maintenance?.notes || '',
    cost: maintenance?.cost || 0,
    completedBy: maintenance?.completedBy || '',
    status: maintenance?.status || 'Scheduled'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' ? parseFloat(value) : value
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
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.notes.trim()) {
      newErrors.notes = 'Notes are required';
    }
    
    if (formData.cost < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (maintenance) {
      // Update existing maintenance record
      updateMaintenance(maintenance.id, formData);
    } else {
      // Add new maintenance record
      addMaintenance(formData);
    }
    
    onClose();
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
          disabled={maintenance !== null} // Disable if editing existing record
        >
          <option value="">Select Equipment</option>
          {availableEquipment.map(item => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.status})
            </option>
          ))}
        </select>
        {errors.equipmentId && <p className="mt-1 text-sm text-red-600">{errors.equipmentId}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date*
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.date ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type*
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Routine Check">Routine Check</option>
            <option value="Repair">Repair</option>
            <option value="Replacement">Replacement</option>
            <option value="Cleaning">Cleaning</option>
          </select>
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
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes*
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.notes ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          placeholder="Describe the maintenance task"
        />
        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
            Cost ($)
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`mt-1 block w-full border ${errors.cost ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost}</p>}
        </div>
        
        <div>
          <label htmlFor="completedBy" className="block text-sm font-medium text-gray-700">
            Completed By
          </label>
          <input
            type="text"
            id="completedBy"
            name="completedBy"
            value={formData.completedBy}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Name of technician"
          />
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
          {maintenance ? 'Update' : 'Add'} Record
        </button>
      </div>
    </form>
  );
};

export default MaintenanceForm;