import React, { createContext, useContext, useState, useEffect } from 'react';
import { Maintenance } from '../types';
import { generateId } from '../utils/mockDataInitializer';
import { useNotification } from './NotificationContext';
import { useEquipment } from './EquipmentContext';

interface MaintenanceContextType {
  maintenance: Maintenance[];
  loading: boolean;
  error: string | null;
  getMaintenance: (id: string) => Maintenance | undefined;
  getMaintenanceByEquipment: (equipmentId: string) => Maintenance[];
  getUpcomingMaintenance: () => Maintenance[];
  addMaintenance: (maintenance: Omit<Maintenance, 'id'>) => void;
  updateMaintenance: (id: string, updates: Partial<Maintenance>) => void;
  deleteMaintenance: (id: string) => boolean;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotification();
  const { getEquipment, updateEquipment } = useEquipment();

  useEffect(() => {
    // Load maintenance records from localStorage
    try {
      const storedMaintenance = localStorage.getItem('maintenance');
      if (storedMaintenance) {
        setMaintenance(JSON.parse(storedMaintenance));
      }
    } catch (err) {
      setError('Failed to load maintenance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save maintenance to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('maintenance', JSON.stringify(maintenance));
    }
  }, [maintenance, loading]);

  const getMaintenance = (id: string): Maintenance | undefined => {
    return maintenance.find(record => record.id === id);
  };

  const getMaintenanceByEquipment = (equipmentId: string): Maintenance[] => {
    return maintenance.filter(record => record.equipmentId === equipmentId);
  };

  const getUpcomingMaintenance = (): Maintenance[] => {
    const today = new Date().toISOString().split('T')[0];
    
    return maintenance.filter(record => 
      record.date >= today && 
      (record.status === 'Scheduled' || !record.status)
    );
  };

  const addMaintenance = (newMaintenance: Omit<Maintenance, 'id'>) => {
    const maintenanceWithId = {
      ...newMaintenance,
      id: `m${generateId().substring(0, 8)}`,
      status: newMaintenance.status || 'Scheduled'
    };
    
    setMaintenance(prev => [...prev, maintenanceWithId]);
    
    // If maintenance is for today, update equipment status
    const today = new Date().toISOString().split('T')[0];
    if (maintenanceWithId.date === today && maintenanceWithId.status !== 'Completed') {
      const equipment = getEquipment(maintenanceWithId.equipmentId);
      if (equipment && equipment.status === 'Available') {
        updateEquipment(maintenanceWithId.equipmentId, { status: 'Maintenance' });
      }
    }
    
    addNotification({
      type: 'info',
      title: 'Maintenance Scheduled',
      message: `New maintenance record created for equipment ${maintenanceWithId.equipmentId}`
    });
  };

  const updateMaintenance = (id: string, updates: Partial<Maintenance>) => {
    const currentMaintenance = getMaintenance(id);
    if (!currentMaintenance) return;
    
    setMaintenance(prev => 
      prev.map(record => 
        record.id === id ? { ...record, ...updates } : record
      )
    );
    
    // If status changed to Completed, update equipment status
    if (updates.status === 'Completed' && currentMaintenance.status !== 'Completed') {
      const equipment = getEquipment(currentMaintenance.equipmentId);
      if (equipment && equipment.status === 'Maintenance') {
        updateEquipment(currentMaintenance.equipmentId, { status: 'Available' });
      }
      
      addNotification({
        type: 'success',
        title: 'Maintenance Completed',
        message: `Maintenance for equipment ${currentMaintenance.equipmentId} has been completed`
      });
    }
  };

  const deleteMaintenance = (id: string): boolean => {
    const maintenanceToDelete = getMaintenance(id);
    
    if (!maintenanceToDelete) return false;
    
    // Don't allow deletion of in-progress maintenance
    if (maintenanceToDelete.status === 'In Progress') {
      addNotification({
        type: 'error',
        title: 'Cannot Delete',
        message: 'In-progress maintenance cannot be deleted'
      });
      return false;
    }
    
    setMaintenance(prev => prev.filter(record => record.id !== id));
    
    addNotification({
      type: 'warning',
      title: 'Maintenance Deleted',
      message: `Maintenance record ${id} has been deleted`
    });
    
    return true;
  };

  return (
    <MaintenanceContext.Provider 
      value={{ 
        maintenance, 
        loading, 
        error, 
        getMaintenance, 
        getMaintenanceByEquipment,
        getUpcomingMaintenance,
        addMaintenance, 
        updateMaintenance, 
        deleteMaintenance 
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = (): MaintenanceContextType => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};