import React from 'react';
import type { LabelData } from '../types';
import { MagicWandIcon, SpinnerIcon } from './icons';

interface LabelFormProps {
  data: LabelData;
  isLoading: { ingredients: boolean; tagline: boolean };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
  onGenerateIngredients: () => void;
  onGenerateTagline: () => void;
}

const LabelForm: React.FC<LabelFormProps> = ({ data, isLoading, onChange, onLogoChange, onRemoveLogo, onGenerateIngredients, onGenerateTagline }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
          <div className="mt-1 flex rounded-md shadow-sm">
            <input type="text" id="tagline" name="tagline" value={data.tagline} onChange={onChange} className="block w-full flex-1 rounded-none rounded-l-md border-stone-300 focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
            <button onClick={onGenerateTagline} disabled={isLoading.tagline} className="relative inline-flex items-center space-x-2 rounded-r-md border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 disabled:bg-stone-200 disabled:cursor-not-allowed">
              {isLoading.tagline ? <SpinnerIcon /> : <MagicWandIcon />}
              <span>Suggest</span>
            </button>
          </div>
      </div>

      <div>
        <label htmlFor="ingredients" className="block text-sm font-medium text-stone-600">Ingredients</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <textarea id="ingredients" name="ingredients" rows={4} value={data.ingredients} onChange={onChange} className="block w-full flex-1 rounded-none rounded-l-md border-stone-300 focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
          <button onClick={onGenerateIngredients} disabled={isLoading.ingredients} className="relative inline-flex items-center space-x-2 rounded-r-md border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 disabled:bg-stone-200 disabled:cursor-not-allowed">
              {isLoading.ingredients ? <SpinnerIcon /> : <MagicWandIcon />}
              <span>Suggest</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="allergens" className="block text-sm font-medium text-stone-600">Allergen Information</label>
          <input type="text" id="allergens" name="allergens" value={data.allergens} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="netWeight" className="block text-sm font-medium text-stone-600">Net Weight</label>
          <input type="text" id="netWeight" name="netWeight" value={data.netWeight} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-stone-600">Quantity</label>
          <input type="text" id="quantity" name="quantity" value={data.quantity} onChange={onChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm" />
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
          <label htmlFor="expiryDate" className="block text-sm font-medium text-stone-600">Expiry Date</label>
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
