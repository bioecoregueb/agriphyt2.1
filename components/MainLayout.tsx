import React, { ReactNode, useState } from 'react';
// Fix: Changed import source for Page from '../App' to '../types' as it is defined there.
import { Page } from '../types';
import { SunIcon, DatabaseIcon, UserIcon, PlusIcon, BarChartIcon } from './Icons';
import WeatherModal from './WeatherModal';

interface MainLayoutProps {
  children: ReactNode;
  activePage: Page;
  setActivePage: (page: Page) => void;
  onNavigateToAdd: () => void;
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

const MainLayout: React.FC<MainLayoutProps> = ({ children, activePage, setActivePage, onNavigateToAdd }) => {
  const [isWeatherModalOpen, setWeatherModalOpen] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Pesticide Database</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Search compounds, analyze data, and manage your pesticide database</p>
          </div>
          <button 
            onClick={() => setWeatherModalOpen(true)}
            className="flex items-center space-x-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="font-semibold text-gray-700 dark:text-gray-200">20°C</span>
            <SunIcon className="h-5 w-5 text-yellow-500" />
          </button>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 h-16 shadow-[0_-2px_6px_-1px_rgba(0,0,0,0.1)] flex items-center z-20">
        <div className="w-full grid grid-cols-5">
            <NavItem
              label="Database"
              icon={<DatabaseIcon className="h-6 w-6" />}
              isActive={activePage === 'database'}
              onClick={() => setActivePage('database')}
            />
            <NavItem
              label="Overview"
              icon={<BarChartIcon className="h-6 w-6" />}
              isActive={activePage === 'overview'}
              onClick={() => setActivePage('overview')}
            />
            {/* FAB Placeholder */}
            <div />
            <NavItem
              label="Profile"
              icon={<UserIcon className="h-6 w-6" />}
              isActive={activePage === 'profile'}
              onClick={() => setActivePage('profile')}
            />
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