import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Define a mapping for nicer labels
  const pathLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    lawyer: 'Lawyer Dashboard',
    reports: 'Reports',
    upload: 'Upload Notice',
    lawyers: 'Lawyers',
    profile: 'Profile',
    invitations: 'Invitations',
    cases: 'Cases',
    chat: 'Chat',
  };

  // If we are at the root, don't show breadcrumbs or just show Home
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-slate-900 transition-colors flex items-center">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = pathLabels[value] || value; // Fallback to raw value if not mapped (e.g., IDs)

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {last ? (
              <span className="text-slate-900 font-medium truncate max-w-[200px]" aria-current="page">
                {label}
              </span>
            ) : (
              <Link to={to} className="hover:text-slate-900 transition-colors truncate max-w-[200px]">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
