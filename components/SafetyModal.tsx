import React from 'react';
import { XIcon, ShieldIcon } from './Icons';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SafetyGuideline: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="font-bold text-gray-800 dark:text-gray-100">{title}</h4>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mt-1">
            {children}
        </ul>
    </div>
);

const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-full">
                <ShieldIcon className="h-6 w-6 text-red-600"/>
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Safety Guidelines</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Best practices for handling chemicals.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto text-sm space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
                <p className="font-semibold text-yellow-800 dark:text-yellow-300">Always consult product labels before mixing or applying chemicals. When in doubt, contact a professional.</p>
            </div>

            <SafetyGuideline title="Personal Protective Equipment (PPE)">
                <li>Wear appropriate PPE when handling any chemical combinations, including gloves, goggles, and respiratory protection.</li>
                <li>Ensure PPE is clean and in good condition before each use.</li>
            </SafetyGuideline>

            <SafetyGuideline title="Mixing and Application">
                <li>Perform a jar test with small quantities before large-scale mixing to check for physical incompatibility.</li>
                <li>Never mix chemicals in an unventilated area.</li>
                <li>Apply chemicals during calm weather conditions to avoid drift.</li>
            </SafetyGuideline>

            <SafetyGuideline title="Storage">
                <li>Store incompatible chemicals in separate, secure, and well-ventilated locations.</li>
                <li>Keep chemicals in their original containers with labels intact.</li>
                <li>Ensure storage areas are locked and inaccessible to children and animals.</li>
            </SafetyGuideline>

            <SafetyGuideline title="Emergency Procedures">
                <li>Know the location of safety showers, eyewash stations, and first aid kits.</li>
                <li>Have emergency contact numbers readily available.</li>
                <li>In case of a spill, follow the cleanup procedures outlined in the Safety Data Sheet (SDS).</li>
            </SafetyGuideline>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <button onClick={onClose} className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                Understood
            </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyModal;