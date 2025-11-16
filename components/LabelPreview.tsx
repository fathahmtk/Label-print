import React from 'react';
import type { LabelData } from '../types';

interface LabelPreviewProps {
  data: LabelData;
}

const LabelPreview: React.FC<LabelPreviewProps> = ({ data }) => {
  return (
    <div id="label-preview" className="w-full max-w-md aspect-[1/1] bg-white text-black p-8 shadow-lg border border-stone-200 flex flex-col font-['Montserrat']">
      <div className="text-center">
        {data.logo ? (
          <img src={data.logo} alt="Brand Logo" className="max-h-20 w-auto mx-auto mb-2 object-contain" />
        ) : (
          <p className="font-dancing-script text-3xl">{data.brandName}</p>
        )}
        <p className="text-2xl font-extrabold tracking-wider mt-4">{data.productName.split(' ')[0]}</p>
        <h1 className="text-7xl font-black tracking-tighter leading-none -mt-2">{data.productName.substring(data.productName.indexOf(' ') + 1)}</h1>
        <p className="text-sm tracking-[0.2em] font-semibold mt-2">{data.tagline}</p>
      </div>

      <div className="my-6 text-center">
        <p className="tracking-widest text-sm font-bold">INGREDIENTS</p>
        <hr className="border-t border-black w-12 mx-auto mt-1" />
        <p className="text-xs leading-relaxed mt-2">{data.ingredients}</p>
        <p className="text-xs font-bold mt-4">{data.allergens}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center text-xs mt-auto pt-4 border-t border-stone-300">
        <div>
          <p className="font-bold">MFG. & DIST. BY</p>
          <p className="whitespace-pre-wrap">{data.mfgAndDist}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold">{data.quantity}</p>
            <p className="text-xs tracking-wider">COOKIES</p>
          </div>
        </div>
        <div>
          <p className="font-bold">NET WT.</p>
          <p>{data.netWeight}</p>
        </div>
      </div>
       <div className="grid grid-cols-2 gap-4 text-center text-xs mt-2">
        <div>
            <p className="font-bold">PRODUCTION DATE</p>
            <p>{data.productionDate}</p>
        </div>
        <div>
            <p className="font-bold">EXPIRY DATE</p>
            <p>{data.expiryDate}</p>
        </div>
       </div>


      <div className="bg-stone-200 p-2 mt-6 -mx-8 -mb-8">
        <p className="text-center text-[8px] font-semibold tracking-wider">{data.disclaimer}</p>
      </div>
    </div>
  );
};

export default LabelPreview;
