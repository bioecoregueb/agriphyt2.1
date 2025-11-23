
import React, { useMemo } from 'react';
import { Pesticide, PesticideTag, TargetStageEvaluation } from '../../types';
import { SprayCanIcon, StarIcon } from '../Icons';

interface ApplicationStepProps {
  data: Partial<Pesticide>;
  updateData: (data: Partial<Pesticide>) => void;
}

const SelectableCard: React.FC<{
    label: string, description: string, checked: boolean, onChange: () => void
}> = ({ label, description, checked, onChange }) => (
    <div onClick={onChange} className={`block p-4 border rounded-lg cursor-pointer transition-all ${checked ? 'bg-green-50 dark:bg-primary/20 border-primary ring-2 ring-primary' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
        <div className="flex justify-between items-center h-full">
            <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            {checked && <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>}
        </div>
    </div>
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

const StageRatingCard: React.FC<{
    value: string;
    label: string;
    description: string;
    evaluation?: TargetStageEvaluation;
    onUpdate: (evalData: TargetStageEvaluation | null) => void;
}> = ({ value, label, description, evaluation, onUpdate }) => {
    const isChecked = !!evaluation;
    const rating = evaluation?.rating || 0;

    const handleCheckboxChange = () => {
        if (isChecked) {
            onUpdate(null);
        } else {
            onUpdate({ stage: value, rating: 5 }); // Default to 5 stars
        }
    };

    const handleRatingChange = (newRating: number, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent toggling the checkbox
        e.stopPropagation();
        if (isChecked) {
            onUpdate({ stage: value, rating: newRating });
        }
    };

    return (
        <div className={`block p-4 border rounded-lg transition-all ${isChecked ? 'bg-green-50 dark:bg-primary/20 border-primary ring-2 ring-primary' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
            <div className="flex items-start justify-between cursor-pointer" onClick={handleCheckboxChange}>
                <div className="flex items-start">
                    <div className={`w-5 h-5 mr-4 mt-0.5 border-2 rounded flex-shrink-0 ${isChecked ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-500'}`}>
                        {isChecked && <svg className="text-white w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6L9 17l-5-5"/></svg>}
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100">{label}</p>
                        {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
                    </div>
                </div>
            </div>
            
            {isChecked && (
                <div className="mt-3 pl-9 border-t border-gray-200 dark:border-gray-600 pt-2 flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Efficacy:</span>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={(e) => handleRatingChange(star, e)}
                                className="focus:outline-none transition-transform active:scale-110"
                            >
                                <StarIcon 
                                    className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`} 
                                    fill={star <= rating}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const ApplicationStep: React.FC<ApplicationStepProps> = ({ data, updateData }) => {

    const toggleApplicationTag = (tag: PesticideTag) => {
        const currentTags = data.tags || [];
        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag];
        updateData({ tags: newTags });
    };

    const handleStageUpdate = (stageValue: string, evaluation: TargetStageEvaluation | null) => {
        const currentStages = data.targetStage || [];
        let newStages: TargetStageEvaluation[];

        if (evaluation === null) {
            // Remove
            newStages = currentStages.filter(s => s.stage !== stageValue);
        } else {
            // Add or Update
            const exists = currentStages.some(s => s.stage === stageValue);
            if (exists) {
                newStages = currentStages.map(s => s.stage === stageValue ? evaluation : s);
            } else {
                newStages = [...currentStages, evaluation];
            }
        }
        updateData({ targetStage: newStages });
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

    // Stage configuration based on pesticide type
    const stageOptions = useMemo(() => {
        if (data.type === 'Fongicide') {
            return [
                { value: 'Oomycètes', label: 'Oomycètes', description: 'Mildiou, Pythium, Phytophthora' },
                { value: 'Ascomycètes', label: 'Ascomycètes', description: 'Oïdium, Alternaria, Septoria, Botrytis…' },
                { value: 'Basidiomycètes', label: 'Basidiomycètes', description: 'Rouilles, charbons…' },
                { value: 'Champignons du sol', label: 'Champignons du sol', description: 'Sclerotinia, Fusarium, Rhizoctonia…' },
            ];
        } else {
            // Default for Insecticide, Herbicide, etc.
            return [
                { value: 'Œuf', label: 'Œuf', description: 'Egg stage of pest lifecycle' },
                { value: 'Larve', label: 'Larve', description: 'Larval stage of pest lifecycle' },
                { value: 'Nymphe', label: 'Nymphe', description: 'Nymph stage of pest lifecycle' },
                { value: 'Adulte', label: 'Adulte', description: 'Adult stage of pest lifecycle' },
            ];
        }
    }, [data.type]);
  
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SelectableCard 
                        label="Systémique" 
                        description="Absorbed and transported" 
                        checked={(data.tags || []).includes('SYSTEMIC')} 
                        onChange={() => toggleApplicationTag('SYSTEMIC')} 
                    />
                    <SelectableCard 
                        label="Contact" 
                        description="Acts on direct contact" 
                        checked={(data.tags || []).includes('CONTACT')} 
                        onChange={() => toggleApplicationTag('CONTACT')} 
                    />
                    {(data.tags || []).includes('INGESTION') ? (
                         <SelectableCard 
                            label="Ingestion" 
                            description="Acts upon ingestion" 
                            checked={true} 
                            onChange={() => toggleApplicationTag('INGESTION')} 
                        />
                    ) : (
                        <button 
                            onClick={() => toggleApplicationTag('INGESTION')}
                            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all min-h-[100px]"
                        >
                            <span className="text-2xl text-blue-500 mb-1 font-light">+</span>
                            <span className="text-blue-500 font-medium text-center">ajouter Ingestion type</span>
                        </button>
                    )}
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select stage and rate efficacy (1-5 stars)</p>
                <div className="space-y-3">
                    {stageOptions.map(option => (
                        <StageRatingCard
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            description={option.description}
                            evaluation={(data.targetStage || []).find(s => s.stage === option.value)}
                            onUpdate={(evaluation) => handleStageUpdate(option.value, evaluation)}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ApplicationStep;
