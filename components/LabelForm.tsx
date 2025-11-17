
import React from 'react';
import type { LabelData, PresetProduct } from '../types';

interface LabelFormProps {
  data: LabelData;
  presets: PresetProduct[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
  onPresetChange: (name: string) => void;
  onPrint: () => void;
  selectedPresetName: string;
  labelCount: number;
  onLabelCountChange: (count: number) => void;
  printDensity: string;
  onPrintDensityChange: (density: string) => void;
}

const LabelForm: React.FC<LabelFormProps> = ({ 
  data, presets, onChange, onLogoChange, onRemoveLogo, onPresetChange, 
  onPrint, selectedPresetName, labelCount, onLabelCountChange, printDensity, onPrintDensityChange 
}) => {

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend className="text-lg font-semibold text-stone-800 mb-4 pb-2 w-full">1. Select a Product</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPresetChange(p.name)}
              className={`text-center p-3 rounded-md border text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 ${
                selectedPresetName === p.name
                  ? 'bg-stone-700 text-white border-stone-700 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-stone-800 mb-4 pb-2 w-full">2. Customize Details</legend>
        <div className="space-y-6">
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
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-stone-600">Size</label>
            <input type="text" id="size" name="size" value={data.size} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" placeholder="e.g., Large, 6-Pack, 8oz Jar" />
          </div>

          <div>
            <label htmlFor="mfgAndDist" className="block text-sm font-medium text-stone-600">Mfg & Dist. By</label>
            <textarea id="mfgAndDist" name="mfgAndDist" rows={3} value={data.mfgAndDist} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    This date is automatically calculated from the Production Date plus the preset's shelf life. The calculation correctly handles month lengths and leap years. Feel free to edit this date manually.
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
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-stone-800 mb-4 pb-2 w-full">3. Print Settings</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="labelCount" className="block text-sm font-medium text-stone-600">Labels per Page</label>
            <select
              id="labelCount"
              name="labelCount"
              value={labelCount}
              onChange={(e) => onLabelCountChange(parseInt(e.target.value, 10))}
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm"
            >
              <option value="4">4 (Large)</option>
              <option value="6">6 (Medium)</option>
              <option value="12">12 (Small)</option>
            </select>
          </div>
          <div>
            <label htmlFor="printDensity" className="block text-sm font-medium text-stone-600">Print Density</label>
             <select
              id="printDensity"
              name="printDensity"
              value={printDensity}
              onChange={(e) => onPrintDensityChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm"
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </fieldset>
      
      <div className="pt-4">
        <button
          type="button"
          onClick={onPrint}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-700 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
        >
          Print Label
        </button>
      </div>
    </form>
  );
};

export default LabelForm;