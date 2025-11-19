
import React from 'react';
import { XIcon, GoogleIcon, ArchiveIcon } from './Icons';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockFiles = [
    { name: 'agriphyt_backup_2024-10-26.json', size: '1.12 MB', date: 'Oct 26, 2024' },
    { name: 'agriphyt_backup_2024-09-15.json', size: '0.98 MB', date: 'Sep 15, 2024' },
    { name: 'agriphyt_backup_2024-08-01.json', size: '0.85 MB', date: 'Aug 1, 2024' },
];

const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <GoogleIcon className="h-6 w-6"/>
            <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Google Drive Storage</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Simulated application backups</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <div className="p-3 mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-500/30 rounded-lg text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Note:</strong> This is a simulation. In a real application, you could manage your actual Google Drive backups here.
            </div>
            <div className="space-y-3">
                {mockFiles.map(file => (
                    <div key={file.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex items-center">
                            <ArchiveIcon className="h-6 w-6 text-purple-600 mr-4"/>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{file.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{file.date}</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{file.size}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <button onClick={onClose} className="w-full bg-gray-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveModal;
