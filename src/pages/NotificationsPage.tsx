import React from 'react';
import { Bell } from 'lucide-react';
import NotificationCenter from '../components/Notifications/NotificationCenter';

const NotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Bell className="h-6 w-6 mr-2 text-blue-500" />
          Notifications
        </h1>
      </div>
      
      <NotificationCenter />
    </div>
  );
};

export default NotificationsPage;