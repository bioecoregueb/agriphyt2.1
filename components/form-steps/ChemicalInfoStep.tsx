import React from 'react';
import { Pesticide } from '../../types';
import { BeakerIcon } from '../Icons';

interface ChemicalInfoStepProps {
  data: Partial<Pesticide>;
  updateData: (data: Partial<Pesticide>) => void;
  families: string[];
  modesOfAction: string[];
}

const formFieldClasses = "w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400";
const formLabelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

const ChemicalInfoStep: React.FC<ChemicalInfoStepProps> = ({ data, updateData, families, modesOfAction }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
       <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-primary/10 rounded-full mb-3">
                <BeakerIcon className="h-8 w-8 text-primary"/>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Chemical Info</h3>
            <p className="text-gray-500 dark:text-gray-400">Enter the chemical compound details</p>
        </div>

      <div className="max-w-xl mx-auto space-y-4">
        <div>
          <label htmlFor="activeIngredient" className={formLabelClasses}>Active Ingredient *</label>
          <input
              type="text"
              id="activeIngredient"
              name="activeIngredient"
              value={data.activeIngredient || ''}
              onChange={handleChange}
              className={formFieldClasses}
              placeholder="e.g., Glyphosate"
              required
            />
        </div>

        <div>
          <label htmlFor="family" className={formLabelClasses}>Chemical Family *</label>
          <select
            id="family"
            name="family"
            value={data.family || ''}
            onChange={handleChange}
            className={formFieldClasses}
            required
          >
            <option value="" disabled>Select chemical family...</option>
            {families.map(family => <option key={family} value={family}>{family}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="irac" className={formLabelClasses}>IRAC Code *</label>
          <input
            type="text"
            id="irac"
            name="irac"
            value={data.irac || ''}
            onChange={handleChange}
            className={formFieldClasses}
            placeholder="e.g., 9A"
            required
          />
        </div>

        <div>
          <label htmlFor="modeOfAction" className={formLabelClasses}>General Mode of Action *</label>
          <select
            id="modeOfAction"
            name="modeOfAction"
            value={data.modeOfAction || ''}
            onChange={handleChange}
            className={formFieldClasses}
            required
          >
            <option value="" disabled>Select or add general mode of action...</option>
            {modesOfAction.map(mode => <option key={mode} value={mode}>{mode}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="logP" className={formLabelClasses}>LogP</label>
                <input
                    type="text"
                    id="logP"
                    name="logP"
                    value={data.logP || ''}
                    onChange={handleChange}
                    className={formFieldClasses}
                    placeholder="e.g., 3.72"
                />
            </div>
            <div>
                <label htmlFor="ph" className={formLabelClasses}>pH</label>
                <input
                    type="text"
                    id="ph"
                    name="ph"
                    value={data.ph || ''}
                    onChange={handleChange}
                    className={formFieldClasses}
                    placeholder="e.g., 6.0-8.0"
                />
            </div>
        </div>

        <div className="flex gap-4 pt-4">
            <button type="button" className="w-full text-center py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Scan Label</button>
            <button type="button" className="w-full text-center py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">QR Code</button>
        </div>
      </div>
    </div>
  );
};

export default ChemicalInfoStep;