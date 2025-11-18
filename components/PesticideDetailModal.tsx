import React, { useState } from 'react';
import { Pesticide, PesticideTag } from '../types';
import { XIcon, BeakerIcon, SparklesIcon } from './Icons';
import { getSafetyInfo } from '../lib/gemini';
import { marked } from 'marked';


interface PesticideDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pesticide: Pesticide | null;
}

const tagColors: Record<PesticideTag, string> = {
  SYSTEMIC: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  CONTACT: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  CURATIVE: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  PREVENTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};

const DetailItem: React.FC<{ label: string; value: string | string[] }> = ({ label, value }) => (
  <div>
    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h4>
    <p className="text-base text-gray-800 dark:text-gray-100 font-semibold">
      {Array.isArray(value) ? value.join(', ') : value}
    </p>
  </div>
);

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // A simple renderer for basic markdown like bullet points
    const lines = content.split('\n').map((line, index) => {
        if (line.startsWith('* ')) {
            return <li key={index} className="text-gray-700 dark:text-gray-300">{line.substring(2)}</li>;
        }
        if (line.trim().length > 0) {
            return <p key={index} className="text-gray-700 dark:text-gray-300 mt-2">{line}</p>;
        }
        return null;
    });

    return <ul className="list-disc list-inside space-y-1">{lines}</ul>;
};


const PesticideDetailModal: React.FC<PesticideDetailModalProps> = ({ isOpen, onClose, pesticide }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !pesticide) return null;

  const handleAiAnalysis = async () => {
    setIsLoading(true);
    setAiAnalysis(null);
    const analysis = await getSafetyInfo(pesticide.activeIngredient);
    setAiAnalysis(analysis);
    setIsLoading(false);
  };

  const handleClose = () => {
      setAiAnalysis(null);
      setIsLoading(false);
      onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={handleClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <BeakerIcon className="h-6 w-6 text-primary"/>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{pesticide.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Compound Details</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-wrap gap-2">
            {pesticide.tags.map(tag => (
              <span key={tag} className={`px-2.5 py-1 text-xs font-bold rounded-full ${tagColors[tag]}`}>
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem label="Active Ingredient" value={pesticide.activeIngredient} />
            <DetailItem label="Chemical Family" value={pesticide.family} />
            <DetailItem label="IRAC Code" value={pesticide.irac} />
            <DetailItem label="Dosage" value={pesticide.dosage} />
            <DetailItem label="LogP" value={pesticide.logP} />
            <DetailItem label="pH" value={pesticide.ph} />
            <div className="md:col-span-2">
              <DetailItem label="Mode of Action" value={pesticide.modeOfAction} />
            </div>
            <div className="md:col-span-2">
              <DetailItem label="Target Stage" value={pesticide.targetStage} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Target Diseases/Pests</h4>
            <div className="flex flex-wrap gap-2">
              {pesticide.targets.map(target => (
                <span key={target} className="px-3 py-1 text-sm font-medium rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-500/30">
                  {target}
                </span>
              ))}
            </div>
          </div>
          
          {pesticide.notes && (
            <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notes</h4>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-base text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                {pesticide.notes}
                </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            {!aiAnalysis && !isLoading && (
                 <button onClick={handleAiAnalysis} className="w-full flex items-center justify-center gap-2 py-2.5 bg-secondary text-white font-semibold rounded-lg text-sm hover:bg-secondary/90 transition-all">
                    <SparklesIcon className="h-5 w-5"/> AI Safety Analysis
                </button>
            )}

            {isLoading && <div className="text-center text-gray-500 dark:text-gray-400">Generating analysis...</div>}
            
            {aiAnalysis && (
                <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2"><SparklesIcon className="h-4 w-4 text-secondary"/>AI Safety Analysis</h4>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm border border-gray-200 dark:border-gray-600">
                        <MarkdownRenderer content={aiAnalysis} />
                    </div>
                </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <button onClick={handleClose} className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default PesticideDetailModal;