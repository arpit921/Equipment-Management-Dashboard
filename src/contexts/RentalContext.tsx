import React, { createContext, useContext, useState, useEffect } from 'react';
import { Rental, Equipment } from '../types';
import { generateId } from '../utils/mockDataInitializer';
import { useNotification } from './NotificationContext';
import { useEquipment } from './EquipmentContext';

interface RentalContextType {
  rentals: Rental[];
  loading: boolean;
  error: string | null;
  getRental: (id: string) => Rental | undefined;
  getRentalsByEquipment: (equipmentId: string) => Rental[];
  getRentalsByCustomer: (customerId: string) => Rental[];
  getRentalsByStatus: (status: Rental['status']) => Rental[];
  addRental: (rental: Omit<Rental, 'id'>) => boolean;
  updateRental: (id: string, updates: Partial<Rental>) => boolean;
  updateRentalStatus: (id: string, status: Rental['status']) => boolean;
  deleteRental: (id: string) => boolean;
  getOverdueRentals: () => Rental[];
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotification();
  const { getEquipment, updateEquipment } = useEquipment();

  useEffect(() => {
    // Load rentals from localStorage
    try {
      const storedRentals = localStorage.getItem('rentals');
      if (storedRentals) {
        setRentals(JSON.parse(storedRentals));
      }
    } catch (err) {
      setError('Failed to load rental data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save rentals to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('rentals', JSON.stringify(rentals));
    }
  }, [rentals, loading]);

  // Check for overdue rentals daily
  useEffect(() => {
    const checkOverdueRentals = () => {
      const today = new Date().toISOString().split('T')[0];
      
      setRentals(prevRentals => 
        prevRentals.map(rental => {
          if (
            rental.status === 'Rented' && 
            rental.endDate < today
          ) {
            // Automatically mark as overdue
            addNotification({
              type: 'warning',
              title: 'Rental Overdue',
              message: `Rental ID: ${rental.id} is now overdue`
            });
            return { ...rental, status: 'Overdue' };
          }
          return rental;
        })
      );
    };
    
    // Run immediately and then every 24 hours
    checkOverdueRentals();
    const interval = setInterval(checkOverdueRentals, 86400000); // 24 hours
    
    return () => clearInterval(interval);
  }, [addNotification]);

  const getRental = (id: string): Rental | undefined => {
    return rentals.find(rental => rental.id === id);
  };

  const getRentalsByEquipment = (equipmentId: string): Rental[] => {
    return rentals.filter(rental => rental.equipmentId === equipmentId);
  };

  const getRentalsByCustomer = (customerId: string): Rental[] => {
    return rentals.filter(rental => rental.customerId === customerId);
  };

  const getRentalsByStatus = (status: Rental['status']): Rental[] => {
    return rentals.filter(rental => rental.status === status);
  };
  
  const updateEquipmentStatus = (equipmentId: string, status: Equipment['status']) => {
    const equipment = getEquipment(equipmentId);
    if (equipment) {
      updateEquipment(equipmentId, { status });
    }
  };

  const addRental = (newRental: Omit<Rental, 'id'>): boolean => {
    // Check if equipment is available for the requested period
    const equipment = getEquipment(newRental.equipmentId);
    
    if (!equipment) {
      addNotification({
        type: 'error',
        title: 'Error Creating Rental',
        message: 'Equipment not found'
      });
      return false;
    }
    
    if (equipment.status !== 'Available' && equipment.status !== 'Reserved') {
      addNotification({
        type: 'error',
        title: 'Equipment Unavailable',
        message: `This ${equipment.name} is currently ${equipment.status.toLowerCase()}`
      });
      return false;
    }
    
    // Check for date conflicts with existing rentals
    const conflictingRentals = rentals.filter(rental => 
      rental.equipmentId === newRental.equipmentId &&
      rental.status !== 'Cancelled' &&
      rental.status !== 'Returned' &&
      // Check if dates overlap
      ((new Date(rental.startDate) <= new Date(newRental.endDate)) &&
       (new Date(rental.endDate) >= new Date(newRental.startDate)))
    );
    
    if (conflictingRentals.length > 0) {
      addNotification({
        type: 'error',
        title: 'Date Conflict',
        message: 'This equipment is already booked for the selected dates'
      });
      return false;
    }
    
    const rentalWithId = {
      ...newRental,
      id: `r${generateId().substring(0, 8)}`
    };
    
    setRentals(prev => [...prev, rentalWithId]);
    
    // Update equipment status
    const newStatus = newRental.status === 'Rented' ? 'Rented' : 'Reserved';
    updateEquipmentStatus(newRental.equipmentId, newStatus);
    
    addNotification({
      type: 'success',
      title: 'Rental Created',
      message: `New rental has been created successfully`
    });
    
    return true;
  };

  const updateRental = (id: string, updates: Partial<Rental>): boolean => {
    const currentRental = rentals.find(rental => rental.id === id);
    
    if (!currentRental) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Rental not found'
      });
      return false;
    }
    
    setRentals(prev => 
      prev.map(rental => 
        rental.id === id ? { ...rental, ...updates } : rental
      )
    );
    
    // If status is changing, update equipment status accordingly
    if (updates.status && updates.status !== currentRental.status) {
      let equipmentStatus: Equipment['status'] = 'Available';
      
      switch (updates.status) {
        case 'Reserved':
          equipmentStatus = 'Reserved';
          break;
        case 'Rented':
          equipmentStatus = 'Rented';
          break;
        case 'Returned':
        case 'Cancelled':
          equipmentStatus = 'Available';
          break;
        case 'Overdue':
          equipmentStatus = 'Rented'; // Still considered rented
          break;
      }
      
      updateEquipmentStatus(currentRental.equipmentId, equipmentStatus);
    }
    
    addNotification({
      type: 'info',
      title: 'Rental Updated',
      message: `Rental ID: ${id} has been updated`
    });
    
    return true;
  };

  const updateRentalStatus = (id: string, status: Rental['status']): boolean => {
    return updateRental(id, { status });
  };

  const deleteRental = (id: string): boolean => {
    const rentalToDelete = getRental(id);
    
    if (!rentalToDelete) {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: 'Rental not found'
      });
      return false;
    }
    
    // Only allow deletion of rentals that are not in active status
    if (['Rented', 'Reserved', 'Overdue'].includes(rentalToDelete.status)) {
      addNotification({
        type: 'error',
        title: 'Cannot Delete Rental',
        message: 'Active rentals cannot be deleted'
      });
      return false;
    }
    
    setRentals(prev => prev.filter(rental => rental.id !== id));
    
    addNotification({
      type: 'warning',
      title: 'Rental Deleted',
      message: `Rental ID: ${id} has been deleted`
    });
    
    return true;
  };

  const getOverdueRentals = (): Rental[] => {
    return rentals.filter(rental => rental.status === 'Overdue');
  };

  return (
    <RentalContext.Provider 
      value={{ 
        rentals,
        loading,
        error,
        getRental,
        getRentalsByEquipment,
        getRentalsByCustomer,
        getRentalsByStatus,
        addRental,
        updateRental,
        updateRentalStatus,
        deleteRental,
        getOverdueRentals
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};

export const useRental = (): RentalContextType => {
  const context = useContext(RentalContext);
  if (context === undefined) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
};