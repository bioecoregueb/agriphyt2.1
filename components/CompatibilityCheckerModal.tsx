
import React, { useState } from 'react';
import { Pesticide } from '../types';
import { XIcon, CheckIcon, FlaskConicalIcon, InfoIcon, TrashIcon } from './Icons';

interface CompatibilityCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  compounds: Pesticide[];
}

const CompoundSelectItem: React.FC<{
  compound: Pesticide;
  isSelected: boolean;
  onSelect: (id: number) => void;
}> = ({ compound, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(compound.id)}
    className={`p-4 border rounded-lg cursor-pointer transition-all ${
      isSelected ? 'border-secondary bg-purple-50 dark:bg-secondary/20 ring-2 ring-secondary' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="font-bold text-gray-800 dark:text-gray-100">{compound.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{compound.activeIngredient}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">IRAC: {compound.irac}</p>
      </div>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-secondary' : 'border-2 border-gray-300 dark:border-gray-500'}`}>
        {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
      </div>
    </div>
  </div>
);

const CompatibilityCheckerModal: React.FC<CompatibilityCheckerModalProps> = ({ isOpen, onClose, compounds }) => {
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelect = (id: number) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-secondary/10 p-2 rounded-full">
                <FlaskConicalIcon className="h-6 w-6 text-secondary"/>
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Compatibility Checker</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Check pesticide combinations for safety and efficacy</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
            <div className="flex">
              <div className="py-1"><InfoIcon className="h-5 w-5 text-blue-500 mr-3" /></div>
              <div>
                <h3 className="font-bold text-blue-800 dark:text-blue-300">How to use</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300/80">
                  Select 2 or more compounds to check their compatibility. The system will analyze chemical families, IRAC codes, modes of action, and resistance management considerations.
                </p>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Select Compounds to Check</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compounds.map(compound => (
              <CompoundSelectItem
                key={compound.id}
                compound={compound}
                isSelected={selected.includes(compound.id)}
                onSelect={handleSelect}
              />
            ))}
          </div>

          {selected.length < 2 && (
             <div className="text-center mt-8 py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="mx-auto h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-gray-400">
                    <TrashIcon className="h-6 w-6"/>
                </div>
                <h4 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Select Compounds</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose at least 2 compounds to check compatibility.</p>
            </div>
          )}
        </div>
        
        {selected.length >= 2 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 mt-auto">
                <button
                    disabled={selected.length < 2}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Check Compatibility ({selected.length} selected)
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CompatibilityCheckerModal;