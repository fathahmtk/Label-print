import React, { useState, useEffect, useRef } from 'react';
import type { PresetProduct } from '../types';
import { translateText, suggestTaglines, analyzeIngredients } from '../services/geminiService';
import { TranslateIcon, SparklesIcon } from './icons';

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

type LoadingState = {
    [key: string]: boolean;
}

const PresetEditor: React.FC<PresetEditorProps> = ({ preset, onSave, onClose, addToast }) => {
    const [formData, setFormData] = useState<Omit<PresetProduct, 'id' | 'lastModified'>>(emptyData);
    const [loading, setLoading] = useState<LoadingState>({});
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

    const handleAITranslate = async (fieldName: keyof typeof formData.data) => {
        // FIX: Cast fieldName to string to avoid type errors with .replace()
        const sourceField = String(fieldName).replace('_ar', '') as keyof typeof formData.data;
        const sourceText = formData.data[sourceField];
        if (!sourceText) {
            addToast('Please enter English text first.', 'error');
            return;
        }

        setLoading(prev => ({ ...prev, [fieldName]: true }));
        try {
            const translatedText = await translateText(sourceText as string);
            setFormData(prev => ({
                ...prev,
                data: { ...prev.data, [fieldName]: translatedText }
            }));
        } catch (error) {
            addToast('AI translation failed. Please try again.', 'error');
        } finally {
            setLoading(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleAISuggestTaglines = async () => {
        if (!formData.data.productName) {
            addToast('Please enter a product name first.', 'error');
            return;
        }
        setLoading(prev => ({ ...prev, 'tagline': true }));
        try {
            const suggestions = await suggestTaglines(formData.data.productName);
            if (suggestions.length > 0) {
                 setFormData(prev => ({
                    ...prev,
                    data: { ...prev.data, tagline: suggestions[0] }
                }));
            } else {
                 addToast('AI could not generate suggestions. Try a different product name.', 'error');
            }
        } catch (error) {
            addToast('AI suggestion failed. Please try again.', 'error');
        } finally {
            setLoading(prev => ({ ...prev, 'tagline': false }));
        }
    };
    
    const handleAIAnalyzeIngredients = async () => {
        if (!formData.data.ingredients) {
            addToast('Please enter ingredients first.', 'error');
            return;
        }
        setLoading(prev => ({...prev, 'ingredients': true }));
        try {
            const { formattedIngredients, detectedAllergens } = await analyzeIngredients(formData.data.ingredients);
            setFormData(prev => ({
                ...prev,
                data: {
                    ...prev.data,
                    ingredients: formattedIngredients,
                    allergens: detectedAllergens,
                }
            }));
            
            // Also translate the new ingredients and allergens to Arabic
            if(formattedIngredients) {
                const translatedIngredients = await translateText(formattedIngredients);
                setFormData(prev => ({...prev, data: { ...prev.data, ingredients_ar: translatedIngredients }}));
            }
            if(detectedAllergens){
                 const translatedAllergens = await translateText(detectedAllergens);
                 setFormData(prev => ({...prev, data: { ...prev.data, allergens_ar: translatedAllergens }}));
            }

        } catch(error) {
            addToast('AI analysis failed. Please try again.', 'error');
        } finally {
             setLoading(prev => ({...prev, 'ingredients': false }));
        }
    };

    const renderAITranslateButton = (fieldName: keyof typeof formData.data) => (
        <button
            type="button"
            onClick={() => handleAITranslate(fieldName)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 disabled:opacity-50"
            title="Translate from English with AI"
            disabled={loading[fieldName]}
        >
            {loading[fieldName] ? <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></div> : <TranslateIcon className="w-4 h-4" />}
        </button>
    );

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
                             <div className="relative">
                                <label htmlFor="productName_ar" className="block text-sm font-medium text-stone-600">Product Name (AR)</label>
                                <input type="text" id="productName_ar" name="productName_ar" value={formData.data.productName_ar} onChange={handleChange} dir="rtl" className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm font-arabic" />
                                {renderAITranslateButton('productName_ar')}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label htmlFor="tagline" className="block text-sm font-medium text-stone-600">Tagline (EN)</label>
                                <input type="text" id="tagline" name="tagline" value={formData.data.tagline} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm" />
                                <button type="button" onClick={handleAISuggestTaglines} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 disabled:opacity-50" title="Suggest with AI" disabled={loading['tagline']}>
                                     {loading['tagline'] ? <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-4 h-4" />}
                                </button>
                            </div>
                             <div className="relative">
                                <label htmlFor="tagline_ar" className="block text-sm font-medium text-stone-600">Tagline (AR)</label>
                                <input type="text" id="tagline_ar" name="tagline_ar" value={formData.data.tagline_ar} onChange={handleChange} dir="rtl" className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm font-arabic" />
                                {renderAITranslateButton('tagline_ar')}
                            </div>
                        </div>
                        
                        <div>
                          <label htmlFor="size" className="block text-sm font-medium text-stone-600">Size</label>
                          <input type="text" id="size" name="size" value={formData.data.size} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm" placeholder="e.g., Large, 6-Pack, 8oz Jar" />
                        </div>

                        <div className="relative">
                            <div className="flex justify-between items-center">
                               <label htmlFor="ingredients" className="block text-sm font-medium text-stone-600">Ingredients (EN)</label>
                                <button type="button" onClick={handleAIAnalyzeIngredients} disabled={loading['ingredients']} className="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-800 disabled:opacity-50">
                                     {loading['ingredients'] ? <> <div className="w-3 h-3 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></div>Analyzing...</> : <><SparklesIcon className="w-3 h-3" /> Auto-Format & Detect Allergens</>}
                                </button>
                            </div>
                            <textarea id="ingredients" name="ingredients" rows={3} value={formData.data.ingredients} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm" placeholder="Paste a list of ingredients, then click the button above." />
                        </div>
                        <div className="relative">
                            <label htmlFor="ingredients_ar" className="block text-sm font-medium text-stone-600">Ingredients (AR)</label>
                            <textarea id="ingredients_ar" name="ingredients_ar" rows={3} value={formData.data.ingredients_ar} onChange={handleChange} dir="rtl" className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm font-arabic" />
                            {renderAITranslateButton('ingredients_ar')}
                        </div>
                         <div className="relative">
                            <label htmlFor="allergens" className="block text-sm font-medium text-stone-600">Allergen Info (EN)</label>
                            <input type="text" id="allergens" name="allergens" value={formData.data.allergens} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm" />
                        </div>
                         <div className="relative">
                            <label htmlFor="allergens_ar" className="block text-sm font-medium text-stone-600">Allergen Info (AR)</label>
                            <input type="text" id="allergens_ar" name="allergens_ar" value={formData.data.allergens_ar} onChange={handleChange} dir="rtl" className="mt-1 block w-full rounded-md border-stone-300 shadow-sm sm:text-sm font-arabic" />
                            {renderAITranslateButton('allergens_ar')}
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