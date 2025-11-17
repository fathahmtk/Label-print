
import React from 'react';
import type { LabelData } from '../types';

interface LabelPreviewProps {
  data: LabelData;
  labelCount: number;
  printDensity: string;
}

// Helper component for the label's visual content to avoid duplication.
const LabelContent: React.FC<{ data: LabelData }> = ({ data }) => {
  const getProductNameFontSize = (name: string = ''): string => {
    const length = name.length;
    if (length > 40) return 'text-xl';
    if (length > 30) return 'text-2xl';
    if (length > 20) return 'text-3xl';
    return 'text-4xl';
  };

  const getTaglineFontSize = (tagline: string = ''): string => {
    const length = tagline.length;
    if (length > 30) return 'text-[10px]';
    return 'text-xs';
  };

  const getIngredientsFontSize = (ingredients: string = ''): string => {
    const length = ingredients.length;
    if (length > 400) return 'text-[9px] leading-snug';
    if (length > 250) return 'text-[10px] leading-normal';
    if (length > 150) return 'text-[11px] leading-normal';
    return 'text-xs leading-relaxed';
  };

  const getMfgFontSize = (mfg: string = ''): string => {
    const length = mfg.length;
    if (length > 120) return 'text-[9px]';
    if (length > 80) return 'text-[10px]';
    if (length > 50) return 'text-[11px]';
    return 'text-xs';
  };

  const getDisclaimerFontSize = (disclaimer: string = ''): string => {
    const length = disclaimer.length;
    if (length > 200) return 'text-[8px]';
    if (length > 120) return 'text-[9px]';
    return 'text-[10px]';
  };

  return (
    <>
      <main className="flex-grow flex flex-row">
        {/* Left Branding Column */}
        <div className="w-2/5 bg-stone-50/50 p-8 flex flex-col justify-between items-center text-center border-r border-stone-200">
          {data.logo ? (
            <img src={data.logo} alt="Brand Logo" className="max-h-24 w-auto object-contain" />
          ) : (
            <p className="font-dancing-script text-4xl">{data.brandName}</p>
          )}
          <h1 className={`font-black tracking-tight leading-snug uppercase ${getProductNameFontSize(data.productName)}`}>{data.productName}</h1>
          <p className={`tracking-[0.3em] font-semibold text-stone-600 ${getTaglineFontSize(data.tagline)}`}>{data.tagline}</p>
          {data.size && (
            <div className="border-t border-b border-stone-300 py-1 px-4">
              <p className="text-sm font-bold tracking-widest text-stone-700 uppercase">{data.size}</p>
            </div>
          )}
        </div>

        {/* Right Info Column */}
        <div className="w-3/5 p-8 flex flex-col text-sm space-y-4">
          {/* Ingredients Section */}
          <div>
            <h2 className="tracking-widest text-xs font-bold text-stone-800 uppercase">Ingredients</h2>
            <p className={`mt-2 text-stone-700 ${getIngredientsFontSize(data.ingredients)}`}>{data.ingredients}</p>
            {data.allergens && <p className="text-xs font-bold mt-2 text-stone-800">{data.allergens}</p>}
          </div>

          {/* Mfg Section */}
          <div>
            <h2 className="tracking-widest text-xs font-bold text-stone-800 uppercase">Mfg. & Dist. By</h2>
            <p className={`whitespace-pre-wrap text-stone-600 mt-1 ${getMfgFontSize(data.mfgAndDist)}`}>{data.mfgAndDist}</p>
          </div>

          {/* Spacer */}
          <div className="flex-grow"></div>
          
          {/* Data Section */}
          <div className="grid grid-cols-2 gap-4 items-end pt-4 border-t border-stone-200">
            {/* Left details column */}
            <div className="space-y-3">
              <div className="text-left">
                <p className="text-xs font-bold uppercase">Net Wt.</p>
                <p className="text-sm text-stone-600">{data.netWeight}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left">
                <div>
                  <p className="text-xs font-bold uppercase">Prod. Date</p>
                  <p className="text-sm text-stone-600">{data.productionDate}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase">Exp. Date</p>
                  <p className="text-sm text-stone-600">{data.expiryDate}</p>
                </div>
              </div>
            </div>
            {/* Right quantity circle */}
            <div className="flex justify-center items-center">
              <div className="w-24 h-24 rounded-full bg-stone-100 flex flex-col items-center justify-center p-1 border border-stone-200">
                <p className="text-4xl font-bold leading-tight">{data.quantityValue}</p>
                {data.quantityUnit && <p className="text-sm tracking-wider uppercase text-center text-stone-600">{data.quantityUnit}</p>}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-stone-200 p-2">
        <p className={`text-center font-semibold tracking-wider text-stone-700 ${getDisclaimerFontSize(data.disclaimer)}`}>{data.disclaimer}</p>
      </footer>
    </>
  );
};

const LabelPreview: React.FC<LabelPreviewProps> = ({ data, labelCount, printDensity }) => {
  const getPrintLayoutClasses = (count: number): string => {
    if (count === 12) return 'labels-12';
    if (count === 6) return 'labels-6';
    return 'labels-4';
  };

  const printClasses = `${getPrintLayoutClasses(labelCount)} ${printDensity === 'high' ? 'density-high' : ''}`;

  return (
    <>
      {/* Live Preview for Screen */}
      <div id="label-preview" className="no-print w-full max-w-2xl aspect-[16/9] bg-white text-black shadow-2xl border border-stone-200 flex flex-col font-['Montserrat'] rounded-lg overflow-hidden">
        <LabelContent data={data} />
      </div>

      {/* Print Area for A4 Sheet - hidden on screen, visible on print */}
      <div id="print-area" className={printClasses}>
        <div className="print-grid-container">
          {[...Array(labelCount)].map((_, i) => (
            <div key={i} className="label-copy bg-white text-black flex flex-col font-['Montserrat'] overflow-hidden">
              <LabelContent data={data} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LabelPreview;