import { User, UserRole } from '../App';
import { NavigationItem } from './Dashboard';
import {
  Home,
  FileText,
  MessageSquare,
  Clock,
  Users,
  Stethoscope,
  Calendar,
  Package,
  Archive,
  TruckIcon,
  BarChart3,
  FileEdit,
  Settings,
  ChevronDown,
  DollarSign,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  user: User;
  activeNav: NavigationItem;
  onNavigate: (nav: NavigationItem) => void;
  onLogout: () => void;
}

interface NavItem {
  id: NavigationItem;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home className="w-5 h-5" />,
    roles: ['patient', 'doctor', 'pharmacy', 'admin'],
  },
  {
    id: 'cases',
    label: 'My Cases',
    icon: <FileText className="w-5 h-5" />,
    roles: ['patient'],
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: <MessageSquare className="w-5 h-5" />,
    roles: ['patient', 'doctor'],
  },
  {
    id: 'history',
    label: 'History',
    icon: <Clock className="w-5 h-5" />,
    roles: ['patient'],
  },
  {
    id: 'patients',
    label: 'Patients',
    icon: <Users className="w-5 h-5" />,
    roles: ['doctor'],
  },
  {
    id: 'reviews',
    label: 'Case Reviews',
    icon: <Stethoscope className="w-5 h-5" />,
    roles: ['doctor'],
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: <Calendar className="w-5 h-5" />,
    roles: ['doctor'],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: <Package className="w-5 h-5" />,
    roles: ['pharmacy'],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: <Archive className="w-5 h-5" />,
    roles: ['pharmacy'],
  },
  {
    id: 'tracking',
    label: 'Shipment Tracking',
    icon: <TruckIcon className="w-5 h-5" />,
    roles: ['pharmacy'],
  },
  {
    id: 'users',
    label: 'User Management',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    id: 'cases',
    label: 'All Cases',
    icon: <FileText className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    id: 'refunds',
    label: 'Refund Management',
    icon: <DollarSign className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    id: 'audit-logs',
    label: 'Audit Logs',
    icon: <Clock className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    id: 'content',
    label: 'Content Management',
    icon: <FileEdit className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['patient', 'doctor', 'pharmacy', 'admin'],
  },
];

export function Sidebar({
  user,
  activeNav,
  onNavigate,
  onLogout,
}: SidebarProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );

  const filteredItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user.role)
  );

  const toggleSection = (sectionId: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId);
    } else {
      newCollapsed.add(sectionId);
    }
    setCollapsedSections(newCollapsed);
  };

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#5B6FF8] rounded-lg flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-semibold text-gray-900">MediConnect</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3">
          <p className="px-3 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            General
          </p>
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                activeNav === item.id
                  ? 'bg-[#F0F2FF] text-[#5B6FF8]'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}