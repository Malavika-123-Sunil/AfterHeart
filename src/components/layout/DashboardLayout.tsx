import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Music, Compass, Brain, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Affirmation from '../ui/Affirmation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { path: '/dashboard', icon: <Heart size={20} />, label: 'Dashboard' },
    { path: '/music', icon: <Music size={20} />, label: 'Music Therapy' },
    { path: '/trips', icon: <Compass size={20} />, label: 'Healing Trips' },
    { path: '/wellness', icon: <Brain size={20} />, label: 'Mental Wellness' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Heart className="text-secondary-500" size={28} />
            <span className="text-2xl font-display font-semibold text-primary-800">AfterHeart</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {currentUser && (
              <div className="flex items-center">
                <div className="mr-4 text-right">
                  <p className="text-sm text-accent-700">Welcome back,</p>
                  <p className="font-medium text-primary-800">{currentUser.name}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-primary-50 transition-colors"
                  aria-label="Log out"
                >
                  <LogOut size={20} className="text-accent-500" />
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar navigation */}
        <aside className="hidden md:block w-64 bg-white shadow-md">
          <nav className="py-6 px-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-accent-700 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-6 border-t border-accent-100">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-accent-700 hover:bg-primary-50 hover:text-primary-600 w-full"
              >
                <LogOut size={20} />
                <span>Log Out</span>
              </button>
            </div>
          </nav>
        </aside>
        
        {/* Mobile menu (overlay) */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-accent-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="text-secondary-500" size={24} />
                  <span className="text-xl font-display font-semibold text-primary-800">AfterHeart</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full hover:bg-primary-50"
                >
                  <X size={20} />
                </button>
              </div>
              
              {currentUser && (
                <div className="p-4 border-b border-accent-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center">
                      <User size={20} className="text-primary-700" />
                    </div>
                    <div>
                      <p className="font-medium text-primary-800">{currentUser.name}</p>
                      <p className="text-sm text-accent-600">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <nav className="py-4">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-accent-700 hover:bg-primary-50 hover:text-primary-600'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-accent-700 hover:bg-primary-50 hover:text-primary-600 w-full"
                    >
                      <LogOut size={20} />
                      <span>Log Out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </motion.div>
          </motion.div>
        )}
        
        {/* Main content */}
        <main className="flex-1 py-8 px-6">
          <div className="container mx-auto">
            {children}
            <Affirmation />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;