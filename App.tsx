
import React, { useState } from 'react';
import type { LabelData, PresetProduct } from './types';
import LabelForm from './components/LabelForm';
import LabelPreview from './components/LabelPreview';

const presets: PresetProduct[] = [
  {

    name: 'Chocolate Chip Cookies',
    shelfLifeDays: 7,
    data: {
      productName: 'CHOCOLATE CHIP COOKIES',
      ingredients: 'Enriched Wheat Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Sugar, Brown Sugar, Butter (Cream, Salt), Eggs, Vanilla Extract, Baking Soda, Salt, Chocolate Chips (Sugar, Chocolate Liquor, Cocoa Butter, Soy Lecithin, Vanilla Extract).',
      allergens: 'CONTAINS: WHEAT, MILK, EGGS, SOY.',
      quantity: '6 Pieces',
      netWeight: '7 oz | 200g',
      tagline: 'Freshly baked happiness.',
    }
  },
  {
    name: 'Sourdough Bread',
    shelfLifeDays: 5,
    data: {
      productName: 'ARTISAN SOURDOUGH BREAD',
      ingredients: 'Organic Wheat Flour, Water, Sourdough Starter (Flour, Water), Sea Salt.',
      allergens: 'CONTAINS: WHEAT.',
      quantity: '1 Loaf',
      netWeight: '24 oz | 680g',
      tagline: 'Naturally leavened, handcrafted.',
    }
  },
  {
    name: 'Strawberry Jam',
    shelfLifeDays: 365,
    data: {
      productName: 'HOMEMADE STRAWBERRY JAM',
      ingredients: 'Strawberries, Sugar, Lemon Juice, Pectin.',
      allergens: '',
      quantity: '1 Jar',
      netWeight: '8 oz | 227g',
      tagline: 'Sunshine in a jar.',
    }
  },
];

const App: React.FC = () => {
  const initialLabelData: LabelData = {
    brandName: "iCAN",
    productName: 'CHOCOLATE CHIP COOKIES',
    tagline: 'Quality You Can Taste',
    logo: '',
    ingredients: 'Enriched Wheat Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Sugar, Brown Sugar, Butter (Cream, Salt), Eggs, Vanilla Extract, Baking Soda, Salt, Chocolate Chips (Sugar, Chocolate Liquor, Cocoa Butter, Soy Lecithin, Vanilla Extract).',
    allergens: 'CONTAINS: WHEAT, MILK, EGGS, SOY.',
    mfgAndDist: "Your Company Name\nYour City, Country",
    quantity: '6 Pieces',
    netWeight: '7 oz | 200g',
    disclaimer: 'MADE IN COTTAGE FOOD OPERATION THAT IS NOT SUBJECT TO ROUTINE GOVERNMENT FOOD SAFETY INSPECTIONS.',
    productionDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
  };

  const [labelData, setLabelData] = useState<LabelData>(initialLabelData);
  const [selectedPresetShelfLife, setSelectedPresetShelfLife] = useState<number | null>(7);

  const calculateExpiryDate = (startDate: string, days: number): string => {
    if (!startDate || isNaN(days)) return '';
    
    // Using UTC to avoid timezone-related errors. The JavaScript Date object's
    // built-in logic correctly handles rollovers for months, years, and leap years.
    const parts = startDate.split('-').map(part => parseInt(part, 10));
    const utcDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    
    utcDate.setUTCDate(utcDate.getUTCDate() + days);

    return utcDate.toISOString().split('T')[0];
  };
  
    // Set initial expiry date
  useState(() => {
    setLabelData(prev => ({
        ...prev,
        expiryDate: calculateExpiryDate(prev.productionDate, 7)
    }))
  }, [])


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLabelData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'productionDate' && selectedPresetShelfLife !== null) {
        newData.expiryDate = calculateExpiryDate(value, selectedPresetShelfLife);
      }
      return newData;
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLabelData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLabelData(prev => ({ ...prev, logo: '' }));
  };

  const handlePresetChange = (presetName: string) => {
    const selectedPreset = presets.find(p => p.name === presetName);
    if (selectedPreset) {
      const newExpiryDate = calculateExpiryDate(labelData.productionDate, selectedPreset.shelfLifeDays);
      setLabelData(prev => ({
        ...prev,
        ...selectedPreset.data,
        expiryDate: newExpiryDate,
      }));
      setSelectedPresetShelfLife(selectedPreset.shelfLifeDays);
    } else {
        setLabelData(initialLabelData);
      setSelectedPresetShelfLife(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="font-dancing-script text-5xl text-stone-700">iCAN</h1>
          <p className="text-stone-500 mt-2">Create and print professional food labels.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <LabelForm
              data={labelData}
              onChange={handleInputChange}
              onLogoChange={handleLogoChange}
              onRemoveLogo={handleRemoveLogo}
              presets={presets}
              onPresetChange={handlePresetChange}
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-stone-700 mb-4 text-center lg:text-left">Live Preview</h2>
            <div className="flex-grow flex items-center justify-center bg-white p-4 rounded-lg shadow-md">
                <LabelPreview data={labelData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
