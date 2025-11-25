
import React, { useState, useMemo, useEffect } from 'react';
import { Pesticide, PesticideType, IracData } from '../types';
import Stepper from '../components/Stepper';
import ChemicalInfoStep from '../components/form-steps/ChemicalInfoStep';
import ApplicationStep from '../components/form-steps/ApplicationStep';
import CommercialStep from '../components/form-steps/CommercialStep';
import ReviewStep from '../components/form-steps/ReviewStep';
// Fix: Imported CheckIcon to be used in the submit button.
import { CheckIcon, PencilIcon } from '../components/Icons';

interface AddCompoundPageProps {
  onSaveCompound: (compound: Omit<Pesticide, 'id'> & { id?: number }) => void;
  existingPesticides: Pesticide[];
  compoundToEdit: Pesticide | null;
  showNotification: (message: string, type: 'success' | 'error') => void;
  iracData: IracData[] | null;
}

const initialFormData: Partial<Pesticide> = {
    name: '',
    type: 'Insecticide',
    activeIngredient: '',
    family: '',
    irac: '',
    chemicalDetails: '',
    modeOfAction: '',
    tags: [],
    targetStage: [],
    dosage: '',
    targets: [],
    notes: '',
    logP: '',
    ph: '',
    labelImage: ''
};

const AddCompoundPage: React.FC<AddCompoundPageProps> = ({ onSaveCompound, existingPesticides, compoundToEdit, showNotification, iracData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Pesticide>>(initialFormData);
  
  const isEditMode = !!compoundToEdit;

  useEffect(() => {
    if (compoundToEdit) {
      setFormData(compoundToEdit);
    } else {
      setFormData(initialFormData);
    }
    setCurrentStep(1); // Reset to first step on mode change
  }, [compoundToEdit]);


  const chemicalFamilies = useMemo(() => {
    const families = existingPesticides.map(p => p.family);
    return [...new Set(families)].sort();
  }, [existingPesticides]);
  
  const modesOfAction = useMemo(() => {
    const modes = existingPesticides.map(p => p.modeOfAction);
    return [...new Set(modes)].sort();
  }, [existingPesticides]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const updateFormData = (data: Partial<Pesticide>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.activeIngredient || !formData.family || !formData.dosage || !formData.type) {
        showNotification("Please ensure all required fields are filled out.", 'error');
        return;
    }

    // Reconstruct a valid Pesticide object from formData
    const finalCompound: Omit<Pesticide, 'id'> & { id?: number } = {
        name: formData.name!,
        type: formData.type!,
        tags: formData.tags || [],
        activeIngredient: formData.activeIngredient!,
        family: formData.family!,
        irac: formData.irac || '',
        chemicalDetails: formData.chemicalDetails || '',
        targetStage: formData.targetStage || [],
        modeOfAction: formData.modeOfAction || '',
        dosage: formData.dosage!,
        targets: formData.targets || [],
        notes: formData.notes || '',
        logP: formData.logP || 'N/A',
        ph: formData.ph || 'N/A',
        labelImage: formData.labelImage || '',
    };

    if (isEditMode && compoundToEdit) {
      finalCompound.id = compoundToEdit.id;
    }

    onSaveCompound(finalCompound);
  };
  
  const steps = ["Chemical Info", "Application", "Commercial", "Review"];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{isEditMode ? 'Edit Compound' : 'Add New Compound'}</h2>
      <p className="text-sm mb-6 text-gray-500 dark:text-gray-400">{isEditMode ? `Editing "${compoundToEdit.name}"` : 'Add new pesticide compounds to your database'}</p>
      
      <Stepper steps={steps} currentStep={currentStep} />

      <div className="mt-8">
        {currentStep === 1 && (
          <ChemicalInfoStep 
            data={formData} 
            updateData={updateFormData} 
            families={chemicalFamilies} 
            modesOfAction={modesOfAction}
            iracData={iracData}
          />
        )}
        {currentStep === 2 && (
          <ApplicationStep data={formData} updateData={updateFormData} />
        )}
        {currentStep === 3 && (
          <CommercialStep data={formData} updateData={updateFormData} />
        )}
        {currentStep === 4 && (
          <ReviewStep data={formData} />
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <button 
          onClick={prevStep} 
          disabled={currentStep === 1}
          className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
        >
          Previous
        </button>
        {currentStep < 4 ? (
          <button 
            onClick={nextStep}
            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark flex items-center gap-2"
          >
            {isEditMode ? <PencilIcon className="h-5 w-5"/> : <CheckIcon className="h-5 w-5"/>}
            {isEditMode ? 'Update Compound' : 'Submit Compound'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddCompoundPage;