
import React, { useState, useRef, useMemo } from 'react';
import PesticideCard from '../components/PesticideCard';
import CompatibilityCheckerModal from '../components/CompatibilityCheckerModal';
import SafetyModal from '../components/SafetyModal';
import PesticideDetailModal from '../components/PesticideDetailModal';
import { Pesticide } from '../types';
import { 
  SearchIcon, SlidersHorizontalIcon, FlaskConicalIcon, 
  ShieldIcon, BookTextIcon, UploadCloudIcon, DownloadCloudIcon,
  RotateCcwIcon
} from '../components/Icons';

interface DatabasePageProps {
  compounds: Pesticide[];
  onImport: (data: Pesticide[]) => void;
  onEdit: (pesticide: Pesticide) => void;
  onDeleteRequest: (id: number) => void;
  showNotification: (message: string, type?: 'success' | 'error') => void;
  onOpenRules: () => void;
}

const ActionButton: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  colorClasses: string; 
  onClick?: () => void;
  disabled?: boolean;
}> = ({ icon, label, colorClasses, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${colorClasses} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const DatabasePage: React.FC<DatabasePageProps> = ({ compounds, onImport, onEdit, onDeleteRequest, showNotification, onOpenRules }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [selectedCompound, setSelectedCompound] = useState<Pesticide | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    tags: [] as string[],
    targetStage: [] as string[],
    modeOfAction: '',
  });

  const uniqueModesOfAction = useMemo(() => {
    const modes = compounds.map(c => c.modeOfAction);
    return [...new Set(modes)].sort();
  }, [compounds]);

  const allTags = ['SYSTEMIC', 'CONTACT', 'CURATIVE', 'PREVENTIVE', 'INGESTION'];
  const allTargetStages = ['Œuf', 'Larve', 'Nymphe', 'Adulte', 'Oomycètes', 'Ascomycètes', 'Basidiomycètes', 'Champignons du sol'];

  const handleFilterChange = (filterType: keyof typeof activeFilters, value: string) => {
    setActiveFilters(prev => {
        if (filterType === 'tags' || filterType === 'targetStage') {
            const currentValues = prev[filterType] as string[];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [filterType]: newValues };
        }
        return { ...prev, [filterType]: value };
    });
  };

  const clearFilters = () => {
      setActiveFilters({ tags: [], targetStage: [], modeOfAction: '' });
  };
  
  const activeFilterCount = activeFilters.tags.length + activeFilters.targetStage.length + (activeFilters.modeOfAction ? 1 : 0);

  const filteredCompounds = useMemo(() => {
    return compounds.filter(compound => {
        // Text search
        const lowercasedQuery = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || (
            compound.name.toLowerCase().includes(lowercasedQuery) ||
            compound.activeIngredient.toLowerCase().includes(lowercasedQuery) ||
            compound.family.toLowerCase().includes(lowercasedQuery) ||
            compound.targets.some(target => target.toLowerCase().includes(lowercasedQuery))
        );

        // Advanced filters
        const matchesTags = activeFilters.tags.length === 0 || activeFilters.tags.every(tag => compound.tags.includes(tag as any));
        const matchesTargetStage = activeFilters.targetStage.length === 0 || activeFilters.targetStage.some(filterStage => compound.targetStage.some(compoundStage => compoundStage.stage === filterStage));
        const matchesModeOfAction = !activeFilters.modeOfAction || compound.modeOfAction === activeFilters.modeOfAction;

        return matchesSearch && matchesTags && matchesTargetStage && matchesModeOfAction;
    });
  }, [compounds, searchQuery, activeFilters]);

  // Group by Active Ingredient
  const groupedCompounds = useMemo(() => {
    const groups: Record<string, Pesticide[]> = {};
    filteredCompounds.forEach(compound => {
        const key = compound.activeIngredient || 'Unknown Ingredient';
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(compound);
    });
    return groups;
  }, [filteredCompounds]);

  const sortedIngredients = useMemo(() => Object.keys(groupedCompounds).sort(), [groupedCompounds]);


  const handleExport = () => {
    const dataStr = JSON.stringify(compounds, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'pesticides.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const importedCompounds = JSON.parse(text);
            // Add basic validation here if needed
            if (Array.isArray(importedCompounds)) {
              onImport(importedCompounds);
            } else {
              throw new Error('Imported data is not an array.');
            }
          }
        } catch (error) {
          showNotification('Failed to import data. Please check the file format.', 'error');
          console.error("Import Error:", error);
        }
      };
      reader.readAsText(file);
    }
    // Reset file input to allow re-uploading the same file
    if(event.target) event.target.value = '';
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleUpdate = () => {
    showNotification('Simulating data sync... Database is up to date!', 'success');
  };

  return (
    <>
      <div className="space-y-6">
        {/* Search and Actions */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="relative mb-4">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ingredient, family, target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {showFilters && (
            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                        <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                            <button key={tag} onClick={() => handleFilterChange('tags', tag)} className={`px-2 py-1 text-xs rounded-full border ${activeFilters.tags.includes(tag) ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'}`}>{tag}</button>
                        ))}
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Stage</label>
                        <div className="flex flex-wrap gap-2">
                        {allTargetStages.map(stage => (
                            <button key={stage} onClick={() => handleFilterChange('targetStage', stage)} className={`px-2 py-1 text-xs rounded-full border ${activeFilters.targetStage.includes(stage) ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'}`}>{stage}</button>
                        ))}
                        </div>
                    </div>
                     <div>
                        <label htmlFor="modeOfActionFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mode of Action</label>
                        <select id="modeOfActionFilter" value={activeFilters.modeOfAction} onChange={(e) => handleFilterChange('modeOfAction', e.target.value)} className="w-full p-2 text-sm border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <option value="">All</option>
                            {uniqueModesOfAction.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="flex justify-end">
                    <button onClick={clearFilters} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 font-semibold p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10">
                        <RotateCcwIcon className="h-4 w-4" /> Clear Filters
                    </button>
                </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <button onClick={() => setShowFilters(f => !f)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all relative ${showFilters ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}>
                <SlidersHorizontalIcon className="h-4 w-4"/>
                <span>Filters</span>
                {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">{activeFilterCount}</span>}
            </button>
            {compounds.length > 0 && (
              <>
                <ActionButton icon={<FlaskConicalIcon className="h-4 w-4"/>} label="Tank Mix" colorClasses="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20" onClick={() => setShowCompatibilityModal(true)} />
                <ActionButton icon={<ShieldIcon className="h-4 w-4"/>} label="Safety" colorClasses="bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20" onClick={() => setShowSafetyModal(true)} />
                <ActionButton icon={<BookTextIcon className="h-4 w-4"/>} label="Rules" colorClasses="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20" onClick={onOpenRules} />
              </>
            )}
            <ActionButton 
              icon={<RotateCcwIcon className="h-4 w-4"/>} 
              label={'Update'} 
              colorClasses="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-300 dark:hover:bg-yellow-500/20" 
              onClick={handleUpdate}
            />
            <ActionButton icon={<UploadCloudIcon className="h-4 w-4"/>} label="Import" colorClasses="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20" onClick={triggerImport} />
            <ActionButton icon={<DownloadCloudIcon className="h-4 w-4"/>} label="Export" colorClasses="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/10 dark:text-green-300 dark:hover:bg-green-500/20" onClick={handleExport} />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Compound List */}
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Showing {filteredCompounds.length} of {compounds.length} compounds</p>
            <div className="space-y-8">
                {sortedIngredients.length > 0 ? (
                    sortedIngredients.map(ingredient => (
                        <div key={ingredient}>
                             <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                                <div className="bg-secondary/10 p-1.5 rounded-md">
                                    <FlaskConicalIcon className="h-5 w-5 text-secondary" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{ingredient}</h3>
                                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                                    {groupedCompounds[ingredient].length}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {groupedCompounds[ingredient].map(pesticide => (
                                    <PesticideCard 
                                        key={pesticide.id} 
                                        pesticide={pesticide} 
                                        onViewDetails={() => setSelectedCompound(pesticide)}
                                        onEdit={() => onEdit(pesticide)}
                                        onDelete={() => onDeleteRequest(pesticide.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No compounds found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {searchQuery ? `Your search for "${searchQuery}" did not match any compounds.` : "There are no compounds in your database yet. Add one to get started!"}
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <CompatibilityCheckerModal 
        isOpen={showCompatibilityModal} 
        onClose={() => setShowCompatibilityModal(false)}
        compounds={compounds}
      />
      <SafetyModal 
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
      />
      <PesticideDetailModal
        isOpen={!!selectedCompound}
        onClose={() => setSelectedCompound(null)}
        pesticide={selectedCompound}
      />
    </>
  );
};

export default DatabasePage;
