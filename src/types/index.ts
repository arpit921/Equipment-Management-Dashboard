export interface User {
  id: string;
  role: 'Admin' | 'Staff' | 'Customer';
  email: string;
  password: string;
  name?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  status: 'Available' | 'Rented' | 'Maintenance' | 'Reserved';
  description?: string;
  imageUrl?: string;
  dailyRate?: number;
  purchaseDate?: string;
}

export interface Rental {
  id: string;
  equipmentId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  status: 'Reserved' | 'Rented' | 'Returned' | 'Cancelled' | 'Overdue';
  notes?: string;
  totalCost?: number;
}

export interface Maintenance {
  id: string;
  equipmentId: string;
  date: string;
  type: 'Routine Check' | 'Repair' | 'Replacement' | 'Cleaning';
  notes: string;
  cost?: number;
  completedBy?: string;
  status?: 'Scheduled' | 'In Progress' | 'Completed';
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'rental' | 'maintenance';
  itemId: string;
}