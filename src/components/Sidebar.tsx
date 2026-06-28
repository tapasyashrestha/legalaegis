import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Scale, 
  Upload, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Briefcase
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const customerLinks = [
    { name: 'Upload Notice', to: '/dashboard/upload', icon: Upload },
    { name: 'My Reports', to: '/dashboard/reports', icon: FileText },
    { name: 'Find Lawyers', to: '/dashboard/lawyers', icon: Users },
    { name: 'Profile', to: '/dashboard/profile', icon: Settings },
  ];

  const lawyerLinks = [
    { name: 'Pending Invitations', to: '/lawyer/invitations', icon: Briefcase },
    { name: 'Accepted Cases', to: '/lawyer/cases', icon: FileText },
    { name: 'Profile', to: '/lawyer/profile', icon: Settings },
  ];

  const links = user?.role === 'lawyer' ? lawyerLinks : customerLinks;

  return (
    <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300">
      <div className="flex items-center h-16 px-6 border-b border-slate-800">
        <Scale className="w-6 h-6 text-emerald-500 mr-2" />
        <span className="text-xl font-bold text-white tracking-tight">Aegis</span>
      </div>
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-4 space-y-1">
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                )
              }
            >
              <item.icon className="mr-3 w-5 h-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 w-5 h-5 flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}
