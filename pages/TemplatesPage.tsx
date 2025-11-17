import React from 'react';
import type { LabelTemplate } from '../types';
import LabelPreview from '../components/LabelPreview'; 
import { initialLabelData } from '../data/presets';
import { DuplicateIcon } from '../components/icons';

interface TemplatesPageProps {
  templates: LabelTemplate[];
  onAddNew: () => void;
  onEdit: (id: string) => void;
  onClone: (id: string) => void;
  onDelete: (id:string) => void;
}

const TemplatesPage: React.FC<TemplatesPageProps> = ({ templates, onAddNew, onEdit, onClone, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-200">
        <h2 className="text-2xl font-bold text-stone-700">Manage Templates</h2>
        <button
          onClick={onAddNew}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-stone-700 text-white rounded-md hover:bg-stone-800 text-sm font-medium transition-transform active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Create New Template</span>
        </button>
      </div>

      {templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.map(template => (
            <div key={template.id} className="group relative bg-stone-50 rounded-lg p-4 flex flex-col border border-stone-200 hover:shadow-lg hover:border-stone-300 transition-all">
                {template.isDefault && (
                    <div className="absolute top-2 left-2 bg-stone-200 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                        STANDARD
                    </div>
                )}
                <div 
                    className="w-full bg-white border rounded-md mb-4 shadow-inner overflow-hidden"
                    style={{ aspectRatio: `${template.widthMm} / ${template.heightMm}`}}
                >
                    <div className="transform scale-[0.1] origin-top-left" style={{width: '1000%', height: '1000%'}}>
                       <LabelPreview data={initialLabelData} template={template} labelCount={1} printDensity="normal" />
                    </div>
                </div>
                <h3 className="font-bold text-md text-stone-800 flex-grow">{template.name}</h3>
                <p className="text-xs text-stone-500">{template.widthMm}mm x {template.heightMm}mm</p>
                <div className="mt-4 pt-3 border-t border-stone-200 flex justify-end gap-2">
                    {template.isDefault ? (
                        <button onClick={() => onClone(template.id)} className="w-full text-sm font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-stone-50">
                            <DuplicateIcon className="h-4 w-4" />
                            Clone & Edit
                        </button>
                    ) : (
                        <>
                           <button onClick={() => onDelete(template.id)} className="text-sm font-medium text-red-600 hover:text-red-800 p-2">Delete</button>
                           <button onClick={() => onEdit(template.id)} className="flex-grow text-sm font-medium text-white bg-stone-700 hover:bg-stone-800 rounded-md py-2">Edit</button>
                        </>
                    )}
                </div>
            </div>
          ))}
        </div>
      ) : (
         <div className="text-center py-12 text-stone-500 border-2 border-dashed border-stone-300 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-stone-800">No templates found</h3>
            <p className="mt-1 text-sm">Click "Create New Template" to design your first label layout.</p>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;