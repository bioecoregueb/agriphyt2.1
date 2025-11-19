
import React from 'react';
import { Pesticide } from '../../types';
import { CheckCircle2Icon } from '../Icons';
import { getModeOfActionCategory } from '../../lib/utils';

interface ReviewStepProps {
  data: Partial<Pesticide>;
}

const DetailItem: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h5>
        <p className="text-md text-gray-800 dark:text-gray-100">{value || '-'}</p>
    </div>
);

const Tag: React.FC<{ children: React.ReactNode, color: string }> = ({ children, color }) => (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>{children}</span>
);

const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
  const moaInfo = getModeOfActionCategory(data.modeOfAction || '');
  
  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col items-center text-center">
             <div className="p-3 bg-primary/10 rounded-full mb-3">
                <CheckCircle2Icon className="h-8 w-8 text-primary"/>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Review</h3>
            <p className="text-gray-500 dark:text-gray-400">Please review your compound details</p>
        </div>

        <div className="max-w-3xl mx-auto p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg space-y-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b dark:border-gray-700 pb-2">Compound Summary</h4>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem label="Commercial Name" value={data.name} />
                <DetailItem label="Type" value={<span className="font-bold text-primary dark:text-primary/90">{data.type}</span>} />
                <DetailItem label="Active Ingredient" value={data.activeIngredient} />
                <DetailItem label="Dosage" value={data.dosage} />
                <DetailItem label="Chemical Family" value={data.family} />
                <DetailItem label="IRAC/FRAC Code" value={data.irac} />
                <DetailItem label="LogP" value={data.logP} />
                <DetailItem label="pH" value={data.ph} />
                <div className="col-span-2">
                   <div>
                        <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">General Mode of Action</h5>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full ${moaInfo.styles.bg} ${moaInfo.styles.text}`}>
                                <span className={`h-2 w-2 rounded-full ${moaInfo.styles.dot}`}></span>
                                {moaInfo.category}
                            </span>
                            <p className="text-md text-gray-800 dark:text-gray-100">{data.modeOfAction || '-'}</p>
                        </div>
                    </div>
                </div>
                {data.chemicalDetails && (
                    <div className="col-span-2">
                        <DetailItem label="Chemical Details" value={data.chemicalDetails} />
                    </div>
                )}
            </div>

            <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Application & Objective</h5>
                <div className="flex flex-wrap gap-2">
                    {(data.tags || []).map(tag => (
                        <Tag key={tag} color={ tag === 'SYSTEMIC' || tag === 'CONTACT' || tag === 'INGESTION' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'}>
                            {tag}
                        </Tag>
                    ))}
                </div>
            </div>

            <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Target Stage</h5>
                <div className="flex flex-wrap gap-2">
                    {(data.targetStage || []).map(stage => <Tag key={stage} color="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">{stage}</Tag>)}
                </div>
            </div>

             <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Target Diseases/Pests</h5>
                <div className="flex flex-wrap gap-2">
                    {(data.targets || []).map(target => <Tag key={target} color="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">{target}</Tag>)}
                </div>
            </div>

            {data.notes && (
                <div>
                     <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</h5>
                     <p className="text-md text-gray-800 dark:text-gray-100 p-3 bg-white dark:bg-gray-800 border rounded-md mt-1 dark:border-gray-600">{data.notes}</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ReviewStep;