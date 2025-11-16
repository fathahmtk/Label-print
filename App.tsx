
import React, { useState, useEffect } from 'react';
import type { PresetProduct } from './types';
import PrintPage from './pages/PrintPage';
import ConfigPage from './pages/ConfigPage';
import { initialPresets } from './data/presets';

const App: React.FC = () => {
  const [page, setPage] = useState<'print' | 'config'>('print');
  const [presets, setPresets] = useState<PresetProduct[]>(() => {
    try {
      const storedPresets = localStorage.getItem('hotbake-presets');
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
      localStorage.setItem('hotbake-presets', JSON.stringify(presets));
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
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <header className="bg-white shadow-sm sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
                <div className="flex-shrink-0">
                    <h1 className="font-dancing-script text-4xl text-stone-800">Hot Bake</h1>
                </div>
                <nav className="flex items-center bg-stone-100 rounded-lg p-1 space-x-1">
                  <button
                    onClick={() => setPage('print')}
                    className={`px-5 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                      page === 'print' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-600 hover:bg-white/60'
                    }`}
                  >
                    Label Printer
                  </button>
                  <button
                    onClick={() => setPage('config')}
                    className={`px-5 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                      page === 'config' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-600 hover:bg-white/60'
                    }`}
                  >
                    Manage Products
                  </button>
                </nav>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
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