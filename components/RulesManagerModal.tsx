import React, { useState, useMemo } from 'react';
import { CompatibilityRule, Pesticide } from '../types';
import { compatibilityRules as mockRules } from '../data/mockData';
import { XIcon, BookTextIcon, CheckIcon, TrashIcon, PencilIcon, InfoIcon, PlusCircleIcon } from './Icons';
import AddRuleForm from './AddRuleForm';

interface RulesManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pesticides: Pesticide[];
}

const statusStyles = {
    'Do Not Mix': {
        icon: <XIcon className="h-4 w-4 text-red-600" />,
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-200 dark:border-red-500/30',
        precautionBg: 'bg-red-50 dark:bg-red-900/20',
        precautionBorder: 'border-red-200 dark:border-red-500/30',
    },
    'Safe to Mix': {
        icon: <CheckIcon className="h-4 w-4 text-green-600" />,
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-500/30',
        precautionBg: '',
        precautionBorder: '',
    },
    'Conditional': {
        icon: <InfoIcon className="h-4 w-4 text-orange-600" />,
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-200 dark:border-orange-500/30',
        precautionBg: 'bg-orange-50 dark:bg-orange-900/20',
        precautionBorder: 'border-orange-200 dark:border-orange-500/30',
    }
};

const RuleCard: React.FC<{ rule: CompatibilityRule }> = ({ rule }) => {
    const styles = statusStyles[rule.status];
    return (
        <div className={`border rounded-lg ${styles.border} overflow-hidden animate-fadeIn`}>
            <div className={`p-3 flex justify-between items-start ${styles.bg}`}>
                <div>
                    <div className={`inline-flex items-center gap-2 font-bold text-sm px-2 py-1 rounded ${styles.text}`}>
                        {styles.icon}
                        {rule.status}
                    </div>
                    <div className="mt-2 text-lg font-bold text-gray-800 dark:text-gray-100">
                        {rule.agents[0]} + {rule.agents[1]}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{rule.type} • Version: {rule.version}</div>
                </div>
                <div className="flex gap-2">
                    <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md dark:hover:bg-gray-700"><PencilIcon className="h-4 w-4"/></button>
                    <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md dark:hover:bg-gray-700"><TrashIcon className="h-4 w-4"/></button>
                </div>
            </div>
            <div className="p-3 text-sm space-y-2 bg-white dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-300">{rule.reason}</p>
                {rule.precaution && (
                     <div className={`p-2 rounded-md text-xs border ${styles.precautionBorder} ${styles.precautionBg}`}>
                        <p className={styles.text}>{rule.precaution}</p>
                    </div>
                )}
            </div>
             <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-400 border-t dark:border-gray-700">
                Created: {rule.created} • Modified: {rule.modified}
            </div>
        </div>
    );
};


const RulesManagerModal: React.FC<RulesManagerModalProps> = ({ isOpen, onClose, pesticides }) => {
  const [rules, setRules] = useState<CompatibilityRule[]>(mockRules);
  const [view, setView] = useState<'list' | 'add'>('list');

  const chemicalFamilies = useMemo(() => {
    const families = pesticides.map(p => p.family);
    return [...new Set(families)].sort();
  }, [pesticides]);
  
  const activeIngredients = useMemo(() => {
    const ingredients = pesticides.map(p => p.activeIngredient);
    return [...new Set(ingredients)].sort();
  }, [pesticides]);

  const handleAddRule = (newRule: Omit<CompatibilityRule, 'id' | 'created' | 'modified' | 'version'>) => {
    const ruleToAdd: CompatibilityRule = {
      ...newRule,
      id: Math.max(...rules.map(r => r.id), 0) + 1,
      created: new Date().toLocaleDateString('en-CA'),
      modified: new Date().toLocaleDateString('en-CA'),
      version: 1,
    };
    setRules(prevRules => [ruleToAdd, ...prevRules]);
    setView('list');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
                <BookTextIcon className="h-6 w-6 text-blue-600"/>
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Compatibility Rule Manager</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage chemical compatibility database</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setView('list')}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
                >
                    Manage Rules ({rules.length})
                </button>
            </div>
            <button
                onClick={() => setView('add')}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-dark"
            >
                <PlusCircleIcon className="h-5 w-5" />
                <span>Add Rule</span>
            </button>
        </div>
        
        <div className="p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 flex-grow">
            {view === 'list' ? (
                <div className="space-y-3">
                    {rules.map(rule => (
                        <RuleCard key={rule.id} rule={rule} />
                    ))}
                </div>
            ) : (
                <AddRuleForm 
                  onAddRule={handleAddRule} 
                  onCancel={() => setView('list')}
                  families={chemicalFamilies}
                  chemicals={activeIngredients}
                />
            )}
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
             <button onClick={onClose} className="w-full bg-gray-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default RulesManagerModal;