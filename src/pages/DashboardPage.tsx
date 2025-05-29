import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import KPICards from '../components/Dashboard/KPICards';
import Charts from '../components/Dashboard/Charts';
import { useEquipment } from '../contexts/EquipmentContext';
import { useRental } from '../contexts/RentalContext';
import { useMaintenance } from '../contexts/MaintenanceContext';

const DashboardPage: React.FC = () => {
  const { equipment } = useEquipment();
  const { rentals } = useRental();
  const { maintenance } = useMaintenance();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <LayoutDashboard className="h-6 w-6 mr-2 text-blue-500" />
          Dashboard
        </h1>
      </div>
      
      <KPICards 
        equipment={equipment}
        rentals={rentals}
        maintenance={maintenance}
      />
      
      <Charts 
        equipment={equipment}
        rentals={rentals}
        maintenance={maintenance}
      />
    </div>
  );
};

export default DashboardPage;