
import React from 'react';
import type { LabelData, PresetProduct } from '../types';

interface LabelFormProps {
  data: LabelData;
  presets: PresetProduct[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
  onPresetChange: (name: string) => void;
}

const LabelForm: React.FC<LabelFormProps> = ({ data, presets, onChange, onLogoChange, onRemoveLogo, onPresetChange }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="preset" className="block text-sm font-medium text-stone-600">Load Preset</label>
        <select
          id="preset"
          name="preset"
          onChange={(e) => onPresetChange(e.target.value)}
          defaultValue="Chocolate Chip Cookies"
          className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm"
        >
          <option value="">-- Select a Preset --</option>
          {presets.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-stone-600">Brand Name</label>
          <input type="text" id="brandName" name="brandName" value={data.brandName} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
        </div>
         <div>
          <label className="block text-sm font-medium text-stone-600">Brand Logo</label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              id="logoUpload"
              name="logoUpload"
              accept="image/*"
              onChange={onLogoChange}
              className="hidden"
            />
            {data.logo ? (
              <>
                <img src={data.logo} alt="Logo preview" className="h-10 w-10 object-contain rounded-md bg-stone-50 p-1 border" />
                <button
                  type="button"
                  onClick={onRemoveLogo}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
                 <label htmlFor="logoUpload" className="cursor-pointer text-sm font-medium text-stone-600 hover:text-stone-800">
                  Change
                </label>
              </>
            ) : (
              <label htmlFor="logoUpload" className="cursor-pointer rounded-md border border-stone-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2">
                Upload
              </label>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-stone-600">Product Name</label>
          <input type="text" id="productName" name="productName" value={data.productName} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
        </div>
      </div>

      <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-stone-600">Tagline</label>
          <input type="text" id="tagline" name="tagline" value={data.tagline} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
      </div>

      <div>
        <label htmlFor="ingredients" className="block text-sm font-medium text-stone-600">Ingredients</label>
        <textarea id="ingredients" name="ingredients" rows={4} value={data.ingredients} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="allergens" className="block text-sm font-medium text-stone-600">Allergen Information</label>
          <input type="text" id="allergens" name="allergens" value={data.allergens} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="quantityValue" className="block text-sm font-medium text-stone-600">Quantity</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              id="quantityValue"
              name="quantityValue"
              value={data.quantityValue}
              onChange={onChange}
              className="block w-full flex-1 rounded-none rounded-l-md border-stone-300 focus:border-stone-500 focus:ring-stone-500 sm:text-sm"
              placeholder="Value"
            />
            <input
              type="text"
              name="quantityUnit"
              value={data.quantityUnit}
              onChange={onChange}
              className="block w-full flex-1 rounded-none rounded-r-md border-stone-300 focus:border-stone-500 focus:ring-stone-500 sm:text-sm"
              placeholder="Unit"
              list="quantity-units"
            />
            <datalist id="quantity-units">
              <option value="Pieces" />
              <option value="g" />
              <option value="kg" />
              <option value="oz" />
              <option value="lb" />
              <option value="Jar" />
              <option value="Loaf" />
              <option value="Portions" />
            </datalist>
          </div>
        </div>
         <div>
          <label htmlFor="unitWeightValue" className="block text-sm font-medium text-stone-600">Weight per Unit</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              id="unitWeightValue"
              name="unitWeightValue"
              value={data.unitWeightValue}
              onChange={onChange}
              className="block w-full flex-1 rounded-none rounded-l-md border-stone-300 focus:border-stone-500 focus:ring-stone-500 sm:text-sm"
              placeholder="e.g., 30"
            />
            <select
              name="unitWeightUnit"
              value={data.unitWeightUnit}
              onChange={onChange}
              className="block w-auto rounded-none rounded-r-md border-stone-300 focus:border-stone-500 focus:ring-stone-500 sm:text-sm"
            >
              <option value="g">g</option>
              <option value="oz">oz</option>
            </select>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <label htmlFor="netWeight" className="block text-sm font-medium text-stone-600">Net Weight</label>
            <div className="relative group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 bg-stone-800 text-white text-xs rounded py-1 px-2 z-10">
                Calculated automatically from Quantity × Weight per Unit.
              </div>
            </div>
          </div>
          <input type="text" id="netWeight" name="netWeight" value={data.netWeight} onChange={onChange} readOnly className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm bg-stone-50 cursor-not-allowed" />
        </div>
        <div>
            <label htmlFor="mfgAndDist" className="block text-sm font-medium text-stone-600">Mfg & Dist. By</label>
            <textarea id="mfgAndDist" name="mfgAndDist" rows={3} value={data.mfgAndDist} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="productionDate" className="block text-sm font-medium text-stone-600">Production Date</label>
          <input type="date" id="productionDate" name="productionDate" value={data.productionDate} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <label htmlFor="expiryDate" className="block text-sm font-medium text-stone-600">Expiry Date</label>
            <div className="relative group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 bg-stone-800 text-white text-xs rounded py-1 px-2 z-10">
                This date is automatically calculated from the Production Date plus the preset's shelf life. The calculation correctly handles month lengths (e.g., Jan 31 + 1 day = Feb 1) and leap years (e.g., Feb 28, 2024 + 1 day = Feb 29). Feel free to edit this date manually.
              </div>
            </div>
          </div>
          <input type="date" id="expiryDate" name="expiryDate" value={data.expiryDate} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
        </div>
      </div>
      
      <div>
          <label htmlFor="disclaimer" className="block text-sm font-medium text-stone-600">Disclaimer</label>
          <textarea id="disclaimer" name="disclaimer" rows={2} value={data.disclaimer} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-700 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
        >
          Print Label
        </button>
      </div>
    </form>
  );
};

export default LabelForm;
