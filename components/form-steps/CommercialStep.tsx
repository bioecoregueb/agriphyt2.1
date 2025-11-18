import React, { useState } from 'react';
import { Pesticide } from '../../types';
import { StoreIcon, UploadCloudIcon } from '../Icons';
import { targetPests } from '../../data/mockData';

interface CommercialStepProps {
  data: Partial<Pesticide>;
  updateData: (data: Partial<Pesticide>) => void;
}

const formFieldClasses = "w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400";
const formLabelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

const categoryColors: { [key: string]: string } = {
  Fungal: 'bg-red-100 text-red-700',
  Bacterial: 'bg-orange-100 text-orange-700',
  Viral: 'bg-yellow-100 text-yellow-700',
  Insect: 'bg-blue-100 text-blue-700',
  Mite: 'bg-purple-100 text-purple-700',
  Nematode: 'bg-indigo-100 text-indigo-700',
  Weed: 'bg-green-100 text-green-700',
};

const CommercialStep: React.FC<CommercialStepProps> = ({ data, updateData }) => {
  const [filter, setFilter] = useState('All');
  const [customTarget, setCustomTarget] = useState('');

  const handleTargetChange = (targetName: string) => {
    const currentTargets = data.targets || [];
    const newTargets = currentTargets.includes(targetName)
      ? currentTargets.filter(t => t !== targetName)
      : [...currentTargets, targetName];
    updateData({ targets: newTargets });
  };
  
  const handleAddCustomTarget = () => {
    if (customTarget && !(data.targets || []).includes(customTarget)) {
        updateData({ targets: [...(data.targets || []), customTarget]});
        setCustomTarget('');
    }
  };

  const filteredPests = filter === 'All' ? targetPests : targetPests.filter(p => p.category === filter);
  const categories = ['All', ...Object.keys(categoryColors)];

  return (
     <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col items-center text-center">
             <div className="p-3 bg-green-50 rounded-full mb-3">
                <StoreIcon className="h-8 w-8 text-primary"/>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Commercial</h3>
            <p className="text-gray-500 dark:text-gray-400">Enter commercial details and target diseases/pests</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <label htmlFor="name" className={formLabelClasses}>Nom commercial *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={data.name || ''}
                onChange={(e) => updateData({ name: e.target.value })}
                className={formFieldClasses}
                placeholder="e.g., Roundup Max"
                required
              />
            </div>
            <div>
              <label htmlFor="dosage" className={formLabelClasses}>Dosage *</label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                value={data.dosage || ''}
                onChange={(e) => updateData({ dosage: e.target.value })}
                className={formFieldClasses}
                placeholder="e.g., 2.5L/ha"
                required
              />
            </div>

            <div>
                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">CIBLE (Target Diseases/Pests)</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1 text-sm font-semibold rounded-full ${filter === cat ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700">
                    {filteredPests.map(pest => (
                        <label key={pest.name} className="flex items-start p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                             <input type="checkbox" checked={(data.targets || []).includes(pest.name)} onChange={() => handleTargetChange(pest.name)} className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded mt-0.5" />
                             <div className="ml-3 text-sm">
                                <span className="font-medium text-gray-900 dark:text-gray-200">{pest.name}</span>
                                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${categoryColors[pest.category]}`}>{pest.category}</span>
                                <p className="text-gray-500 dark:text-gray-400">{pest.description}</p>
                             </div>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="customTarget" className={formLabelClasses}>Add Custom Target</label>
                <div className="flex gap-2">
                    <input type="text" id="customTarget" value={customTarget} onChange={(e) => setCustomTarget(e.target.value)} className={formFieldClasses} placeholder="Enter custom disease or pest name..."/>
                    <button type="button" onClick={handleAddCustomTarget} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">Add</button>
                </div>
            </div>

            <div>
                <label htmlFor="notes" className={formLabelClasses}>Additional notes about the compound...</label>
                <textarea id="notes" name="notes" value={data.notes || ''} onChange={(e) => updateData({ notes: e.target.value })} className={formFieldClasses} rows={3}></textarea>
            </div>
            
            <div>
                 <label className={formLabelClasses}>Product Label</label>
                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-secondary hover:text-secondary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-secondary">
                                <span>Upload product label image</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CommercialStep;