import React, { useState, useEffect } from 'react';
import type { PresetProduct, LabelTemplate } from './types';
import PrintPage from './pages/PrintPage';
import ConfigPage from './pages/ConfigPage';
import TemplatesPage from './pages/TemplatesPage';
import TemplateDesignerPage from './pages/TemplateDesignerPage';
import { initialPresets, initialTemplates } from './data/presets';

type Page = 'print' | 'config' | 'templates' | 'designer';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('print');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // --- Presets State ---
  const [presets, setPresets] = useState<PresetProduct[]>(() => {
    try {
      const stored = localStorage.getItem('hotbake-presets');
      return stored ? JSON.parse(stored) : initialPresets;
    } catch (error) {
      console.error("Failed to parse presets from localStorage", error);
      return initialPresets;
    }
  });

  useEffect(() => {
    localStorage.setItem('hotbake-presets', JSON.stringify(presets));
  }, [presets]);

  const handleAddPreset = (newPresetData: Omit<PresetProduct, 'id'>) => {
    const newPreset: PresetProduct = { ...newPresetData, id: crypto.randomUUID() };
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

  // --- Templates State ---
  const [templates, setTemplates] = useState<LabelTemplate[]>(() => {
     try {
      const stored = localStorage.getItem('hotbake-templates');
      return stored ? JSON.parse(stored) : initialTemplates;
    } catch (error) {
      console.error("Failed to parse templates from localStorage", error);
      return initialTemplates;
    }
  });

  useEffect(() => {
    localStorage.setItem('hotbake-templates', JSON.stringify(templates));
  }, [templates]);

  const handleSaveTemplate = (template: LabelTemplate) => {
    setTemplates(prev => {
        const exists = prev.some(t => t.id === template.id);
        if (exists) {
            return prev.map(t => t.id === template.id ? template : t);
        }
        return [...prev, template];
    });
    setPage('templates');
    setEditingTemplateId(null);
  };
  
  const handleDeleteTemplate = (id: string) => {
     if (window.confirm('Are you sure you want to delete this template? This cannot be undone.')) {
        setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  // --- Navigation ---
  const navigateToDesigner = (id: string | null) => {
    setEditingTemplateId(id);
    setPage('designer');
  }

  const renderPage = () => {
    switch (page) {
      case 'print':
        return <PrintPage presets={presets} templates={templates} />;
      case 'config':
        return <ConfigPage presets={presets} onAdd={handleAddPreset} onUpdate={handleUpdatePreset} onDelete={handleDeletePreset} />;
      case 'templates':
        return <TemplatesPage templates={templates} onEdit={navigateToDesigner} onAddNew={() => navigateToDesigner(null)} onDelete={handleDeleteTemplate} />;
      case 'designer':
        const editingTemplate = templates.find(t => t.id === editingTemplateId) || null;
        return <TemplateDesignerPage template={editingTemplate} onSave={handleSaveTemplate} onCancel={() => setPage('templates')} />;
      default:
        return <PrintPage presets={presets} templates={templates} />;
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
                  { (['print', 'config', 'templates'] as Page[]).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-5 py-2 rounded-md text-sm font-medium transition-colors duration-150 capitalize ${
                          page === p ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-600 hover:bg-white/60'
                        }`}
                      >
                        {p === 'config' ? 'Manage Products' : p}
                      </button>
                  ))}
                </nav>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
