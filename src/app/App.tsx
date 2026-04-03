import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

export type UserRole = 'patient' | 'doctor' | 'pharmacy' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard user={currentUser} onLogout={handleLogout} />;
}
