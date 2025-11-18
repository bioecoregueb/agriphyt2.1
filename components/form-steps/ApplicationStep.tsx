
import React from 'react';
import { Pesticide, PesticideTag } from '../../types';
import { SprayCanIcon } from '../Icons';

interface ApplicationStepProps {
  data: Partial<Pesticide>;
  updateData: (data: Partial<Pesticide>) => void;
}

const RadioCard: React.FC<{
    name: string, value: string, label: string, description: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ name, value, label, description, checked, onChange }) => (
    <label className={`block p-4 border rounded-lg cursor-pointer transition-all ${checked ? 'bg-green-50 dark:bg-primary/20 border-primary ring-2 ring-primary' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
        <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only"/>
        <p className="font-bold text-gray-800 dark:text-gray-100">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </label>
);

const CheckboxCard: React.FC<{
    value: string, label: string, description: string, checked: boolean, onChange: (value: string) => void
}> = ({ value, label, description, checked, onChange }) => (
     <label className={`block p-4 border rounded-lg cursor-pointer transition-all ${checked ? 'bg-green-50 dark:bg-primary/20 border-primary ring-2 ring-primary' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
        <input type="checkbox" checked={checked} onChange={() => onChange(value)} className="sr-only"/>
        <div className="flex items-start">
            <div className={`w-5 h-5 mr-4 mt-0.5 border-2 rounded flex-shrink-0 ${checked ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-500'}`}>
                {checked && <svg className="text-white w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6L9 17l-5-5"/></svg>}
            </div>
            <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{label}</p>
                {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
            </div>
        </div>
    </label>
);

const ApplicationStep: React.FC<ApplicationStepProps> = ({ data, updateData }) => {

    const handleApplicationTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as 'SYSTEMIC' | 'CONTACT';
        const otherType = value === 'SYSTEMIC' ? 'CONTACT' : 'SYSTEMIC';
        const newTags = (data.tags || []).filter(tag => tag !== otherType);
        if (!newTags.includes(value)) {
            newTags.push(value);
        }
        updateData({ tags: newTags });
    };

    const handleMultiSelectChange = (group: keyof Pesticide, value: string) => {
        const currentValues = (data[group] as string[] || []) as string[];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        updateData({ [group]: newValues });
    };

    const handleObjectiveChange = (value: string) => {
        const objectiveTags = data.tags || [];
        const newTags = objectiveTags.includes(value as PesticideTag)
            ? objectiveTags.filter(tag => tag !== value)
            : [...objectiveTags, value as PesticideTag];

        const filteredTags = newTags.filter(tag => ['CURATIVE', 'PREVENTIVE'].includes(tag));
        const otherTags = (data.tags || []).filter(tag => !['CURATIVE', 'PREVENTIVE'].includes(tag));
        
        updateData({ tags: [...otherTags, ...filteredTags] });
    };
  
  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col items-center text-center">
             <div className="p-3 bg-green-50 rounded-full mb-3">
                <SprayCanIcon className="h-8 w-8 text-primary"/>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Application</h3>
            <p className="text-gray-500 dark:text-gray-400">Specify application type and target information</p>
        </div>
        
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Type d'application *</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RadioCard name="applicationType" value="SYSTEMIC" label="Systémique" description="Absorbed and transported throughout plant tissues" checked={(data.tags || []).includes('SYSTEMIC')} onChange={handleApplicationTypeChange} />
                    <RadioCard name="applicationType" value="CONTACT" label="Contact" description="Acts on direct contact with target organism" checked={(data.tags || []).includes('CONTACT')} onChange={handleApplicationTypeChange} />
                </div>
            </div>
             <div>
                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Objectif *</h4>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select all that apply</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CheckboxCard value="CURATIVE" label="Curative" description="Treats existing problems or infections" checked={(data.tags || []).includes('CURATIVE')} onChange={handleObjectiveChange} />
                    <CheckboxCard value="PREVENTIVE" label="Preventive" description="Protects from future problems or infections" checked={(data.tags || []).includes('PREVENTIVE')} onChange={handleObjectiveChange} />
                </div>
            </div>
            <div>
                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Stade cible *</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select all that apply</p>
                <div className="space-y-3">
                    <CheckboxCard value="Œuf" label="Œuf" description="Egg stage of pest lifecycle" checked={(data.targetStage || []).includes('Œuf')} onChange={(val) => handleMultiSelectChange('targetStage', val)} />
                    <CheckboxCard value="Larve" label="Larve" description="Larval stage of pest lifecycle" checked={(data.targetStage || []).includes('Larve')} onChange={(val) => handleMultiSelectChange('targetStage', val)} />
                    <CheckboxCard value="Nymphe" label="Nymphe" description="Nymph stage of pest lifecycle" checked={(data.targetStage || []).includes('Nymphe')} onChange={(val) => handleMultiSelectChange('targetStage', val)} />
                    <CheckboxCard value="Adulte" label="Adulte" description="Adult stage of pest lifecycle" checked={(data.targetStage || []).includes('Adulte')} onChange={(val) => handleMultiSelectChange('targetStage', val)} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default ApplicationStep;