import React from 'react';
import type { LabelTemplate } from '../types';

interface TemplatesPageProps {
  templates: LabelTemplate[];
  onAddNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id:string) => void;
}

const TemplatesPage: React.FC<TemplatesPageProps> = ({ templates, onAddNew, onEdit, onDelete }) => {
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
                <div 
                    className="w-full bg-white border rounded-md mb-4 shadow-inner"
                    style={{ aspectRatio: `${template.widthMm} / ${template.heightMm}`}}
                >
                    {/* Thumbnail preview can be added here */}
                </div>
                <h3 className="font-bold text-md text-stone-800 flex-grow">{template.name}</h3>
                <p className="text-xs text-stone-500">{template.widthMm}mm x {template.heightMm}mm</p>
                <div className="absolute top-3 right-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(template.id)} className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-stone-600 hover:text-stone-900 hover:bg-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => onDelete(template.id)} className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-red-600 hover:text-red-800 hover:bg-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
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
