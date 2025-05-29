import { v4 as uuidv4 } from 'uuid';
import { User, Equipment, Rental, Maintenance } from '../types';

export const initializeMockData = () => {
  // Initialize users if they don't exist
  if (!localStorage.getItem('users')) {
    const users: User[] = [
      { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123', name: 'Admin User' },
      { id: '2', role: 'Staff', email: 'staff@entnt.in', password: 'staff123', name: 'Staff User' },
      { id: '3', role: 'Customer', email: 'customer@entnt.in', password: 'cust123', name: 'Customer User' },
      { id: '4', role: 'Customer', email: 'johndoe@example.com', password: 'pass123', name: 'John Doe' },
      { id: '5', role: 'Customer', email: 'janedoe@example.com', password: 'pass123', name: 'Jane Doe' }
    ];
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Initialize equipment if it doesn't exist
  if (!localStorage.getItem('equipment')) {
    const equipment: Equipment[] = [
      { 
        id: 'eq1', 
        name: 'Excavator CAT 320', 
        category: 'Heavy Machinery', 
        condition: 'Good',
        status: 'Available',
        description: 'Medium-sized hydraulic excavator suitable for construction projects',
        dailyRate: 1200,
        purchaseDate: '2023-01-15',
        imageUrl: 'https://images.pexels.com/photos/6338699/pexels-photo-6338699.jpeg'
      },
      { 
        id: 'eq2', 
        name: 'Concrete Mixer HM-350', 
        category: 'Construction', 
        condition: 'Excellent',
        status: 'Rented',
        description: 'Industrial grade concrete mixer with 350L capacity',
        dailyRate: 500,
        purchaseDate: '2023-06-22',
        imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg'
      },
      { 
        id: 'eq3', 
        name: 'Scissor Lift SL-20', 
        category: 'Aerial Equipment', 
        condition: 'Good',
        status: 'Available',
        description: 'Electric scissor lift with 20ft maximum height',
        dailyRate: 350,
        purchaseDate: '2023-03-10',
        imageUrl: 'https://images.pexels.com/photos/8961026/pexels-photo-8961026.jpeg'
      },
      { 
        id: 'eq4', 
        name: 'Generator 50kW', 
        category: 'Power Equipment', 
        condition: 'Fair',
        status: 'Maintenance',
        description: 'Diesel generator capable of 50kW output',
        dailyRate: 800,
        purchaseDate: '2022-11-05',
        imageUrl: 'https://images.pexels.com/photos/2377443/pexels-photo-2377443.jpeg'
      },
      { 
        id: 'eq5', 
        name: 'Bulldozer D7', 
        category: 'Heavy Machinery', 
        condition: 'Good',
        status: 'Available',
        description: 'Medium-sized bulldozer for earth moving operations',
        dailyRate: 1500,
        purchaseDate: '2023-02-18',
        imageUrl: 'https://images.pexels.com/photos/6122318/pexels-photo-6122318.jpeg'
      }
    ];
    localStorage.setItem('equipment', JSON.stringify(equipment));
  }

  // Initialize rentals if they don't exist
  if (!localStorage.getItem('rentals')) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 5);
    
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 10);
    
    const nearPastDate = new Date(today);
    nearPastDate.setDate(today.getDate() - 3);
    
    const nearFutureDate = new Date(today);
    nearFutureDate.setDate(today.getDate() + 2);

    const rentals: Rental[] = [
      { 
        id: 'r1', 
        equipmentId: 'eq2', 
        customerId: '3', 
        startDate: today.toISOString().split('T')[0], 
        endDate: futureDate.toISOString().split('T')[0], 
        status: 'Rented',
        notes: 'Customer requested delivery to site',
        totalCost: 2500
      },
      { 
        id: 'r2', 
        equipmentId: 'eq5', 
        customerId: '4', 
        startDate: nearFutureDate.toISOString().split('T')[0], 
        endDate: futureDate.toISOString().split('T')[0], 
        status: 'Reserved',
        totalCost: 3000
      },
      { 
        id: 'r3', 
        equipmentId: 'eq3', 
        customerId: '5', 
        startDate: pastDate.toISOString().split('T')[0], 
        endDate: nearPastDate.toISOString().split('T')[0], 
        status: 'Returned',
        notes: 'Equipment returned in good condition',
        totalCost: 1050
      },
      { 
        id: 'r4', 
        equipmentId: 'eq1', 
        customerId: '3', 
        startDate: nearPastDate.toISOString().split('T')[0], 
        endDate: today.toISOString().split('T')[0], 
        status: 'Overdue',
        notes: 'Customer contacted for return',
        totalCost: 3600
      }
    ];
    localStorage.setItem('rentals', JSON.stringify(rentals));
  }

  // Initialize maintenance records if they don't exist
  if (!localStorage.getItem('maintenance')) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 7);
    
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 20);

    const maintenance: Maintenance[] = [
      { 
        id: 'm1', 
        equipmentId: 'eq1', 
        date: pastDate.toISOString().split('T')[0], 
        type: 'Routine Check', 
        notes: 'No issues found',
        cost: 150,
        completedBy: 'Technician A',
        status: 'Completed'
      },
      { 
        id: 'm2', 
        equipmentId: 'eq4', 
        date: today.toISOString().split('T')[0], 
        type: 'Repair', 
        notes: 'Fuel line replacement needed',
        cost: 350,
        completedBy: 'Technician B',
        status: 'In Progress'
      },
      { 
        id: 'm3', 
        equipmentId: 'eq2', 
        date: futureDate.toISOString().split('T')[0], 
        type: 'Routine Check', 
        notes: 'Scheduled maintenance after rental return',
        status: 'Scheduled'
      }
    ];
    localStorage.setItem('maintenance', JSON.stringify(maintenance));
  }

  // Initialize notifications if they don't exist
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }
};

export const generateId = (): string => {
  return uuidv4();
};