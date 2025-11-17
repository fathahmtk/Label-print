import React, { useState, useEffect, useMemo } from 'react';
import type { PresetProduct, LabelTemplate, ToastMessage } from './types';
import PrintPage from './pages/PrintPage';
import ConfigPage from './pages/ConfigPage';
import TemplatesPage from './pages/TemplatesPage';
import TemplateDesignerPage from './pages/TemplateDesignerPage';
import DashboardPage from './pages/DashboardPage';
import ToastContainer from './components/Toast';
import ConfirmationModal from './components/ConfirmationModal';
import { initialPresets, initialTemplates } from './data/presets';
import { LogoIcon } from './components/icons';

type Page = 'dashboard' | 'print' | 'config' | 'templates' | 'designer';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('dashboard');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmation, setConfirmation] = useState<{ title: string; message: string; onConfirm: () => void; } | null>(null);

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
  
  const sortedPresets = useMemo(() => 
    [...presets].sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime()),
  [presets]);

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
    setConfirmation({
        title: 'Delete Product Preset',
        message: 'Are you sure you want to delete this product? This action cannot be undone.',
        onConfirm: () => {
            setPresets(prev => prev.filter(p => p.id !== id));
            addToast('Product preset deleted.');
            setConfirmation(null);
        }
    });
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

  const sortedTemplates = useMemo(() =>
    [...templates].sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime()),
  [templates]);

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
     setConfirmation({
        title: 'Delete Template',
        message: 'Are you sure you want to delete this template? This is a critical design asset and cannot be recovered.',
        onConfirm: () => {
            setTemplates(prev => prev.filter(t => t.id !== id));
            addToast('Template deleted.');
            setConfirmation(null);
        }
    });
  };

  // --- Navigation ---
  const navigateToDesigner = (id: string | null) => {
    setEditingTemplateId(id);
    setPage('designer');
  }

  const renderPage = () => {
    const commonProps = {
        presets: sortedPresets,
        templates: sortedTemplates,
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
    <div className="min-h-screen text-stone-800">
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40 no-print border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
                <div className="flex items-center gap-3">
                    <LogoIcon className="h-10 w-10 text-stone-700" />
                    <h1 className="font-dancing-script text-4xl text-stone-800 cursor-pointer" onClick={() => setPage('dashboard')}>Hot Bake</h1>
                </div>
                <nav className="hidden sm:flex items-center bg-stone-100 rounded-lg p-1 space-x-1">
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
      
      <ConfirmationModal
        isOpen={!!confirmation}
        onClose={() => setConfirmation(null)}
        onConfirm={confirmation?.onConfirm}
        title={confirmation?.title || ''}
        message={confirmation?.message || ''}
      />
    </div>
  );
};

export default App;