import React from 'react';
import { Package } from 'lucide-react';
import EquipmentList from '../components/Equipment/EquipmentList';

const EquipmentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Package className="h-6 w-6 mr-2 text-blue-500" />
          Equipment Inventory
        </h1>
      </div>
      
      <EquipmentList />
    </div>
  );
};

export default EquipmentPage;