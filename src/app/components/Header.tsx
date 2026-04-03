import { User } from '../App';
import { Search, Bell, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  const getStatusBadge = () => {
    switch (user.role) {
      case 'doctor':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-full text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="font-medium">Available</span>
            <span className="bg-red-500 px-2 py-0.5 rounded-full text-xs font-semibold">
              5 new
            </span>
          </div>
        );
      case 'pharmacy':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-full text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="font-medium">Online</span>
            <span className="bg-red-500 px-2 py-0.5 rounded-full text-xs font-semibold">
              3 pending
            </span>
          </div>
        );
      case 'admin':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-full text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="font-medium">System healthy</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 w-64 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
            ⌘ K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {getStatusBadge()}

        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-[#5B6FF8] to-[#8B5FF8] rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
        </div>
      </div>
    </header>
  );
}
