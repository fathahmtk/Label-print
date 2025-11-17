import React from 'react';
import type { PresetProduct, LabelTemplate } from '../types';
import { ExportIcon, ImportIcon } from '../components/icons';

interface DashboardPageProps {
    presets: PresetProduct[];
    templates: LabelTemplate[];
    setPage: (page: 'print' | 'config' | 'templates') => void;
    onEditTemplate: (id: string) => void;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ presets, templates, setPage, onEditTemplate, onExport, onImport }) => {

    const recentPresets = presets.slice(0, 3);
    const recentTemplates = templates.slice(0, 3);
    
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-stone-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button onClick={() => setPage('print')} className="bg-white p-6 rounded-lg shadow-lg text-left hover:shadow-xl transition-shadow flex items-center space-x-4">
                        <div className="p-3 bg-stone-100 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-stone-800">Print Labels</h3>
                            <p className="text-sm text-stone-500">Go to the main print screen.</p>
                        </div>
                    </button>
                     <button onClick={() => setPage('config')} className="bg-white p-6 rounded-lg shadow-lg text-left hover:shadow-xl transition-shadow flex items-center space-x-4">
                         <div className="p-3 bg-stone-100 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-stone-800">Manage Products</h3>
                            <p className="text-sm text-stone-500">Add or edit your products.</p>
                        </div>
                    </button>
                     <button onClick={() => setPage('templates')} className="bg-white p-6 rounded-lg shadow-lg text-left hover:shadow-xl transition-shadow flex items-center space-x-4">
                        <div className="p-3 bg-stone-100 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-stone-800">Manage Templates</h3>
                            <p className="text-sm text-stone-500">Create or edit label layouts.</p>
                        </div>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold text-stone-700 mb-4">Recent Products</h2>
                     <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                        {recentPresets.length > 0 ? recentPresets.map(preset => (
                            <div key={preset.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-md">
                                <div>
                                    <p className="font-semibold text-stone-800">{preset.name}</p>
                                    <p className="text-xs text-stone-500">{preset.data.productName}</p>
                                </div>
                                <button onClick={() => setPage('config')} className="text-sm font-medium text-stone-600 hover:text-stone-900">Edit</button>
                            </div>
                        )) : <p className="text-stone-500 text-center py-4">No products yet.</p>}
                     </div>
                </div>
                 <div>
                    <h2 className="text-2xl font-bold text-stone-700 mb-4">Recent Templates</h2>
                     <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                        {recentTemplates.length > 0 ? recentTemplates.map(template => (
                            <div key={template.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-md">
                                <div>
                                    <p className="font-semibold text-stone-800">{template.name}</p>
                                    <p className="text-xs text-stone-500">{template.widthMm}mm x {template.heightMm}mm</p>
                                </div>
                                <button onClick={() => onEditTemplate(template.id)} className="text-sm font-medium text-stone-600 hover:text-stone-900">Edit</button>
                            </div>
                        )) : <p className="text-stone-500 text-center py-4">No templates yet.</p>}
                     </div>
                </div>
            </div>
            
            <div>
                <h2 className="text-2xl font-bold text-stone-700 mb-4">Data Management</h2>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="font-semibold text-stone-800">Export Data</h3>
                            <p className="text-sm text-stone-500 mt-1">Download a backup of all your products and templates to a single JSON file.</p>
                        </div>
                         <div className="flex justify-start md:justify-end">
                             <button onClick={onExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50">
                                <ExportIcon className="w-5 h-5" />
                                <span>Export All Data</span>
                            </button>
                        </div>
                    </div>
                     <hr className="my-6" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="font-semibold text-stone-800">Import Data</h3>
                            <p className="text-sm text-stone-500 mt-1">
                                <span className="font-bold text-red-600">Warning:</span> Importing will overwrite all existing data.
                            </p>
                        </div>
                         <div className="flex justify-start md:justify-end">
                             <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50">
                                <ImportIcon className="w-5 h-5" />
                                <span>Import from File</span>
                                <input type="file" className="hidden" accept=".json" onChange={onImport} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;