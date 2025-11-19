
import React, { useState, useRef, useEffect } from 'react';
import { Pesticide, PesticideTag } from '../types';
import { InfoIcon, TargetIcon, PencilIcon, TrashIcon, MoreVerticalIcon } from './Icons';
import { getModeOfActionCategory } from '../lib/utils';

interface PesticideCardProps {
  pesticide: Pesticide;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const tagColors: Record<PesticideTag, string> = {
  SYSTEMIC: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  CONTACT: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  CURATIVE: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  PREVENTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  INGESTION: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

const ActionMenu: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
    setIsOpen(false);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700"
      >
        <MoreVerticalIcon className="h-5 w-5" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10">
          <button
            onClick={handleEdit}
            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <PencilIcon className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <TrashIcon className="h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};


const PesticideCard: React.FC<PesticideCardProps> = ({ pesticide, onViewDetails, onEdit, onDelete }) => {
  const moaInfo = getModeOfActionCategory(pesticide.modeOfAction);

  return (
    <div 
      onClick={onViewDetails}
      className="w-full text-left bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md hover:border-secondary focus-within:border-secondary focus-within:shadow-md cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{pesticide.name}</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {pesticide.tags.map(tag => (
              <span key={tag} className={`px-2 py-0.5 text-xs font-semibold rounded-full ${tagColors[tag]}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
            <ActionMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <InfoIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span><span className="font-semibold text-gray-700 dark:text-gray-300">Active Ingredient:</span> {pesticide.activeIngredient}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <InfoIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span><span className="font-semibold text-gray-700 dark:text-gray-300">Family:</span> {pesticide.family}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <InfoIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 dark:text-gray-300">IRAC/FRAC:</span>
              <span className="ml-1">{pesticide.irac}</span>
              <span className={`ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full ${moaInfo.styles.bg} ${moaInfo.styles.text}`}>
                  <span className={`h-2 w-2 rounded-full ${moaInfo.styles.dot}`}></span>
                  {moaInfo.category}
              </span>
            </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <TargetIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span><span className="font-semibold text-gray-700 dark:text-gray-300">Target Stage:</span> {pesticide.targetStage.join(', ')}</span>
        </div>
        {pesticide.chemicalDetails && (
            <div className="md:col-span-2 flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <InfoIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span><span className="font-semibold text-gray-700 dark:text-gray-300">Details:</span> {pesticide.chemicalDetails}</span>
            </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Targets:</p>
        <div className="flex flex-wrap gap-2">
          {pesticide.targets.map(target => (
            <span key={target} className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300">
              {target}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PesticideCard;