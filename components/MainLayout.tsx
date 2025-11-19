
import React, { ReactNode, useState } from 'react';
// Fix: Changed import source for Page from '../App' to '../types' as it is defined there.
import { Page } from '../types';
import { SunIcon, DatabaseIcon, UserIcon, PlusIcon, BarChartIcon, BookTextIcon } from './Icons';
import WeatherModal from './WeatherModal';
import Notification from './Notification';

interface MainLayoutProps {
  children: ReactNode;
  activePage: Page;
  setActivePage: (page: Page) => void;
  onNavigateToAdd: () => void;
  notification: { message: string; type: 'success' | 'error' } | null;
  onDismissNotification: () => void;
  onOpenRules: () => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full text-xs transition-colors ${
      isActive ? 'text-secondary font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-secondary'
    }`}
  >
    {icon}
    <span className="mt-1">{label}</span>
  </button>
);

const DesktopNavLink: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MainLayout: React.FC<MainLayoutProps> = ({ children, activePage, setActivePage, onNavigateToAdd, notification, onDismissNotification, onOpenRules }) => {
  const [isWeatherModalOpen, setWeatherModalOpen] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Pesticide Database</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Manage your phytosanitary products</p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
                <DesktopNavLink 
                    label="Overview" 
                    icon={<BarChartIcon className="h-4 w-4" />}
                    isActive={activePage === 'overview'}
                    onClick={() => setActivePage('overview')}
                />
                <DesktopNavLink 
                    label="Database" 
                    icon={<DatabaseIcon className="h-4 w-4" />}
                    isActive={activePage === 'database'}
                    onClick={() => setActivePage('database')}
                />
                 <DesktopNavLink 
                    label="Profile" 
                    icon={<UserIcon className="h-4 w-4" />}
                    isActive={activePage === 'profile'}
                    onClick={() => setActivePage('profile')}
                />
            </nav>
          </div>

          <div className="flex items-center gap-3">
             <button 
                onClick={onNavigateToAdd}
                className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
                <PlusIcon className="h-4 w-4" />
                <span>Add Compound</span>
            </button>

            <button 
                onClick={() => setWeatherModalOpen(true)}
                className="flex items-center space-x-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
                <span className="font-semibold text-gray-700 dark:text-gray-200">20°C</span>
                <SunIcon className="h-5 w-5 text-yellow-500" />
            </button>
          </div>
        </div>
      </header>
      
      {notification && (
        <Notification 
            message={notification.message}
            type={notification.type}
            onDismiss={onDismissNotification}
        />
      )}

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 h-16 shadow-[0_-2px_6px_-1px_rgba(0,0,0,0.1)] flex items-center z-20">
        <div className="w-full flex h-full">
            <div className="w-1/5">
                <NavItem
                  label="Database"
                  icon={<DatabaseIcon className="h-6 w-6" />}
                  isActive={activePage === 'database'}
                  onClick={() => setActivePage('database')}
                />
            </div>
            <div className="w-1/5">
                <NavItem
                  label="Overview"
                  icon={<BarChartIcon className="h-6 w-6" />}
                  isActive={activePage === 'overview'}
                  onClick={() => setActivePage('overview')}
                />
            </div>
            <div className="w-1/5">
                {/* FAB Placeholder */}
            </div>
            <div className="w-1/5">
                <NavItem
                  label="Rules"
                  icon={<BookTextIcon className="h-6 w-6" />}
                  isActive={false}
                  onClick={onOpenRules}
                />
            </div>
            <div className="w-1/5">
                <NavItem
                  label="Profile"
                  icon={<UserIcon className="h-6 w-6" />}
                  isActive={activePage === 'profile'}
                  onClick={() => setActivePage('profile')}
                />
            </div>
        </div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={onNavigateToAdd}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                activePage === 'add' ? 'bg-secondary' : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              <PlusIcon className="h-8 w-8 text-white" />
            </button>
          </div>
      </nav>
      
      <WeatherModal isOpen={isWeatherModalOpen} onClose={() => setWeatherModalOpen(false)} />
    </div>
  );
};

export default MainLayout;
