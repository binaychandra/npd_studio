import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/create' && location.pathname.startsWith('/create')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">NPD Studio</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/create"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/create')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Plus size={20} />
              <span>Create New</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;