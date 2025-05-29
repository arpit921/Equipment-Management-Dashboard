import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EquipmentProvider } from './contexts/EquipmentContext';
import { RentalProvider } from './contexts/RentalContext';
import { MaintenanceProvider } from './contexts/MaintenanceContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EquipmentPage from './pages/EquipmentPage';
import EquipmentDetailPage from './pages/EquipmentDetailPage';
import RentalsPage from './pages/RentalsPage';
import MaintenancePage from './pages/MaintenancePage';
import CalendarPage from './pages/CalendarPage';
import NotificationsPage from './pages/NotificationsPage';
import Layout from './components/Layout/Layout';
import { initializeMockData } from './utils/mockDataInitializer';

const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard\" replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  useEffect(() => {
    initializeMockData();
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard\" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
          <Route path="/rentals" element={<RentalsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard\" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <EquipmentProvider>
            <RentalProvider>
              <MaintenanceProvider>
                <AppContent />
              </MaintenanceProvider>
            </RentalProvider>
          </EquipmentProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;