
import React, { useState, useCallback, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import DatabasePage from './pages/DatabasePage';
import OverviewPage from './pages/OverviewPage';
import AddCompoundPage from './pages/AddCompoundPage';
import ProfilePage from './pages/ProfilePage';
import { Page } from './types';
import { Pesticide } from './types';
import { pesticides as mockPesticides } from './data/mockData';


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState<Page>('overview');
  const [compounds, setCompounds] = useState<Pesticide[]>(mockPesticides);
  const [isGoogleIntegrated, setIsGoogleIntegrated] = useState(false);
  const [compoundToEdit, setCompoundToEdit] = useState<Pesticide | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setIsGoogleIntegrated(false); // Reset integration on logout
    setActivePage('database'); // Reset to default page on logout
  }, []);

  const handleDeleteAllData = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all compound data? This action cannot be undone.')) {
        setCompounds([]);
        alert('All data has been deleted.');
    }
  }, []);
  
  const handleToggleGoogleIntegration = () => {
    if (!isGoogleIntegrated) {
        // Simulate a successful connection
        alert("Successfully connected to Google account!");
    }
    setIsGoogleIntegrated(prev => !prev);
  };

  const handleSaveCompound = (compoundData: Omit<Pesticide, 'id'> & { id?: number }) => {
    if (compoundData.id) {
      // Editing existing compound
      setCompounds(prev => prev.map(c => (c.id === compoundData.id ? { ...c, ...compoundData } as Pesticide : c)));
    } else {
      // Adding new compound
      const newCompound: Pesticide = {
        ...(compoundData as Omit<Pesticide, 'id'>),
        id: Math.max(...compounds.map(c => c.id), 0) + 1,
      };
      setCompounds(prev => [newCompound, ...prev]);
    }
    setCompoundToEdit(null);
    setActivePage('database');
  };

  const handleStartEdit = (compound: Pesticide) => {
    setCompoundToEdit(compound);
    setActivePage('add');
  };

  const handleDeleteCompound = (id: number) => {
    if (window.confirm('Are you sure you want to delete this compound?')) {
        setCompounds(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleImportCompounds = (importedCompounds: Pesticide[]) => {
    setCompounds(importedCompounds);
    alert('Data imported successfully!');
  };
  
  const handleNavigateToAdd = () => {
    setCompoundToEdit(null); // Ensure we are in "add" mode, not "edit"
    setActivePage('add');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <MainLayout activePage={activePage} setActivePage={setActivePage} onNavigateToAdd={handleNavigateToAdd}>
      {activePage === 'database' && (
        <DatabasePage 
          compounds={compounds} 
          onImport={handleImportCompounds}
          onEdit={handleStartEdit}
          onDelete={handleDeleteCompound}
        />
      )}
      {activePage === 'overview' && <OverviewPage compounds={compounds} setActivePage={setActivePage} onNavigateToAdd={handleNavigateToAdd} />}
      {activePage === 'add' && (
        <AddCompoundPage 
          onSaveCompound={handleSaveCompound} 
          existingPesticides={compounds}
          compoundToEdit={compoundToEdit}
        />
      )}
      {activePage === 'profile' && (
        <ProfilePage 
            compoundsCount={compounds.length}
            isGoogleIntegrated={isGoogleIntegrated}
            onToggleGoogleIntegration={handleToggleGoogleIntegration}
            onNavigate={setActivePage}
            onLogout={handleLogout}
            onDeleteAllData={handleDeleteAllData}
            theme={theme}
            onToggleTheme={handleToggleTheme}
        />
      )}
    </MainLayout>
  );
};

export default App;