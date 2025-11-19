
import React, { useState, useRef } from 'react';
import { Page } from '../types';
import GoogleDriveModal from '../components/GoogleDriveModal';
// Fix: Import `CheckCircle2Icon` to resolve reference errors.
import { 
    UserIcon, MailIcon, GoogleIcon, DatabaseIcon, PlusCircleIcon, SearchIcon, SettingsIcon,
    BellIcon, MoonIcon, GlobeIcon, AlertTriangleIcon, Trash2Icon, LogOutIcon, UserCircleIcon, 
    PencilIcon, ArchiveIcon, CheckIcon, UnplugIcon, CheckCircle2Icon, SunIcon, UploadCloudIcon
} from '../components/Icons';

interface ProfilePageProps {
    compoundsCount: number;
    isGoogleIntegrated: boolean;
    onToggleGoogleIntegration: () => void;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
    onDeleteAllData: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    onImportIracPdf: (file: File) => Promise<void>;
    showNotification: (message: string, type?: 'success' | 'error') => void;
}

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<{ icon: React.ReactNode, title: string }> = ({ icon, title }) => (
  <div className="flex items-center text-gray-700 dark:text-gray-200 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
    {icon}
    <h3 className="font-bold text-lg ml-3">{title}</h3>
  </div>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ compoundsCount, isGoogleIntegrated, onToggleGoogleIntegration, onNavigate, onLogout, onDeleteAllData, theme, onToggleTheme, onImportIracPdf, showNotification }) => {
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === 'application/pdf') {
          setIsImporting(true);
          try {
              await onImportIracPdf(file);
          } catch (error) {
              console.error("Import failed", error);
          } finally {
              setIsImporting(false);
          }
      }
      // Reset file input
      if (event.target) event.target.value = '';
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleClearCache = () => {
    alert('Application cache has been cleared!');
  };

  return (
    <>
    <div className="space-y-6 animate-fadeIn">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex items-center justify-between">
            <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full">
                    <UserCircleIcon className="h-8 w-8 text-primary"/>
                </div>
                <div className="ml-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Profile & Settings</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account and application preferences</p>
                </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg text-sm hover:bg-primary-dark">
                <PencilIcon className="h-4 w-4"/>
                <span className="hidden sm:inline">Edit Profile</span>
            </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardTitle icon={<UserIcon className="h-5 w-5"/>} title="Personal Information" />
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Full Name</p>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">sloumatagougui</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Email Address</p>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">sloumatagougui@gmail.com</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Role</p>
                            <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary-dark text-xs font-medium rounded-full">Agronomist</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardTitle icon={<UploadCloudIcon className="h-5 w-5"/>} title="Data Sources" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Import classification data from official documents to improve data entry accuracy.</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="application/pdf"
                        className="hidden"
                    />
                    <button 
                        onClick={triggerFileSelect}
                        disabled={isImporting}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-50 text-purple-700 font-semibold rounded-lg text-sm hover:bg-purple-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
                    >
                       {isImporting ? 'Processing PDF...' : 'Import IRAC PDF'}
                    </button>
                </Card>

                <Card>
                    <CardTitle icon={<GoogleIcon className="h-5 w-5"/>} title="Google Integration" />
                    {!isGoogleIntegrated ? (
                        <>
                            <button onClick={onToggleGoogleIntegration} className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <GoogleIcon className="h-6 w-6 mr-3" />
                                <div>
                                    <span className="font-bold">Verify with Gmail</span>
                                    <span className="text-sm text-white/80 ml-1">+ Enable Drive Storage</span>
                                </div>
                            </button>
                            <ul className="text-xs text-gray-500 dark:text-gray-400 mt-3 space-y-1 pl-2">
                                <li className="flex items-center"><CheckIcon className="h-4 w-4 mr-2 text-gray-400"/>Confirms your Gmail account</li>
                                <li className="flex items-center"><CheckIcon className="h-4 w-4 mr-2 text-gray-400"/>Enables cloud backup & sync</li>
                                <li className="flex items-center"><CheckIcon className="h-4 w-4 mr-2 text-gray-400"/>Secure OAuth 2.0 authentication</li>
                            </ul>
                        </>
                    ) : (
                        <div className="space-y-4">
                             <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 rounded-lg text-center">
                                <CheckCircle2Icon className="h-8 w-8 text-primary mx-auto mb-2"/>
                                <h4 className="font-bold text-green-800 dark:text-green-300">Google Account Connected</h4>
                                <p className="text-sm text-green-700 dark:text-green-400">sloumatagougui@gmail.com</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setShowDriveModal(true)} className="w-full bg-blue-100 text-blue-700 font-semibold py-2 rounded-lg text-sm hover:bg-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20">
                                    Show Drive Storage
                                </button>
                                <button onClick={onToggleGoogleIntegration} className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-700 font-semibold py-2 rounded-lg text-sm hover:bg-red-200 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20">
                                    <UnplugIcon className="h-4 w-4" /> Disconnect
                                </button>
                            </div>
                        </div>
                    )}
                </Card>

                <Card>
                    <CardTitle icon={<SettingsIcon className="h-5 w-5"/>} title="Application Preferences" />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <GlobeIcon className="h-5 w-5 text-gray-500 mr-3"/>
                                <div>
                                    <p className="font-semibold text-gray-700 dark:text-gray-200">Language</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Choose your preferred language</p>
                                </div>
                            </div>
                            <select className="border border-gray-300 rounded-md py-1 px-2 text-sm dark:bg-gray-700 dark:border-gray-600">
                                <option>English</option>
                                <option>Français</option>
                            </select>
                        </div>
                         <div className="flex items-center justify-between">
                             <div className="flex items-center">
                                {theme === 'light' ? 
                                    <SunIcon className="h-5 w-5 text-gray-500 mr-3"/> :
                                    <MoonIcon className="h-5 w-5 text-gray-500 mr-3"/>
                                }
                                <div>
                                    <p className="font-semibold text-gray-700 dark:text-gray-200">Theme</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" checked={theme === 'dark'} onChange={onToggleTheme} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <BellIcon className="h-5 w-5 text-gray-500 mr-3"/>
                                <div>
                                    <p className="font-semibold text-gray-700 dark:text-gray-200">Notifications</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Receive app notifications</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 font-semibold">Not set</span>
                                <button className="px-3 py-1 bg-primary text-white font-semibold rounded-md text-sm hover:bg-primary-dark">Enable</button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            
            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardTitle icon={<DatabaseIcon className="h-5 w-5"/>} title="Your Data" />
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-baseline">
                            <span className="text-gray-500 dark:text-gray-400">Total Compounds</span>
                            <span className="font-bold text-xl text-gray-800 dark:text-gray-100">{compoundsCount}</span>
                        </div>
                         <div className="flex justify-between items-baseline">
                            <span className="text-gray-500 dark:text-gray-400">Storage Used</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-100">1.36 MB</span>
                        </div>
                         <div className="flex justify-between items-baseline">
                            <span className="text-gray-500 dark:text-gray-400">Storage Quota</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-100">142563.41 MB</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                        <button 
                            disabled={!isGoogleIntegrated} 
                            onClick={() => alert('Data backup to Google Drive simulated!')}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-purple-50 text-purple-700 font-semibold rounded-lg text-sm hover:bg-purple-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
                            title={!isGoogleIntegrated ? "Requires Google Integration" : "Backup data to Drive"}
                        >
                           <ArchiveIcon className="h-4 w-4"/> Backup & Restore
                        </button>
                        <button onClick={handleClearCache} className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg text-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                            <Trash2Icon className="h-4 w-4"/> Clear Cache
                        </button>
                    </div>
                </Card>
                 <Card>
                    <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <button onClick={() => onNavigate('add')} className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-800 font-semibold rounded-lg hover:bg-green-100 dark:bg-green-500/10 dark:text-green-300 dark:hover:bg-green-500/20">
                            <PlusCircleIcon className="h-5 w-5"/> Add Compound
                        </button>
                        <button onClick={() => onNavigate('database')} className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-800 font-semibold rounded-lg hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20">
                            <SearchIcon className="h-5 w-5"/> Search Database
                        </button>
                    </div>
                </Card>
                <Card className="border-red-300 bg-red-50/50 dark:bg-red-900/10 dark:border-red-500/30">
                     <div className="flex items-center text-red-600 dark:text-red-400 mb-4 pb-3 border-b border-red-200 dark:border-red-500/30">
                        <AlertTriangleIcon className="h-5 w-5"/>
                        <h3 className="font-bold text-lg ml-3">Danger Zone</h3>
                    </div>
                    <div className="space-y-2">
                        <button onClick={onDeleteAllData} className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-red-300 text-red-600 font-semibold rounded-lg text-sm hover:bg-red-50 dark:bg-gray-800 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-900/20">
                           <Trash2Icon className="h-4 w-4"/> Delete All Data
                        </button>
                        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-red-300 text-red-600 font-semibold rounded-lg text-sm hover:bg-red-50 dark:bg-gray-800 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-900/20">
                            <LogOutIcon className="h-4 w-4"/> Log Out
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    </div>
    <GoogleDriveModal isOpen={showDriveModal} onClose={() => setShowDriveModal(false)} />
    </>
  );
};

export default ProfilePage;
