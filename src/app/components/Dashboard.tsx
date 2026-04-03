import { useState } from 'react';
import { User } from '../App';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

// Role-specific views
import { PatientView } from './roles/PatientView';
import { DoctorView } from './roles/DoctorView';
import { PharmacyView } from './roles/PharmacyView';
import { AdminView } from './roles/AdminView';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export type NavigationItem =
  | 'home'
  | 'cases'
  | 'new-case'
  | 'messages'
  | 'history'
  | 'patients'
  | 'reviews'
  | 'schedule'
  | 'orders'
  | 'inventory'
  | 'tracking'
  | 'users'
  | 'analytics'
  | 'audit-logs'
  | 'content'
  | 'refunds'
  | 'settings';

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeNav, setActiveNav] = useState<NavigationItem>('home');

  const renderView = () => {
    switch (user.role) {
      case 'patient':
        return <PatientView activeNav={activeNav} user={user} onNavigate={setActiveNav} />;
      case 'doctor':
        return <DoctorView activeNav={activeNav} user={user} />;
      case 'pharmacy':
        return <PharmacyView activeNav={activeNav} user={user} />;
      case 'admin':
        return <AdminView activeNav={activeNav} user={user} />;
      default:
        return <PatientView activeNav={activeNav} user={user} onNavigate={setActiveNav} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FC]">
      <Sidebar
        user={user}
        activeNav={activeNav}
        onNavigate={setActiveNav}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto">{renderView()}</main>
      </div>
    </div>
  );
}