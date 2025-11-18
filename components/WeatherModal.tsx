import React, { useState, useEffect } from 'react';
import { XIcon, SunIcon, WindIcon, DropletsIcon, CheckIcon } from './Icons';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose }) => {
  const [location, setLocation] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would use these coords to call a weather API
          const { latitude, longitude } = position.coords;
          setLocation(`Coords: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setError(null);
        },
        (err) => {
          setError(err.message);
          setLocation('Tunisia (Default)');
        }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Current Weather</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XIcon className="h-6 w-6" />
            </button>
        </div>
        <div className="p-6 space-y-4">
            <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-center items-center text-6xl font-bold text-gray-800 dark:text-gray-100">
                    <SunIcon className="w-16 h-16 text-yellow-400 mr-4" />
                    <span>22°C</span>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Partly cloudy</p>
                <p className="text-sm text-gray-400 mt-1">{location}</p>
                {error && <p className="text-xs text-red-500 mt-1">GPS Error: {error}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <WindIcon className="w-8 h-8 mx-auto text-blue-500" />
                    <p className="mt-2 font-bold text-lg dark:text-gray-100">9 km/h</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
                </div>
                 <div>
                    <DropletsIcon className="w-8 h-8 mx-auto text-cyan-500" />
                    <p className="mt-2 font-bold text-lg dark:text-gray-100">33%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                </div>
            </div>
            
            <div className="pt-4">
                <label htmlFor="use-gps" className="flex items-center justify-between cursor-pointer">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Use GPS Location</span>
                    <div className="relative">
                        <input id="use-gps" type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                </label>
            </div>

            <div className="!mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/50 text-green-800 dark:text-green-300 rounded-lg p-4 flex items-center">
                <CheckIcon className="h-6 w-6 mr-3 text-primary" />
                <div>
                    <h4 className="font-bold">Application Status: Good Conditions</h4>
                    <p className="text-xs">Optimal conditions for pesticide application.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherModal;