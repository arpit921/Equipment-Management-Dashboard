import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, AlertTriangle } from 'lucide-react';
import { useEquipment } from '../contexts/EquipmentContext';
import EquipmentDetail from '../components/Equipment/EquipmentDetail';

const EquipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEquipment } = useEquipment();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(id ? getEquipment(id) : undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      const foundEquipment = getEquipment(id);
      if (foundEquipment) {
        setEquipment(foundEquipment);
      } else {
        setNotFound(true);
      }
    }
  }, [id, getEquipment]);

  if (notFound) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="bg-amber-100 rounded-full p-2 mr-3">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Equipment Not Found</h1>
        </div>
        
        <p className="text-gray-600 mb-4">
          The equipment you're looking for could not be found. It may have been deleted or the ID is incorrect.
        </p>
        
        <button
          onClick={() => navigate('/equipment')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Equipment List
        </button>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-pulse flex items-center">
            <Package className="h-8 w-8 text-gray-300 mr-2" />
            <span className="text-gray-400 text-lg">Loading equipment details...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Package className="h-6 w-6 mr-2 text-blue-500" />
          Equipment Details
        </h1>
      </div>
      
      <EquipmentDetail equipment={equipment} />
    </div>
  );
};

export default EquipmentDetailPage;