
import React from 'react';
import { Pesticide, PesticideTag, Page } from '../types';
import { 
    PlusIcon, FlaskConicalIcon, DatabaseIcon, ArchiveIcon, TargetIcon, ShieldIcon, BarChartIcon,
    CloudIcon, MapPinIcon, WindIcon, DropletsIcon, CheckCircle2Icon, PlusCircleIcon, UserIcon, InfoIcon, StarIcon
} from '../components/Icons';
import { getCodeLabel } from '../lib/utils';

interface OverviewPageProps {
  compounds: Pesticide[];
  setActivePage: (page: Page) => void;
  onNavigateToAdd: () => void;
  showNotification: (message: string, type?: 'success' | 'error') => void;
}

const tagColors: Record<PesticideTag, string> = {
  SYSTEMIC: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  CONTACT: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  CURATIVE: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  PREVENTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  INGESTION: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string; }> = ({ icon, title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
      {icon}
    </div>
  </div>
);

const RecentCompoundItem: React.FC<{ pesticide: Pesticide }> = ({ pesticide }) => (
    <div className="py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-100">{pesticide.name}</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                    {pesticide.tags.map(tag => (
                    <span key={tag} className={`px-2 py-0.5 text-xs font-semibold rounded-full ${tagColors[tag]}`}>
                        {tag}
                    </span>
                    ))}
                </div>
            </div>
            <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                <p className="font-semibold">{pesticide.family}</p>
                <p>{pesticide.targetStage.map(s => s.stage).join(', ')}</p>
            </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p><span className="font-semibold text-gray-700 dark:text-gray-200">{getCodeLabel(pesticide.type)}:</span> {pesticide.irac}</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-200">Mode of Action:</span> {pesticide.modeOfAction}</p>
            {pesticide.notes && <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md mt-1">{pesticide.notes}</p>}
        </div>
    </div>
);


const QuickAction: React.FC<{ icon: React.ReactNode; title: string; description: string; colorClasses: string; onClick: () => void; }> = ({ icon, title, description, colorClasses, onClick }) => (
    <button onClick={onClick} className={`p-4 rounded-xl text-left w-full transition-all hover:shadow-md ${colorClasses}`}>
        <div className="p-2 rounded-full bg-white/50 w-min mb-3">
            {icon}
        </div>
        <p className="font-bold">{title}</p>
        <p className="text-sm opacity-80">{description}</p>
    </button>
);


const OverviewPage: React.FC<OverviewPageProps> = ({ compounds, setActivePage, onNavigateToAdd, showNotification }) => {
  const totalCompounds = compounds.length;
  const systemicCount = compounds.filter(c => c.tags.includes('SYSTEMIC')).length;
  const preventiveCount = compounds.filter(c => c.tags.includes('PREVENTIVE')).length;
  const familiesCount = new Set(compounds.map(c => c.family)).size;
  const recentCompounds = compounds.slice(0, 3);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Blue Dashboard Card */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold">Overview Dashboard</h2>
        <p className="opacity-80 mb-4">Quick summary of your pesticide database</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onNavigateToAdd} className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            <PlusIcon className="h-5 w-5" /> Ajouter un composé
          </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors">
            <FlaskConicalIcon className="h-5 w-5" /> Safety Check
          </button>
           <button onClick={() => setActivePage('database')} className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors">
            <DatabaseIcon className="h-5 w-5" /> Main Database
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard icon={<ArchiveIcon className="h-6 w-6 text-blue-500" />} title="Total des composés" value={totalCompounds} />
            <StatCard icon={<TargetIcon className="h-6 w-6 text-purple-500" />} title="Systémique" value={systemicCount} />
            <StatCard icon={<ShieldIcon className="h-6 w-6 text-green-500" />} title="Préventif" value={preventiveCount} />
            <StatCard icon={<BarChartIcon className="h-6 w-6 text-orange-500" />} title="Familles" value={familiesCount} />
          </div>

          {/* Recent Compounds */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Composés récents</h3>
                <button onClick={() => setActivePage('database')} className="text-sm font-semibold text-secondary hover:underline">View All in Main Database →</button>
            </div>
            <div>
                {recentCompounds.length > 0 ? (
                    recentCompounds.map(p => <RecentCompoundItem key={p.id} pesticide={p} />)
                ) : (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">No compounds in the database yet.</p>
                )}
            </div>
          </div>

        </div>

        {/* Weather Card */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Current Weather</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPinIcon className="h-4 w-4" /> Tunisia
                    </div>
                </div>
                 <div className="text-right">
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">22°C</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Partly cloudy</p>
                </div>
            </div>

            <div className="my-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Use GPS Location</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary"></div>
                </label>
            </div>
            
            <div className="space-y-3 py-4 border-y border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <WindIcon className="h-5 w-5" /> Wind Speed
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">7 km/h</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <DropletsIcon className="h-5 w-5" /> Humidity
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">33%</span>
                </div>
                 <p className="text-xs text-center text-gray-400 bg-gray-50 dark:bg-gray-700/50 py-1 rounded-md">Coordinates: 35.7643, 10.8113</p>
            </div>

            <div className="mt-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg p-3">
                <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2Icon className="h-5 w-5"/> Application Status
                </div>
                <p className="text-sm ml-7">Good Conditions</p>
                <p className="text-xs ml-7 opacity-80">Optimal conditions for pesticide application</p>
            </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction icon={<PlusCircleIcon className="h-6 w-6 text-green-600"/>} title="Add Compound" description="Register new pesticide" colorClasses="bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200" onClick={onNavigateToAdd} />
            <QuickAction icon={<DatabaseIcon className="h-6 w-6 text-blue-600"/>} title="Main Database" description="Search & manage" colorClasses="bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200" onClick={() => setActivePage('database')} />
            <QuickAction icon={<BarChartIcon className="h-6 w-6 text-purple-600"/>} title="View Analytics" description="Analyze your data" colorClasses="bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200" onClick={() => showNotification('Analytics page coming soon!', 'success')} />
            <QuickAction icon={<UserIcon className="h-6 w-6 text-orange-600"/>} title="Manage Profile" description="Update settings" colorClasses="bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200" onClick={() => setActivePage('profile')} />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
