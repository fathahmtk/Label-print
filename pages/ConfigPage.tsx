
import React, { useState } from 'react';
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

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-stone-700">Manage Products</h2>
                <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-stone-700 text-white rounded-md hover:bg-stone-800 text-sm font-medium"
                >
                    Add New Product
                </button>
            </div>
            
            <div className="space-y-4">
                {presets.length > 0 ? (
                    presets.map(preset => (
                        <div key={preset.id} className="flex justify-between items-center p-4 border rounded-lg hover:shadow-sm transition-shadow">
                            <div>
                                <h3 className="font-bold text-stone-800">{preset.name}</h3>
                                <p className="text-sm text-stone-500">{preset.data.productName}</p>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => handleEdit(preset)} className="text-sm font-medium text-stone-600 hover:text-stone-900">Edit</button>
                                <button onClick={() => onDelete(preset.id)} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-stone-500">
                        <p>No products found.</p>
                        <p>Click "Add New Product" to get started.</p>
                    </div>
                )}
            </div>

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
