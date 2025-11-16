
import React, { useState, useEffect } from 'react';
import type { PresetProduct } from './types';
import PrintPage from './pages/PrintPage';
import ConfigPage from './pages/ConfigPage';
import { initialPresets } from './data/presets';

const App: React.FC = () => {
  const [page, setPage] = useState<'print' | 'config'>('print');
  const [presets, setPresets] = useState<PresetProduct[]>(() => {
    try {
      const storedPresets = localStorage.getItem('ican-presets');
      if (storedPresets) {
        return JSON.parse(storedPresets);
      }
    } catch (error) {
      console.error("Failed to parse presets from localStorage", error);
    }
    return initialPresets;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ican-presets', JSON.stringify(presets));
    } catch (error) {
      console.error("Failed to save presets to localStorage", error);
    }
  }, [presets]);

  const handleAddPreset = (newPresetData: Omit<PresetProduct, 'id'>) => {
    const newPreset: PresetProduct = {
      ...newPresetData,
      id: crypto.randomUUID(),
    };
    setPresets(prev => [...prev, newPreset]);
  };

  const handleUpdatePreset = (updatedPreset: PresetProduct) => {
    setPresets(prev => prev.map(p => p.id === updatedPreset.id ? updatedPreset : p));
  };

  const handleDeletePreset = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product preset?')) {
      setPresets(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="font-dancing-script text-5xl text-stone-700">iCAN</h1>
          <p className="text-stone-500 mt-2">Create and print professional food labels.</p>
        </header>

        <nav className="flex justify-center items-center bg-white rounded-lg shadow-md p-2 mb-8 space-x-2 no-print">
          <button
            onClick={() => setPage('print')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
              page === 'print' ? 'bg-stone-700 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Label Printer
          </button>
          <button
            onClick={() => setPage('config')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
              page === 'config' ? 'bg-stone-700 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Manage Products
          </button>
        </nav>

        {page === 'print' && <PrintPage presets={presets} />}
        {page === 'config' && (
            <ConfigPage 
                presets={presets} 
                onAdd={handleAddPreset}
                onUpdate={handleUpdatePreset}
                onDelete={handleDeletePreset}
            />
        )}

      </main>
    </div>
  );
};

export default App;
