import React from 'react';
import { PenTool as Tool } from 'lucide-react';
import MaintenanceList from '../components/Maintenance/MaintenanceList';

const MaintenancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Tool className="h-6 w-6 mr-2 text-blue-500" />
          Maintenance Management
        </h1>
      </div>
      
      <MaintenanceList />
    </div>
  );
};

export default MaintenancePage;