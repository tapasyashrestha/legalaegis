import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Bell, User } from 'lucide-react';

export function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
      <div className="flex items-center">
        {/* Breadcrumbs or Page Title could go here */}
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-slate-500 transition-colors rounded-full hover:bg-slate-100">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-slate-900">{user?.name}</span>
            <span className="text-xs text-slate-500 capitalize">{user?.role}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
