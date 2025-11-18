import React, { useState, useEffect } from 'react';
import { CompatibilityRule } from '../types';

type NewRule = Omit<CompatibilityRule, 'id' | 'created' | 'modified' | 'version'>;

interface AddRuleFormProps {
  onAddRule: (newRule: NewRule) => void;
  onCancel: () => void;
  families: string[];
  chemicals: string[];
}

const formFieldClasses = "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";
const formLabelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

const AddRuleForm: React.FC<AddRuleFormProps> = ({ onAddRule, onCancel, families, chemicals }) => {
  const [ruleType, setRuleType] = useState<NewRule['type']>('Family');
  const [agent1, setAgent1] = useState('');
  const [agent2, setAgent2] = useState('');
  const [status, setStatus] = useState<NewRule['status']>('Do Not Mix');
  const [reason, setReason] = useState('');
  const [precaution, setPrecaution] = useState('');

  const availableAgents = ruleType === 'Family' ? families : chemicals;

  useEffect(() => {
    // Reset agents when type changes to prevent invalid combinations
    setAgent1('');
    setAgent2('');
  }, [ruleType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent1 || !agent2 || !reason) {
      alert('Please fill in all required fields.');
      return;
    }
    if (agent1 === agent2) {
      alert('Agents cannot be the same.');
      return;
    }
    onAddRule({
      type: ruleType,
      agents: [agent1, agent2],
      status,
      reason,
      precaution,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-3 mb-4">Create New Compatibility Rule</h3>
      
      <div>
        <label className={formLabelClasses}>Rule Type</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input type="radio" name="ruleType" value="Family" checked={ruleType === 'Family'} onChange={() => setRuleType('Family')} className="h-4 w-4 text-secondary focus:ring-secondary" />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Family vs. Family</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="ruleType" value="Chemical" checked={ruleType === 'Chemical'} onChange={() => setRuleType('Chemical')} className="h-4 w-4 text-secondary focus:ring-secondary" />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Chemical vs. Chemical</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="agent1" className={formLabelClasses}>First {ruleType}</label>
          <select id="agent1" value={agent1} onChange={e => setAgent1(e.target.value)} className={formFieldClasses} required>
            <option value="" disabled>Select {ruleType.toLowerCase()}</option>
            {availableAgents.map(agent => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="agent2" className={formLabelClasses}>Second {ruleType}</label>
          <select id="agent2" value={agent2} onChange={e => setAgent2(e.target.value)} className={formFieldClasses} required>
            <option value="" disabled>Select {ruleType.toLowerCase()}</option>
            {availableAgents.filter(a => a !== agent1).map(agent => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="status" className={formLabelClasses}>Compatibility Status</label>
        <select id="status" value={status} onChange={e => setStatus(e.target.value as NewRule['status'])} className={formFieldClasses} required>
          <option value="Do Not Mix">Do Not Mix</option>
          <option value="Safe to Mix">Safe to Mix</option>
          <option value="Conditional">Conditional</option>
        </select>
      </div>

      <div>
        <label htmlFor="reason" className={formLabelClasses}>Reason</label>
        <textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} className={formFieldClasses} rows={3} placeholder="Explain the interaction (e.g., synergistic toxicity, precipitation)..." required></textarea>
      </div>
      
      <div>
        <label htmlFor="precaution" className={formLabelClasses}>Precaution (Optional)</label>
        <textarea id="precaution" value={precaution} onChange={e => setPrecaution(e.target.value)} className={formFieldClasses} rows={2} placeholder="E.g., Perform a jar test before application..."></textarea>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">
          Save Rule
        </button>
      </div>
    </form>
  );
};

export default AddRuleForm;