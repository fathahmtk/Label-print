import React, { useState, useEffect, useRef } from 'react';
import type { PresetProduct } from '../types';

interface PresetEditorProps {
    preset: PresetProduct | null;
    onSave: (presetData: Omit<PresetProduct, 'id' | 'lastModified'> | PresetProduct) => void;
    onClose: () => void;
    addToast: (message: string, type?: 'success' | 'error') => void;
}

const emptyData = {
    name: '',
    shelfLifeDays: 7,
    data: {
      productName: '',
      productName_ar: '',
      tagline: '',
      tagline_ar: '',
      size: '',
      ingredients: '',
      ingredients_ar: '',
      allergens: '',
      allergens_ar: '',
      mfgAndDist: '',
      mfgAndDist_ar: '',
      disclaimer: '',
      disclaimer_ar: '',
      quantityValue: '1',
      quantityUnit: 'Pieces',
      unitWeightValue: '1',
      unitWeightUnit: 'g',
      sku: '',
    }
}

const PresetEditor: React.FC<PresetEditorProps> = ({ preset, onSave, onClose, addToast }) => {
    const [formData, setFormData] = useState<Omit<PresetProduct, 'id' | 'lastModified'>>(emptyData);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (preset) {
            setFormData({
                name: preset.name,
                shelfLifeDays: preset.shelfLifeDays,
                data: { ...emptyData.data, ...preset.data },
            });
        } else {
             setFormData(emptyData);
        }
    }, [preset]);

    // Handle Escape key and focus trapping
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            } else if (event.key === 'Tab' && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumeric = type === 'number';
        
        if (name in formData.data) {
            setFormData(prev => ({
                ...prev,
                data: {
                    ...prev.data,
                    [name]: isNumeric ? (value === '' ? '' : parseFloat(value)) : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: isNumeric ? (value === '' ? '' : parseInt(value, 10)) : value
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (preset) {
            onSave({ ...formData, id: preset.id });
        } else {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 modal-backdrop" role="dialog" aria-modal="true">
            <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto modal-panel">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex justify-between items-center pb-4 border-b">
                        <h2 className="text-xl font-bold text-stone-700">{preset ? 'Edit Product' : 'Add New Product'}</h2>
                        <button type="button" onClick={onClose} className="text-stone-400 hover:text-stone-600 text-3xl leading-none" aria-label="Close">&times;</button>
                    </div>

                    <div className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-stone-600">Preset Name (Internal)</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm" autoFocus />
                            </div>
                            <div>
                                <label htmlFor="shelfLifeDays" className="block text-sm font-medium text-stone-600">Shelf Life (Days)</label>
                                <input type="number" id="shelfLifeDays" name="shelfLifeDays" value={formData.shelfLifeDays} onChange={handleChange} required min="0" className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm" />
                            </div>
                        </div>
                        <div>
                           <label htmlFor="sku" className="block text-sm font-medium text-stone-600">SKU / Barcode Data</label>
                           <input type="text" id="sku" name="sku" value={formData.data.sku} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm" placeholder="e.g., 123456789012" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="productName" className="block text-sm font-medium text-stone-600">Product Name (EN)</label>
                                <input type="text" id="productName" name="productName" value={formData.data.productName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="productName_ar" className="block text-sm font-medium text-stone-600">Product Name (AR)</label>
                                <input type="text" id="productName_ar" name="productName_ar" value={formData.data.productName_ar} onChange={handleChange} dir="rtl" className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm font-arabic" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="tagline" className="block text-sm font-medium text-stone-600">Tagline (EN)</label>
                                <input type="text" id="tagline" name="tagline" value={formData.data.tagline} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="tagline_ar" className="block text-sm font-medium text-stone-600">Tagline (AR)</label>
                                <input type="text" id="tagline_ar" name="tagline_ar" value={formData.data.tagline_ar} onChange={handleChange} dir="rtl" className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm font-arabic" />
                            </div>
                        </div>
                        
                        <div>
                          <label htmlFor="size" className="block text-sm font-medium text-stone-600">Size</label>
                          <input type="text" id="size" name="size" value={formData.data.size} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm" placeholder="e.g., Large, 6-Pack, 8oz Jar" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center">
                               <label htmlFor="ingredients" className="block text-sm font-medium text-stone-600">Ingredients (EN)</label>
                            </div>
                            <textarea id="ingredients" name="ingredients" rows={3} value={formData.data.ingredients} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm" placeholder="Enter ingredients, separated by commas." />
                        </div>
                        <div>
                            <label htmlFor="ingredients_ar" className="block text-sm font-medium text-stone-600">Ingredients (AR)</label>
                            <textarea id="ingredients_ar" name="ingredients_ar" rows={3} value={formData.data.ingredients_ar} onChange={handleChange} dir="rtl" className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm font-arabic" />
                        </div>
                         <div>
                            <label htmlFor="allergens" className="block text-sm font-medium text-stone-600">Allergen Info (EN)</label>
                            <input type="text" id="allergens" name="allergens" value={formData.data.allergens} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="allergens_ar" className="block text-sm font-medium text-stone-600">Allergen Info (AR)</label>
                            <input type="text" id="allergens_ar" name="allergens_ar" value={formData.data.allergens_ar} onChange={handleChange} dir="rtl" className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm font-arabic" />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="quantityValue" className="block text-sm font-medium text-stone-600">Quantity</label>
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <input type="number" id="quantityValue" name="quantityValue" value={formData.data.quantityValue} onChange={handleChange} className="block w-full flex-1 rounded-none rounded-l-md border-stone-300 sm:text-sm" />
                                <input type="text" name="quantityUnit" value={formData.data.quantityUnit} onChange={handleChange} className="block w-full flex-1 rounded-none rounded-r-md border-stone-300 sm:text-sm" list="quantity-units" />
                              </div>
                            </div>
                             <div>
                              <label htmlFor="unitWeightValue" className="block text-sm font-medium text-stone-600">Weight per Unit</label>
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <input type="number" id="unitWeightValue" name="unitWeightValue" value={formData.data.unitWeightValue} onChange={handleChange} className="block w-full flex-1 rounded-none rounded-l-md border-stone-300 sm:text-sm" />
                                <select name="unitWeightUnit" value={formData.data.unitWeightUnit} onChange={handleChange} className="block w-auto rounded-none rounded-r-md border-stone-300 sm:text-sm">
                                  <option value="g">g</option>
                                  <option value="oz">oz</option>
                                </select>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 mt-6 border-t flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-stone-700 text-white rounded-md hover:bg-stone-800 text-sm font-medium">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PresetEditor;