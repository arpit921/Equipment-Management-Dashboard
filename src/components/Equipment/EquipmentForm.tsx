import React, { useState } from 'react';
import { Equipment } from '../../types';
import { useEquipment } from '../../contexts/EquipmentContext';

interface EquipmentFormProps {
  equipment?: Equipment | null;
  onClose: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, onClose }) => {
  const { addEquipment, updateEquipment } = useEquipment();
  const [formData, setFormData] = useState<Omit<Equipment, 'id'>>({
    name: equipment?.name || '',
    category: equipment?.category || '',
    condition: equipment?.condition || 'Good',
    status: equipment?.status || 'Available',
    description: equipment?.description || '',
    imageUrl: equipment?.imageUrl || '',
    dailyRate: equipment?.dailyRate || 0,
    purchaseDate: equipment?.purchaseDate || new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dailyRate' ? parseFloat(value) : value
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Equipment name is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.dailyRate < 0) {
      newErrors.dailyRate = 'Daily rate cannot be negative';
    }
    
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (equipment) {
      updateEquipment(equipment.id, formData);
    } else {
      addEquipment(formData);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Equipment Name*
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category*
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          placeholder="e.g. Heavy Machinery, Construction, Tools"
        />
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
            Condition*
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
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
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Brief description of the equipment"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700">
            Daily Rate ($)
          </label>
          <input
            type="number"
            id="dailyRate"
            name="dailyRate"
            value={formData.dailyRate}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`mt-1 block w-full border ${errors.dailyRate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.dailyRate && <p className="mt-1 text-sm text-red-600">{errors.dailyRate}</p>}
        </div>
        
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
            Purchase Date
          </label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.imageUrl ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
        
        {formData.imageUrl && isValidUrl(formData.imageUrl) && (
          <div className="mt-2 flex justify-center">
            <img
              src={formData.imageUrl}
              alt="Equipment preview"
              className="h-32 w-auto object-cover rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/150?text=Image+Error';
              }}
            />
          </div>
        )}
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
          {equipment ? 'Update' : 'Add'} Equipment
        </button>
      </div>
    </form>
  );
};

export default EquipmentForm;