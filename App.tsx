
import React, { useState, useCallback, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import DatabasePage from './pages/DatabasePage';
import OverviewPage from './pages/OverviewPage';
import AddCompoundPage from './pages/AddCompoundPage';
import ProfilePage from './pages/ProfilePage';
import ConfirmationModal from './components/ConfirmationModal';
import RulesManagerModal from './components/RulesManagerModal';
import { Page, Pesticide, IracData } from './types';
import { pesticides as mockPesticides } from './data/mockData';
import { parseIracPdf } from './lib/gemini';


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState<Page>('overview');
  
  const [compounds, setCompounds] = useState<Pesticide[]>(mockPesticides);

  const [isGoogleIntegrated, setIsGoogleIntegrated] = useState(false);
  const [compoundToEdit, setCompoundToEdit] = useState<Pesticide | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: () => {},
  });
  
  const [iracData, setIracData] = useState<IracData[] | null>(null);

  // Theme effect
  useEffect(() => {
    const savedCompounds = localStorage.getItem('pesticides');
    if (savedCompounds) {
        setCompounds(JSON.parse(savedCompounds));
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme as 'light' | 'dark');
    }

    const savedIracData = localStorage.getItem('iracData');
    if (savedIracData) {
        setIracData(JSON.parse(savedIracData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pesticides', JSON.stringify(compounds));
  }, [compounds]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (iracData) {
        localStorage.setItem('iracData', JSON.stringify(iracData));
    }
  }, [iracData]);


  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };

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
      setConfirmationModal({
          isOpen: true,
          title: 'Delete All Data',
          message: 'Are you sure you want to delete all compound data? This action is permanent and cannot be undone.',
          onConfirm: () => {
              setCompounds([]);
              showNotification('All compound data has been deleted.', 'success');
          }
      });
  }, []);
  
  const handleToggleGoogleIntegration = () => {
    if (!isGoogleIntegrated) {
        // Simulate a successful connection
        showNotification("Successfully connected to Google account!");
    }
    setIsGoogleIntegrated(prev => !prev);
  };

  const handleClearCache = () => {
      setConfirmationModal({
          isOpen: true,
          title: 'Clear Application Cache',
          message: 'Are you sure you want to clear the application cache? This will reset all data to the default demonstration set.',
          onConfirm: () => {
              localStorage.removeItem('pesticides');
              localStorage.removeItem('theme');
              localStorage.removeItem('iracData');
              setCompounds(mockPesticides);
              setTheme('light');
              setIracData(null);
              showNotification('Cache cleared and data reset successfully.', 'success');
          }
      });
  };

  const handleSaveCompound = (compoundData: Omit<Pesticide, 'id'> & { id?: number }) => {
    if (compoundData.id) {
      // Editing existing compound
      setCompounds(prev => prev.map(c => (c.id === compoundData.id ? { ...c, ...compoundData } as Pesticide : c)));
      showNotification(`Compound "${compoundData.name}" updated successfully!`, 'success');
    } else {
      // Adding new compound
      const newCompound: Pesticide = {
        ...(compoundData as Omit<Pesticide, 'id'>),
        id: Math.max(...compounds.map(c => c.id), 0) + 1,
      };
      setCompounds(prev => [newCompound, ...prev]);
      showNotification(`Compound "${newCompound.name}" added successfully!`, 'success');
    }
    setCompoundToEdit(null);
    setActivePage('database');
  };

  const handleStartEdit = (compound: Pesticide) => {
    setCompoundToEdit(compound);
    setActivePage('add');
  };
  
  const requestDeleteCompound = (id: number) => {
    const compound = compounds.find(c => c.id === id);
    if (compound) {
      setConfirmationModal({
        isOpen: true,
        title: `Delete ${compound.name}`,
        message: 'Are you sure you want to delete this compound? This action cannot be undone.',
        onConfirm: () => handleDeleteCompound(id),
      });
    }
  };

  const handleDeleteCompound = (id: number) => {
    const compoundToDelete = compounds.find(c => c.id === id);
    if (compoundToDelete) {
        setCompounds(prev => prev.filter(c => c.id !== id));
        showNotification(`Compound "${compoundToDelete.name}" has been deleted.`, 'success');
    }
  };

  const handleImportCompounds = (importedCompounds: Pesticide[]) => {
    setCompounds(importedCompounds);
    showNotification('Data imported successfully!', 'success');
  };
  
  const handleNavigateToAdd = () => {
    setCompoundToEdit(null); // Ensure we are in "add" mode, not "edit"
    setActivePage('add');
  };

  const closeConfirmationModal = () => {
      setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  };

  const handleImportIracPdf = async (pdfFile: File): Promise<void> => {
      try {
          const data = await parseIracPdf(pdfFile);
          setIracData(data);
          showNotification(`Successfully imported ${data.length} IRAC classifications.`, 'success');
      } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
          showNotification(errorMessage, 'error');
          throw error; // re-throw to let the caller know about the failure
      }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <MainLayout 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onNavigateToAdd={handleNavigateToAdd}
        notification={notification}
        onDismissNotification={() => setNotification(null)}
        onOpenRules={() => setShowRulesModal(true)}
      >
        {activePage === 'database' && (
          <DatabasePage 
            compounds={compounds} 
            onImport={handleImportCompounds}
            onEdit={handleStartEdit}
            onDeleteRequest={requestDeleteCompound}
            showNotification={showNotification}
            onOpenRules={() => setShowRulesModal(true)}
          />
        )}
        {activePage === 'overview' && <OverviewPage compounds={compounds} setActivePage={setActivePage} onNavigateToAdd={handleNavigateToAdd} showNotification={showNotification} />}
        {activePage === 'add' && (
          <AddCompoundPage 
            onSaveCompound={handleSaveCompound} 
            existingPesticides={compounds}
            compoundToEdit={compoundToEdit}
            showNotification={showNotification}
            iracData={iracData}
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
              onImportIracPdf={handleImportIracPdf}
              showNotification={showNotification}
              onClearCache={handleClearCache}
          />
        )}
      </MainLayout>
      <RulesManagerModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        pesticides={compounds}
      />
      <ConfirmationModal 
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={() => {
            confirmationModal.onConfirm();
            closeConfirmationModal();
        }}
        title={confirmationModal.title}
        message={confirmationModal.message}
      />
    </>
  );
};

export default App;
