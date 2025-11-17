import React, { useState, useEffect, useRef } from 'react';
import type { LabelTemplate, LayoutElement, DataBindingKey } from '../types';
import { initialLabelData } from '../data/presets';
import { BarcodeIcon, QrCodeIcon, BringForwardIcon, SendBackwardIcon, BinIcon } from '../components/icons';

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
    { key: 'sku', label: 'SKU' },
];

const Accordion: React.FC<{ title: string; children: React.ReactNode, isOpen: boolean, onToggle: () => void }> = ({ title, children, isOpen, onToggle }) => (
    <div className="border-b">
        <button onClick={onToggle} className="w-full flex justify-between items-center py-2 text-left font-semibold">
            {title}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
        <div className={`grid accordion-content ${isOpen ? 'open' : ''}`}>
           <div className="pt-2 pb-4 space-y-4">{children}</div>
        </div>
    </div>
);


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
  const [openSections, setOpenSections] = useState({ pos: true, content: true, style: true });
  const canvasRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if(pageRef.current) pageRef.current.focus();
     
     const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') onCancel();
         if (e.key === 'Delete' && selectedElementId) {
             handleDeleteElement(selectedElementId);
         }
     };
     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, onCancel]);

  const updateElement = (id: string, updates: Partial<LayoutElement>) => {
    setEditedTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el => el.id === id ? { ...el, ...updates } : el),
    }));
  };

  const addElement = (type: LayoutElement['type']) => {
    const newZIndex = (Math.max(0, ...editedTemplate.elements.map(el => el.zIndex || 0))) + 1;
    const newElement: LayoutElement = {
        id: crypto.randomUUID(),
        type,
        x: 10, y: 10, width: type === 'line' ? 30 : (type === 'qrcode' ? 20 : 25), height: type === 'line' ? 0.5 : (type === 'qrcode' ? 20 : 15),
        zIndex: newZIndex,
        ...(type === 'text' && {
            content: 'New Text',
            fontSize: 8,
            fontFamily: 'Montserrat',
            fontWeight: '400',
            textAlign: 'left',
            verticalAlign: 'middle',
            color: '#000000',
        }),
         ...(type === 'line' && { strokeWidth: 1, strokeColor: '#000000' }),
         ...((type === 'barcode' || type === 'qrcode') && { codeDataBinding: 'sku' }),
    };
    setEditedTemplate(prev => ({...prev, elements: [...prev.elements, newElement]}));
    setSelectedElementId(newElement.id);
  }
  
  const handleDeleteElement = (id: string) => {
      setEditedTemplate(prev => ({...prev, elements: prev.elements.filter(el => el.id !== id)}));
      setSelectedElementId(null);
  };
  
  const handleReorderElement = (id: string, direction: 'forward' | 'backward') => {
      const currentZ = editedTemplate.elements.find(el => el.id === id)?.zIndex || 0;
      const otherZIndexes = editedTemplate.elements
        .filter(el => el.id !== id)
        .map(el => el.zIndex || 0)
        .sort((a,b) => a-b);
      
      let newZ;
      if (direction === 'forward') {
          const nextHighestZ = otherZIndexes.find(z => z > currentZ);
          newZ = nextHighestZ !== undefined ? nextHighestZ + 1 : currentZ + 1;
      } else { // backward
          const nextLowestZ = [...otherZIndexes].reverse().find(z => z < currentZ);
          newZ = nextLowestZ !== undefined ? nextLowestZ - 1 : currentZ - 1;
      }
      updateElement(id, { zIndex: newZ });
  };

  const selectedElement = editedTemplate.elements.find(el => el.id === selectedElementId);
  const sortedElements = editedTemplate.elements.slice().sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  const getAlignmentClasses = (el: LayoutElement) => {
      if (el.type !== 'text') return 'flex items-center justify-center';
      const vAlign = { top: 'items-start', middle: 'items-center', bottom: 'items-end' };
      return `flex ${vAlign[el.verticalAlign || 'middle']}`;
  };
  
  return (
    <div ref={pageRef} tabIndex={-1} className="flex gap-6 h-[calc(100vh-10rem)] outline-none">
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
            {sortedElements.map(el => (
              <div
                key={el.id}
                className={`template-element absolute cursor-move ${selectedElementId === el.id ? 'selected' : ''} ${el.fontFamily === 'Noto Kufi Arabic' ? 'font-arabic' : ''} ${getAlignmentClasses(el)}`}
                style={{
                  left: `${el.x}%`, top: `${el.y}%`,
                  width: `${el.width}%`, height: `${el.height}%`,
                  color: el.color, fontFamily: el.fontFamily, fontSize: `${el.fontSize}px`, fontWeight: el.fontWeight,
                  textAlign: el.textAlign, textTransform: el.isUppercase ? 'uppercase' : 'none', letterSpacing: el.tracking,
                  direction: el.dataBinding?.endsWith('_ar') ? 'rtl' : 'ltr',
                  zIndex: el.zIndex,
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}
              >
                 { el.type === 'logo' && <div className="w-full h-full border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400">LOGO</div> }
                 { el.type === 'line' && <div className="w-full h-full flex items-center"><div style={{width: '100%', height: `${el.strokeWidth}px`, backgroundColor: el.strokeColor}} /></div>}
                 { el.type === 'barcode' && <div className="w-full h-full flex flex-col items-center justify-center p-1 text-black"><BarcodeIcon className="w-full h-auto flex-grow" /><span className="text-[5px] tracking-widest">{`{${el.codeDataBinding}}`}</span></div> }
                 { el.type === 'qrcode' && <div className="w-full h-full flex items-center justify-center p-1 text-black"><QrCodeIcon className="w-auto h-full" /></div> }
                 { el.type === 'text' && <div className="w-full h-full overflow-hidden break-words whitespace-pre-wrap">{el.dataBinding ? `{${el.dataBinding}}` : el.content}</div> }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 flex-shrink-0 bg-white p-6 rounded-lg shadow-lg flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b">
            <h3 className="text-lg font-bold text-stone-700">Add Elements</h3>
            <div className="flex gap-1">
                <button onClick={() => addElement('text')} className="p-2 rounded-md hover:bg-stone-100" title="Add Text"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h.97l.26-1.755a1 1 0 111.94.286L12.47 6h.97l.26-1.755a1 1 0 111.94.286L15.47 6H16a1 1 0 110 2h-1.03l-.26 1.755a1 1 0 11-1.94-.286L12.97 8h-.97l-.26 1.755a1 1 0 11-1.94-.286L9.97 8h-.97l-.26 1.755a1 1 0 01-1.94-.286L6.53 8H4a1 1 0 110 2h1.03l.26-1.755a1 1 0 011.94-.286L7.53 6h.97l.26-1.755a1 1 0 011.213-.727zM9.03 8l.26-1.755A1 1 0 0110.47 6h.97l.26 1.755A1 1 0 0110.53 8h-.97l-.26-1.755a1 1 0 01-.214-.475H9.03z" clipRule="evenodd" /></svg></button>
                <button onClick={() => addElement('logo')} className="p-2 rounded-md hover:bg-stone-100" title="Add Logo"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg></button>
                <button onClick={() => addElement('line')} className="p-2 rounded-md hover:bg-stone-100" title="Add Line"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
                <button onClick={() => addElement('barcode')} className="p-2 rounded-md hover:bg-stone-100" title="Add Barcode"><BarcodeIcon className="h-5 w-5" /></button>
                <button onClick={() => addElement('qrcode')} className="p-2 rounded-md hover:bg-stone-100" title="Add QR Code"><QrCodeIcon className="h-5 w-5" /></button>
            </div>
        </div>
        <div className="flex-grow overflow-y-auto pt-2 pr-2 -mr-2 text-sm">
          {selectedElement ? (
            <>
              <Accordion title="Position & Size" isOpen={openSections.pos} onToggle={() => setOpenSections(s=>({...s, pos: !s.pos}))}>
                <div className="grid grid-cols-2 gap-2">
                   <div><label>Width (%)</label><input type="number" value={Math.round(selectedElement.width)} onChange={e => updateElement(selectedElementId!, {width: +e.target.value})} className="w-full p-1 border rounded"/></div>
                   <div><label>Height (%)</label><input type="number" value={Math.round(selectedElement.height)} onChange={e => updateElement(selectedElementId!, {height: +e.target.value})} className="w-full p-1 border rounded"/></div>
                   <div><label>X (%)</label><input type="number" value={Math.round(selectedElement.x)} onChange={e => updateElement(selectedElementId!, {x: +e.target.value})} className="w-full p-1 border rounded"/></div>
                   <div><label>Y (%)</label><input type="number" value={Math.round(selectedElement.y)} onChange={e => updateElement(selectedElementId!, {y: +e.target.value})} className="w-full p-1 border rounded"/></div>
                </div>
                 <div>
                    <label>Layer Order</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleReorderElement(selectedElement.id, 'backward')} className="p-2 flex items-center justify-center gap-2 border rounded hover:bg-stone-100"><SendBackwardIcon className="h-4 w-4" /> Send Back</button>
                        <button onClick={() => handleReorderElement(selectedElement.id, 'forward')} className="p-2 flex items-center justify-center gap-2 border rounded hover:bg-stone-100"><BringForwardIcon className="h-4 w-4" /> Bring Front</button>
                    </div>
                 </div>
              </Accordion>

             {(selectedElement.type === 'text' || selectedElement.type === 'barcode' || selectedElement.type === 'qrcode') && (
                 <Accordion title="Content" isOpen={openSections.content} onToggle={() => setOpenSections(s=>({...s, content: !s.content}))}>
                    {selectedElement.type === 'text' && (
                        <div>
                            <label>Content Source</label>
                            <select value={selectedElement.dataBinding || 'static'} onChange={e => updateElement(selectedElementId!, { dataBinding: e.target.value === 'static' ? undefined : e.target.value as DataBindingKey })} className="w-full p-1 border rounded">
                                <option value="static">Static Text</option>
                                {dataBindings.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
                            </select>
                            {!selectedElement.dataBinding && (
                                 <textarea value={selectedElement.content} onChange={e => updateElement(selectedElementId!, {content: e.target.value})} className="w-full p-1 border rounded mt-1 text-xs" rows={2}/>
                            )}
                        </div>
                    )}
                    {(selectedElement.type === 'barcode' || selectedElement.type === 'qrcode') && (
                         <div>
                            <label>Data Source</label>
                            <select value={selectedElement.codeDataBinding} onChange={e => updateElement(selectedElementId!, { codeDataBinding: e.target.value as 'sku' })} className="w-full p-1 border rounded">
                                <option value="sku">Product SKU</option>
                            </select>
                        </div>
                    )}
                </Accordion>
             )}

             {selectedElement.type === 'text' && (
                <Accordion title="Style" isOpen={openSections.style} onToggle={() => setOpenSections(s=>({...s, style: !s.style}))}>
                     <div>
                        <label>Font</label>
                        <div className="grid grid-cols-2 gap-2">
                             <select value={selectedElement.fontFamily} onChange={e => updateElement(selectedElementId!, {fontFamily: e.target.value})} className="w-full p-1 border rounded">
                                <option value="Montserrat">Montserrat</option>
                                <option value="Dancing Script">Dancing Script</option>
                                <option value="Noto Kufi Arabic">Noto Kufi Arabic</option>
                             </select>
                             <input type="number" placeholder="Size" value={selectedElement.fontSize} onChange={e => updateElement(selectedElementId!, {fontSize: +e.target.value})} className="w-full p-1 border rounded"/>
                        </div>
                    </div>
                     <div>
                        <label>Appearance & Alignment</label>
                        <div className="grid grid-cols-2 gap-2">
                           <select value={selectedElement.fontWeight} onChange={e => updateElement(selectedElementId!, {fontWeight: e.target.value as any})} className="p-1 border rounded">
                             <option value="400">Regular</option><option value="700">Bold</option><option value="900">Black</option>
                           </select>
                           <input type="color" value={selectedElement.color || '#000000'} onChange={e => updateElement(selectedElementId!, {color: e.target.value})} className="p-1 border rounded w-full"/>
                           <select value={selectedElement.textAlign} onChange={e => updateElement(selectedElementId!, {textAlign: e.target.value as any})} className="p-1 border rounded">
                             <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                           </select>
                           <select value={selectedElement.verticalAlign || 'middle'} onChange={e => updateElement(selectedElementId!, {verticalAlign: e.target.value as any})} className="p-1 border rounded">
                             <option value="top">Top</option><option value="middle">Middle</option><option value="bottom">Bottom</option>
                           </select>
                        </div>
                    </div>
                    <div>
                         <label className="flex items-center gap-2"><input type="checkbox" checked={!!selectedElement.isUppercase} onChange={e => updateElement(selectedElementId!, {isUppercase: e.target.checked})} /> Uppercase</label>
                    </div>
                </Accordion>
             )}
              <div className="pt-4 mt-4 border-t">
                  <button onClick={() => handleDeleteElement(selectedElement.id)} className="w-full flex items-center justify-center gap-2 p-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 hover:border-red-500">
                      <BinIcon className="h-4 w-4" />
                      Delete Element
                  </button>
              </div>
            </>
          ) : (
            <div className="text-stone-500 text-center pt-10">Select an element to edit its properties.</div>
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