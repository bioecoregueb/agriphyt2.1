
import React, { useState, useEffect } from 'react';
import { Pesticide, PesticideType, IracData } from '../../types';
import { BeakerIcon, BugIcon, MicroscopeIcon } from '../Icons';
import { getCodeLabel } from '../../lib/utils';

interface ChemicalInfoStepProps {
  data: Partial<Pesticide>;
  updateData: (data: Partial<Pesticide>) => void;
  families: string[];
  modesOfAction: string[];
  iracData: IracData[] | null;
}

const formFieldClasses = "w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400";
const formLabelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

const TypeCard: React.FC<{
    value: PesticideType, label: string, icon: React.ReactNode, selected: boolean, onSelect: (value: PesticideType) => void
}> = ({ value, label, icon, selected, onSelect }) => (
    <div onClick={() => onSelect(value)} className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${selected ? 'bg-green-50 dark:bg-primary/20 border-primary ring-2 ring-primary' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
        {icon}
        <p className="font-bold text-gray-800 dark:text-gray-100 mt-2">{label}</p>
    </div>
);

const ChemicalInfoStep: React.FC<ChemicalInfoStepProps> = ({ data, updateData, families, modesOfAction, iracData }) => {
  const [isAddingFamily, setIsAddingFamily] = useState(false);
  const [isAddingMode, setIsAddingMode] = useState(false);

  useEffect(() => {
      if (data.family && !families.includes(data.family)) {
          setIsAddingFamily(true);
      }
      if (data.modeOfAction && !modesOfAction.includes(data.modeOfAction)) {
          setIsAddingMode(true);
      }
  }, [data.family, data.modeOfAction, families, modesOfAction]);

  const handleFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '__add_new__') {
        setIsAddingFamily(true);
        updateData({ family: '' });
    } else {
        setIsAddingFamily(false);
        updateData({ family: value });
    }
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '__add_new__') {
        setIsAddingMode(true);
        updateData({ modeOfAction: '' });
    } else {
        setIsAddingMode(false);
        updateData({ modeOfAction: value });
    }
  };

  const handleIracChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedCode = e.target.value;
      const iracEntry = iracData?.find(d => d.code === selectedCode);
      if (iracEntry) {
          updateData({ irac: iracEntry.code, modeOfAction: iracEntry.modeOfAction });
      } else {
          updateData({ irac: selectedCode, modeOfAction: '' });
      }
  };

  const isModeOfActionLocked = !!(iracData && data.irac && iracData.some(d => d.code === data.irac));

  const getCodePlaceholder = () => {
      switch (data.type) {
          case 'Insecticide': return 'e.g., 9A';
          case 'Fongicide': return 'e.g., 3A';
          default: return 'e.g., Code';
      }
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
          <label className={formLabelClasses}>Type of Active Ingredient *</label>
          <div className="grid grid-cols-2 gap-4">
              <TypeCard value="Insecticide" label="Insecticide" icon={<BugIcon className="h-7 w-7 text-red-500"/>} selected={data.type === 'Insecticide'} onSelect={(v) => updateData({ type: v })} />
              <TypeCard value="Fongicide" label="Fongicide" icon={<MicroscopeIcon className="h-7 w-7 text-blue-500"/>} selected={data.type === 'Fongicide'} onSelect={(v) => updateData({ type: v })} />
          </div>
        </div>

        <div>
          <label htmlFor="activeIngredient" className={formLabelClasses}>Active Ingredient *</label>
          <input
              type="text"
              id="activeIngredient"
              name="activeIngredient"
              value={data.activeIngredient || ''}
              onChange={(e) => updateData({ activeIngredient: e.target.value })}
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
            value={isAddingFamily ? '__add_new__' : data.family || ''}
            onChange={handleFamilyChange}
            className={formFieldClasses}
            required
          >
            <option value="" disabled>Select chemical family...</option>
            {families.map(family => <option key={family} value={family}>{family}</option>)}
            <option value="__add_new__">Add New...</option>
          </select>
          {isAddingFamily && (
            <input
              type="text"
              value={data.family || ''}
              onChange={(e) => updateData({ family: e.target.value })}
              className={`${formFieldClasses} mt-2`}
              placeholder="Enter new chemical family"
              autoFocus
            />
          )}
        </div>

        <div>
          <label htmlFor="irac" className={formLabelClasses}>{getCodeLabel(data.type)} *</label>
          {iracData ? (
            <select
                id="irac"
                name="irac"
                value={data.irac || ''}
                onChange={handleIracChange}
                className={formFieldClasses}
                required
            >
                <option value="" disabled>Select {getCodeLabel(data.type)}...</option>
                {iracData.map(item => <option key={item.code} value={item.code}>{item.code} - {item.modeOfAction.substring(0, 40)}...</option>)}
            </select>
          ) : (
            <input
                type="text"
                id="irac"
                name="irac"
                value={data.irac || ''}
                onChange={(e) => updateData({ irac: e.target.value })}
                className={formFieldClasses}
                placeholder={`${getCodePlaceholder()} (Import PDF for options)`}
                required
            />
          )}
        </div>

        <div>
            <label htmlFor="chemicalDetails" className={formLabelClasses}>Details</label>
            <input
                type="text"
                id="chemicalDetails"
                name="chemicalDetails"
                value={data.chemicalDetails || ''}
                onChange={(e) => updateData({ chemicalDetails: e.target.value })}
                className={formFieldClasses}
                placeholder="Enter additional chemical details..."
            />
        </div>

        <div>
            <label htmlFor="modeOfAction" className={formLabelClasses}>General Mode of Action *</label>
            {isModeOfActionLocked ? (
                <input
                    type="text"
                    id="modeOfAction"
                    name="modeOfAction"
                    value={data.modeOfAction || ''}
                    className={`${formFieldClasses} bg-gray-100 dark:bg-gray-800`}
                    readOnly
                />
            ) : (
                <>
                <select
                    id="modeOfAction"
                    name="modeOfAction"
                    value={isAddingMode ? '__add_new__' : data.modeOfAction || ''}
                    onChange={handleModeChange}
                    className={formFieldClasses}
                    required
                >
                    <option value="" disabled>Select or add general mode of action...</option>
                    {modesOfAction.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                    <option value="__add_new__">Add New...</option>
                </select>
                {isAddingMode && (
                    <input
                    type="text"
                    value={data.modeOfAction || ''}
                    onChange={(e) => updateData({ modeOfAction: e.target.value })}
                    className={`${formFieldClasses} mt-2`}
                    placeholder="Enter new mode of action"
                    autoFocus
                    />
                )}
                </>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="logP" className={formLabelClasses}>LogP</label>
                <input
                    type="text"
                    id="logP"
                    name="logP"
                    value={data.logP || ''}
                    onChange={(e) => updateData({ logP: e.target.value })}
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
                    onChange={(e) => updateData({ ph: e.target.value })}
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