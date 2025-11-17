import React, { useState, useEffect, useRef } from 'react';
import type { LabelTemplate, LayoutElement, DataBindingKey } from '../types';
import { initialLabelData } from '../data/presets';

interface TemplateDesignerPageProps {
  template: LabelTemplate | null;
  onSave: (template: LabelTemplate) => void;
  onCancel: () => void;
}

const dataBindings: { key: DataBindingKey; label: string }[] = [
    { key: 'brandName', label: 'Brand Name' },
    { key: 'productName', label: 'Product Name (EN)' },
    { key: 'productName_ar', label: 'Product Name (AR)' },
    { key: 'tagline', label: 'Tagline (EN)' },
    { key: 'tagline_ar', label: 'Tagline (AR)' },
    { key: 'size', label: 'Size' },
    { key: 'ingredients', label: 'Ingredients (EN)' },
    { key: 'ingredients_ar', label: 'Ingredients (AR)' },
    { key: 'allergens', label: 'Allergens (EN)' },
    { key: 'allergens_ar', label: 'Allergens (AR)' },
    { key: 'mfgAndDist', label: 'Mfg & Dist (EN)' },
    { key: 'mfgAndDist_ar', label: 'Mfg & Dist (AR)' },
    { key: 'quantityValue', label: 'Quantity Value' },
    { key: 'quantityUnit', label: 'Quantity Unit' },
    { key: 'netWeight', label: 'Net Weight' },
    { key: 'disclaimer', label: 'Disclaimer (EN)' },
    { key: 'disclaimer_ar', label: 'Disclaimer (AR)' },
    { key: 'productionDate', label: 'Production Date' },
    { key: 'expiryDate', label: 'Expiry Date' },
];

const TemplateDesignerPage: React.FC<TemplateDesignerPageProps> = ({ template, onSave, onCancel }) => {
  const [editedTemplate, setEditedTemplate] = useState<LabelTemplate>(() => 
    template || {
      id: crypto.randomUUID(),
      name: 'New Template',
      widthMm: 100,
      heightMm: 50,
      elements: [],
    }
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const updateElement = (id: string, updates: Partial<LayoutElement>) => {
    setEditedTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el => el.id === id ? { ...el, ...updates } : el),
    }));
  };
  
  const handleDrag = (e: React.MouseEvent, element: LayoutElement) => {
    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    
    const onMouseMove = (moveE: MouseEvent) => {
        const dx = (moveE.clientX - startX) / canvasRect.width * 100;
        const dy = (moveE.clientY - startY) / canvasRect.height * 100;
        updateElement(element.id, { x: element.x + dx, y: element.y + dy });
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  const addElement = (type: 'text' | 'logo' | 'line') => {
    const newElement: LayoutElement = {
        id: crypto.randomUUID(),
        type,
        x: 10, y: 10, width: type === 'line' ? 30 : 25, height: type === 'line' ? 0.5 : 15,
        ...(type === 'text' && {
            content: 'New Text',
            fontSize: 8,
            fontFamily: 'Montserrat',
            fontWeight: '400',
            textAlign: 'left',
            color: '#000000',
        }),
         ...(type === 'line' && { strokeWidth: 1, strokeColor: '#000000' }),
    };
    setEditedTemplate(prev => ({...prev, elements: [...prev.elements, newElement]}));
    setSelectedElementId(newElement.id);
  }

  const selectedElement = editedTemplate.elements.find(el => el.id === selectedElementId);
  
  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      {/* Canvas */}
      <div className="flex-grow bg-white p-6 rounded-lg shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-4">
             <input 
                type="text"
                value={editedTemplate.name}
                onChange={(e) => setEditedTemplate(prev => ({ ...prev, name: e.target.value }))}
                className="text-2xl font-bold text-stone-700 p-1 -m-1 rounded-md focus:ring-2 focus:ring-indigo-500"
             />
             <div className="flex items-center gap-2 text-sm">
                 <input type="number" value={editedTemplate.widthMm} onChange={e => setEditedTemplate(p => ({...p, widthMm: +e.target.value}))} className="w-16 p-1 border rounded" />
                 <span>mm &times;</span>
                 <input type="number" value={editedTemplate.heightMm} onChange={e => setEditedTemplate(p => ({...p, heightMm: +e.target.value}))} className="w-16 p-1 border rounded" />
                 <span>mm</span>
             </div>
        </div>
        <div className="flex-grow bg-stone-100 rounded-md p-4 flex items-center justify-center">
          <div
            ref={canvasRef}
            className="bg-white shadow-md relative overflow-hidden"
            style={{ width: '100%', aspectRatio: `${editedTemplate.widthMm} / ${editedTemplate.heightMm}` }}
            onClick={(e) => { if(e.target === canvasRef.current) setSelectedElementId(null) }}
          >
            {editedTemplate.elements.map(el => (
              <div
                key={el.id}
                className={`template-element absolute cursor-move ${selectedElementId === el.id ? 'selected' : ''} ${el.fontFamily === 'Noto Kufi Arabic' ? 'font-arabic' : ''}`}
                style={{
                  left: `${el.x}%`, top: `${el.y}%`,
                  width: `${el.width}%`, height: `${el.height}%`,
                  color: el.color, fontFamily: el.fontFamily, fontSize: `${el.fontSize}px`, fontWeight: el.fontWeight,
                  textAlign: el.textAlign, textTransform: el.isUppercase ? 'uppercase' : 'none', letterSpacing: el.tracking,
                  direction: el.dataBinding?.endsWith('_ar') ? 'rtl' : 'ltr',
                }}
                onMouseDown={(e) => { e.stopPropagation(); setSelectedElementId(el.id); handleDrag(e, el); }}
              >
                 { el.type === 'logo' && <div className="w-full h-full border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400">LOGO</div> }
                 { el.type === 'line' && <div className="w-full h-full flex items-center"><div style={{width: '100%', height: `${el.strokeWidth}px`, backgroundColor: el.strokeColor}} /></div>}
                 { el.type === 'text' && <div className="w-full h-full overflow-hidden break-words whitespace-pre-wrap">{el.dataBinding ? `{${el.dataBinding}}` : el.content}</div> }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 flex-shrink-0 bg-white p-6 rounded-lg shadow-lg flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b">
            <h3 className="text-lg font-bold text-stone-700">Properties</h3>
            <div className="flex gap-1">
                <button onClick={() => addElement('text')} className="p-2 rounded-md hover:bg-stone-100" title="Add Text"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h.97l.26-1.755a1 1 0 111.94.286L12.47 6h.97l.26-1.755a1 1 0 111.94.286L15.47 6H16a1 1 0 110 2h-1.03l-.26 1.755a1 1 0 11-1.94-.286L12.97 8h-.97l-.26 1.755a1 1 0 11-1.94-.286L9.97 8h-.97l-.26 1.755a1 1 0 01-1.94-.286L6.53 8H4a1 1 0 110-2h1.03l.26-1.755a1 1 0 011.94-.286L7.53 6h.97l.26-1.755a1 1 0 011.213-.727zM9.03 8l.26-1.755A1 1 0 0110.47 6h.97l.26 1.755A1 1 0 0110.53 8h-.97l-.26-1.755a1 1 0 01-.214-.475H9.03z" clipRule="evenodd" /></svg></button>
                <button onClick={() => addElement('logo')} className="p-2 rounded-md hover:bg-stone-100" title="Add Logo"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg></button>
                 <button onClick={() => addElement('line')} className="p-2 rounded-md hover:bg-stone-100" title="Add Line"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
            </div>
        </div>
        <div className="flex-grow overflow-y-auto pt-4 pr-2 -mr-2 text-sm space-y-4">
          {selectedElement ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                 <div><label>W</label><input type="number" value={Math.round(selectedElement.width)} onChange={e => updateElement(selectedElementId!, {width: +e.target.value})} className="w-full p-1 border rounded"/></div>
                 <div><label>H</label><input type="number" value={Math.round(selectedElement.height)} onChange={e => updateElement(selectedElementId!, {height: +e.target.value})} className="w-full p-1 border rounded"/></div>
                 <div><label>X</label><input type="number" value={Math.round(selectedElement.x)} onChange={e => updateElement(selectedElementId!, {x: +e.target.value})} className="w-full p-1 border rounded"/></div>
                 <div><label>Y</label><input type="number" value={Math.round(selectedElement.y)} onChange={e => updateElement(selectedElementId!, {y: +e.target.value})} className="w-full p-1 border rounded"/></div>
              </div>

             {selectedElement.type === 'text' && (
                <>
                    <div>
                        <label>Content</label>
                        <select value={selectedElement.dataBinding || 'static'} onChange={e => updateElement(selectedElementId!, { dataBinding: e.target.value === 'static' ? undefined : e.target.value as DataBindingKey })} className="w-full p-1 border rounded">
                            <option value="static">Static Text</option>
                            {dataBindings.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
                        </select>
                        {!selectedElement.dataBinding && (
                             <input type="text" value={selectedElement.content} onChange={e => updateElement(selectedElementId!, {content: e.target.value})} className="w-full p-1 border rounded mt-1"/>
                        )}
                    </div>
                     <div>
                        <label>Font</label>
                        <div className="grid grid-cols-2 gap-2">
                             <select value={selectedElement.fontFamily} onChange={e => updateElement(selectedElementId!, {fontFamily: e.target.value})} className="w-full p-1 border rounded">
                                <option value="Montserrat">Montserrat</option>
                                <option value="Dancing Script">Dancing Script</option>
                                <option value="Noto Kufi Arabic">Noto Kufi Arabic</option>
                             </select>
                             <input type="number" value={selectedElement.fontSize} onChange={e => updateElement(selectedElementId!, {fontSize: +e.target.value})} className="w-full p-1 border rounded"/>
                        </div>
                    </div>
                     <div>
                        <label>Style</label>
                        <div className="grid grid-cols-3 gap-2">
                           <select value={selectedElement.fontWeight} onChange={e => updateElement(selectedElementId!, {fontWeight: e.target.value as any})} className="p-1 border rounded">
                             <option value="400">Regular</option><option value="700">Bold</option><option value="900">Black</option>
                           </select>
                           <input type="color" value={selectedElement.color} onChange={e => updateElement(selectedElementId!, {color: e.target.value})} className="p-1 border rounded w-full"/>
                           <select value={selectedElement.textAlign} onChange={e => updateElement(selectedElementId!, {textAlign: e.target.value as any})} className="p-1 border rounded">
                             <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                           </select>
                        </div>
                    </div>
                    <div>
                         <label className="flex items-center gap-2"><input type="checkbox" checked={!!selectedElement.isUppercase} onChange={e => updateElement(selectedElementId!, {isUppercase: e.target.checked})} /> Uppercase</label>
                    </div>
                </>
             )}
            </>
          ) : (
            <div className="text-stone-500 text-center pt-10">Select an element to edit its properties, or add a new one.</div>
          )}
        </div>
        <div className="pt-4 border-t mt-auto flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 bg-white border border-stone-300 rounded-md font-medium text-stone-700 hover:bg-stone-50">Cancel</button>
          <button onClick={() => onSave(editedTemplate)} className="px-4 py-2 bg-stone-700 text-white rounded-md hover:bg-stone-800 font-medium">Save Template</button>
        </div>
      </div>
    </div>
  );
};

export default TemplateDesignerPage;
