
import React, { useState, useMemo } from 'react';
import type { PresetProduct } from '../types';
import PresetEditor from '../components/PresetEditor';

interface ConfigPageProps {
    presets: PresetProduct[];
    onAdd: (newPresetData: Omit<PresetProduct, 'id'>) => void;
    onUpdate: (updatedPreset: PresetProduct) => void;
    onDelete: (id: string) => void;
}

const ConfigPage: React.FC<ConfigPageProps> = ({ presets, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPreset, setEditingPreset] = useState<PresetProduct | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddNew = () => {
        setEditingPreset(null);
        setIsModalOpen(true);
    };

    const handleEdit = (preset: PresetProduct) => {
        setEditingPreset(preset);
        setIsModalOpen(true);
    };

    const handleSave = (presetData: Omit<PresetProduct, 'id'> | PresetProduct) => {
        if ('id' in presetData) {
            onUpdate(presetData);
        } else {
            onAdd(presetData);
        }
        setIsModalOpen(false);
    };

    const filteredPresets = useMemo(() => {
        if (!searchTerm) {
            return presets;
        }
        return presets.filter(preset =>
            preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            preset.data.productName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [presets, searchTerm]);


    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b border-stone-200 gap-4">
                <h2 className="text-2xl font-bold text-stone-700">Manage Products</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-auto pl-10 pr-4 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-sm"
                            aria-label="Search products"
                        />
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-stone-700 text-white rounded-md hover:bg-stone-800 text-sm font-medium transition-transform active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span>Add New Product</span>
                    </button>
                </div>
            </div>
            
            {filteredPresets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPresets.map(preset => (
                        <div key={preset.id} className="bg-stone-50 rounded-lg p-5 flex flex-col justify-between border border-stone-200 hover:shadow-md hover:border-stone-300 transition-all">
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-stone-800">{preset.name}</h3>
                                <p className="text-sm text-stone-500 mt-1 truncate" title={preset.data.productName}>{preset.data.productName}</p>
                            </div>
                            <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-stone-200">
                                <button onClick={() => handleEdit(preset)} className="text-sm font-medium text-stone-600 hover:text-stone-900">Edit</button>
                                <button onClick={() => onDelete(preset.id)} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-stone-500 border-2 border-dashed border-stone-300 rounded-lg">
                    {searchTerm ? (
                         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    ) : (
                         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                    )}
                   
                    <h3 className="mt-2 text-sm font-medium text-stone-800">{searchTerm ? 'No matching products' : 'No products found'}</h3>
                    <p className="mt-1 text-sm">{searchTerm ? 'Try adjusting your search.' : 'Click "Add New Product" to get started.'}</p>
                </div>
            )}

            {isModalOpen && (
                <PresetEditor
                    preset={editingPreset}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ConfigPage;