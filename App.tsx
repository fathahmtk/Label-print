import React, { useState, useEffect } from 'react';
import type { PresetProduct, LabelTemplate, ToastMessage } from './types';
import PrintPage from './pages/PrintPage';
import ConfigPage from './pages/ConfigPage';
import TemplatesPage from './pages/TemplatesPage';
import TemplateDesignerPage from './pages/TemplateDesignerPage';
import DashboardPage from './pages/DashboardPage';
import ToastContainer from './components/Toast';
import { initialPresets, initialTemplates } from './data/presets';

type Page = 'dashboard' | 'print' | 'config' | 'templates' | 'designer';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('dashboard');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // --- Toast Management ---
  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

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
    const newPreset: PresetProduct = { ...newPresetData, id: crypto.randomUUID(), lastModified: new Date().toISOString() };
    setPresets(prev => [newPreset, ...prev]);
    addToast('Product preset created successfully!');
  };

  const handleUpdatePreset = (updatedPreset: PresetProduct) => {
    const updatedWithTimestamp = { ...updatedPreset, lastModified: new Date().toISOString() };
    setPresets(prev => {
        const otherPresets = prev.filter(p => p.id !== updatedWithTimestamp.id);
        return [updatedWithTimestamp, ...otherPresets];
    });
    addToast('Product preset updated successfully!');
  };

  const handleDeletePreset = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product preset?')) {
      setPresets(prev => prev.filter(p => p.id !== id));
      addToast('Product preset deleted.');
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
    const templateWithTimestamp = { ...template, lastModified: new Date().toISOString() };
    setTemplates(prev => {
        const exists = prev.some(t => t.id === templateWithTimestamp.id);
        if (exists) {
            const others = prev.filter(t => t.id !== templateWithTimestamp.id);
            return [templateWithTimestamp, ...others];
        }
        return [templateWithTimestamp, ...prev];
    });
    addToast(template.id === templateWithTimestamp.id ? 'Template updated successfully!' : 'Template created successfully!');
    setPage('templates');
    setEditingTemplateId(null);
  };
  
  const handleDeleteTemplate = (id: string) => {
     if (window.confirm('Are you sure you want to delete this template? This cannot be undone.')) {
        setTemplates(prev => prev.filter(t => t.id !== id));
        addToast('Template deleted.');
    }
  };

  // --- Navigation ---
  const navigateToDesigner = (id: string | null) => {
    setEditingTemplateId(id);
    setPage('designer');
  }

  const renderPage = () => {
    const commonProps = {
        presets: presets.sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime()),
        templates: templates.sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime()),
    };

    switch (page) {
      case 'dashboard':
        return <DashboardPage {...commonProps} setPage={setPage} onEditTemplate={navigateToDesigner} />;
      case 'print':
        return <PrintPage {...commonProps} />;
      case 'config':
        return <ConfigPage presets={commonProps.presets} onAdd={handleAddPreset} onUpdate={handleUpdatePreset} onDelete={handleDeletePreset} addToast={addToast} />;
      case 'templates':
        return <TemplatesPage templates={commonProps.templates} onEdit={navigateToDesigner} onAddNew={() => navigateToDesigner(null)} onDelete={handleDeleteTemplate} />;
      case 'designer':
        const editingTemplate = templates.find(t => t.id === editingTemplateId) || null;
        return <TemplateDesignerPage template={editingTemplate} onSave={handleSaveTemplate} onCancel={() => setPage('templates')} />;
      default:
        return <DashboardPage {...commonProps} setPage={setPage} onEditTemplate={navigateToDesigner} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <header className="bg-white shadow-sm sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
                <div className="flex-shrink-0">
                    <h1 className="font-dancing-script text-4xl text-stone-800 cursor-pointer" onClick={() => setPage('dashboard')}>Hot Bake</h1>
                </div>
                <nav className="flex items-center bg-stone-100 rounded-lg p-1 space-x-1">
                  { (['dashboard', 'print', 'config', 'templates'] as Page[]).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-5 py-2 rounded-md text-sm font-medium transition-colors duration-150 capitalize ${
                          page === p ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-600 hover:bg-white/60'
                        }`}
                      >
                        {p === 'config' ? 'Products' : p}
                      </button>
                  ))}
                </nav>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default App;