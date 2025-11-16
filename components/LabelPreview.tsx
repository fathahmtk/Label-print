
import React from 'react';
import type { LabelData } from '../types';

interface LabelPreviewProps {
  data: LabelData;
}

const LabelPreview: React.FC<LabelPreviewProps> = ({ data }) => {

  return (
    <div id="label-preview" className="w-full max-w-2xl aspect-[16/9] bg-white text-black shadow-2xl border border-stone-200 flex flex-col font-['Montserrat'] rounded-lg overflow-hidden">
      
      <main className="flex-grow flex flex-row">
        {/* Left Branding Column */}
        <div className="w-2/5 bg-stone-50/50 p-6 flex flex-col justify-center items-center text-center border-r border-stone-200">
            {data.logo ? (
            <img src={data.logo} alt="Brand Logo" className="max-h-24 w-auto mb-3 object-contain" />
            ) : (
            <p className="font-dancing-script text-4xl">{data.brandName}</p>
            )}
            <h1 className="text-3xl font-black tracking-tight leading-snug mt-3 uppercase">{data.productName}</h1>
            <p className="text-xs tracking-[0.3em] font-semibold text-stone-600 mt-2">{data.tagline}</p>
        </div>

        {/* Right Info Column */}
        <div className="w-3/5 p-6 flex flex-col text-sm space-y-4">
            {/* Ingredients Section */}
            <div>
                <h2 className="tracking-widest text-xs font-bold text-stone-800 uppercase">Ingredients</h2>
                <p className="text-xs leading-relaxed mt-2 text-stone-700">{data.ingredients}</p>
                {data.allergens && <p className="text-xs font-bold mt-2 text-stone-800">{data.allergens}</p>}
            </div>

             {/* Mfg Section */}
            <div>
                <h2 className="tracking-widest text-xs font-bold text-stone-800 uppercase">Mfg. & Dist. By</h2>
                <p className="whitespace-pre-wrap text-stone-600 text-xs mt-1">{data.mfgAndDist}</p>
            </div>

            {/* Spacer */}
            <div className="flex-grow"></div>
            
            {/* Data Section */}
            <div className="grid grid-cols-2 gap-4 items-end pt-4 border-t border-stone-200">
                {/* Left details column */}
                <div className="space-y-3">
                     <div className="grid grid-cols-2 gap-2 text-left">
                        <div>
                            <p className="text-xs font-bold uppercase">Size</p>
                            <p className="text-sm text-stone-600">{data.size}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase">Net Wt.</p>
                            <p className="text-sm text-stone-600">{data.netWeight}</p>
                        </div>
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
        <p className="text-center text-[10px] font-semibold tracking-wider text-stone-700">{data.disclaimer}</p>
      </footer>
    </div>
  );
};

export default LabelPreview;
