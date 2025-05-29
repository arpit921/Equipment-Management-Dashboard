import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  getUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for existing session on component mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Get users from localStorage
    const usersString = localStorage.getItem('users');
    if (!usersString) return false;
    
    const users: User[] = JSON.parse(usersString);
    
    // Find the user with matching email and password
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      // Store user in localStorage for session persistence
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const getUsers = (): User[] => {
    const usersString = localStorage.getItem('users');
    if (!usersString) return [];
    return JSON.parse(usersString);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, getUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};