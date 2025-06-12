
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, BarChart3, LogIn, Mail } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Leaf },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/login', label: 'Login', icon: LogIn },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-green-700 font-bold text-xl">
            <Leaf className="h-8 w-8" />
            <span>SmartFarm</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-green-50 ${
                  location.pathname === path
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-600 hover:text-green-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <button className="text-gray-600 hover:text-green-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
