import React, { createContext, useContext, useState, useEffect } from 'react';
import { Equipment } from '../types';
import { generateId } from '../utils/mockDataInitializer';
import { useNotification } from './NotificationContext';

interface EquipmentContextType {
  equipment: Equipment[];
  loading: boolean;
  error: string | null;
  getEquipment: (id: string) => Equipment | undefined;
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => boolean;
  getEquipmentByStatus: (status: Equipment['status']) => Equipment[];
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const EquipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    // Load equipment from localStorage
    try {
      const storedEquipment = localStorage.getItem('equipment');
      if (storedEquipment) {
        setEquipment(JSON.parse(storedEquipment));
      }
    } catch (err) {
      setError('Failed to load equipment data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save equipment to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('equipment', JSON.stringify(equipment));
    }
  }, [equipment, loading]);

  const getEquipment = (id: string): Equipment | undefined => {
    return equipment.find(item => item.id === id);
  };

  const addEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const equipmentWithId = {
      ...newEquipment,
      id: `eq${generateId().substring(0, 8)}`
    };
    
    setEquipment(prev => [...prev, equipmentWithId]);
    
    addNotification({
      type: 'success',
      title: 'Equipment Added',
      message: `${newEquipment.name} has been added to inventory`
    });
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
    
    addNotification({
      type: 'info',
      title: 'Equipment Updated',
      message: `Equipment ID: ${id} has been updated`
    });
  };

  const deleteEquipment = (id: string): boolean => {
    // Check if there are any active rentals for this equipment
    const rentalsString = localStorage.getItem('rentals');
    if (rentalsString) {
      const rentals = JSON.parse(rentalsString);
      const activeRental = rentals.find(
        (rental: any) => rental.equipmentId === id && 
        ['Reserved', 'Rented', 'Overdue'].includes(rental.status)
      );
      
      if (activeRental) {
        addNotification({
          type: 'error',
          title: 'Cannot Delete Equipment',
          message: 'This equipment has active rentals and cannot be deleted'
        });
        return false;
      }
    }
    
    const equipmentToDelete = getEquipment(id);
    setEquipment(prev => prev.filter(item => item.id !== id));
    
    if (equipmentToDelete) {
      addNotification({
        type: 'warning',
        title: 'Equipment Deleted',
        message: `${equipmentToDelete.name} has been removed from inventory`
      });
    }
    
    return true;
  };

  const getEquipmentByStatus = (status: Equipment['status']): Equipment[] => {
    return equipment.filter(item => item.status === status);
  };

  return (
    <EquipmentContext.Provider 
      value={{ 
        equipment, 
        loading, 
        error, 
        getEquipment, 
        addEquipment, 
        updateEquipment, 
        deleteEquipment,
        getEquipmentByStatus
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = (): EquipmentContextType => {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
};