import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { LabelTemplate, LayoutElement, DataBindingKey } from '../types';
import { initialLabelData } from '../data/presets';
import { BarcodeIcon, QrCodeIcon, BringForwardIcon, SendBackwardIcon, BinIcon, RotateIcon, DuplicateIcon, ZoomInIcon, ZoomOutIcon } from '../components/icons';

// Type alias for cleaner code
type InteractionState = {
  action: 'move' | 'resize-br' | 'resize-bl' | 'resize-tr' | 'resize-tl' | 'rotate';
  elementId: string;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  startWidth?: number;
  startHeight?: number;
  startAngle?: number;
  centerX?: number;
  centerY?: number;
};

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
  const [zoom, setZoom] = useState(1);
  const [interaction, setInteraction] = useState<InteractionState | null>(null);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, elementId: string} | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const updateElement = useCallback((id: string, updates: Partial<LayoutElement>) => {
    setEditedTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el => el.id === id ? { ...el, ...updates } : el),
    }));
  }, []);

  // --- Keyboard & Global Handlers ---
  useEffect(() => {
     if(pageRef.current) pageRef.current.focus();
     
     const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            setSelectedElementId(null);
            setContextMenu(null);
            onCancel();
         }
         if (e.key === 'Delete' && selectedElementId) {
             handleDeleteElement(selectedElementId);
         }
     };
     const handleClickOutside = (e: MouseEvent) => {
        if (contextMenu) setContextMenu(null);
        if (canvasRef.current && !canvasRef.current.contains(e.target as Node)) {
             setSelectedElementId(null);
        }
     }

     window.addEventListener('keydown', handleKeyDown);
     document.addEventListener('mousedown', handleClickOutside);
     return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
     }
  }, [selectedElementId, onCancel, contextMenu]);

  // --- Element CRUD ---
  const addElement = (type: LayoutElement['type']) => {
    const newZIndex = (Math.max(0, ...editedTemplate.elements.map(el => el.zIndex || 0))) + 1;
    const newElement: LayoutElement = {
        id: crypto.randomUUID(),
        type,
        x: 10, y: 10, width: type === 'line' ? 30 : (type === 'qrcode' ? 20 : 25), height: type === 'line' ? 0.5 : (type === 'qrcode' ? 20 : 15),
        rotation: 0,
        zIndex: newZIndex,
        ...(type === 'text' && {
            content: 'New Text', fontSize: 8, fontFamily: 'Montserrat', fontWeight: '400',
            textAlign: 'left', verticalAlign: 'middle', direction: 'ltr', color: '#000000',
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
  
  const handleDuplicateElement = (id: string) => {
      const original = editedTemplate.elements.find(el => el.id === id);
      if (!original) return;
      const newZIndex = (Math.max(0, ...editedTemplate.elements.map(el => el.zIndex || 0))) + 1;
      const newElement: LayoutElement = {
        ...original,
        id: crypto.randomUUID(),
        x: original.x + 5,
        y: original.y + 5,
        zIndex: newZIndex,
      };
      setEditedTemplate(prev => ({...prev, elements: [...prev.elements, newElement]}));
      setSelectedElementId(newElement.id);
  };
  
  const handleReorderElement = (id: string, direction: 'forward' | 'backward' | 'front' | 'back') => {
    const elements = editedTemplate.elements;
    const currentIndex = elements.findIndex(el => el.id === id);
    if (currentIndex === -1) return;

    const sortedByZ = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    const currentZIndex = sortedByZ.findIndex(el => el.id === id);

    let newElements = [...elements];
    const targetElement = newElements.find(el => el.id === id)!;

    if (direction === 'front') {
        const maxZ = Math.max(...elements.map(e => e.zIndex || 0));
        targetElement.zIndex = maxZ + 1;
    } else if (direction === 'back') {
        const minZ = Math.min(...elements.map(e => e.zIndex || 0));
        targetElement.zIndex = minZ - 1;
    } else if (direction === 'forward' && currentZIndex < sortedByZ.length - 1) {
        const nextElement = sortedByZ[currentZIndex + 1];
        [targetElement.zIndex, nextElement.zIndex] = [nextElement.zIndex, targetElement.zIndex];
    } else if (direction === 'backward' && currentZIndex > 0) {
        const prevElement = sortedByZ[currentZIndex - 1];
        [targetElement.zIndex, prevElement.zIndex] = [prevElement.zIndex, targetElement.zIndex];
    }
    
    setEditedTemplate(prev => ({...prev, elements: newElements}));
  };

  // --- Interactive Canvas Logic ---
  const handleInteractionStart = (e: React.MouseEvent, action: InteractionState['action'], elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canvasRef.current) return;
    
    const element = editedTemplate.elements.find(el => el.id === elementId);
    if (!element) return;
    setSelectedElementId(elementId);

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const startX = (e.clientX - canvasRect.left) / canvasRect.width * 100;
    const startY = (e.clientY - canvasRect.top) / canvasRect.height * 100;

    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;

    setInteraction({
      action, elementId,
      offsetX: startX - element.x,
      offsetY: startY - element.y,
      startX, startY,
      startWidth: element.width,
      startHeight: element.height,
      startAngle: element.rotation || 0,
      centerX, centerY
    });
  };

  const handleInteractionMove = useCallback((e: MouseEvent) => {
    if (!interaction || !canvasRef.current) return;
    e.preventDefault();

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left) / canvasRect.width * 100;
    const mouseY = (e.clientY - canvasRect.top) / canvasRect.height * 100;
    const element = editedTemplate.elements.find(el => el.id === interaction.elementId);
    if (!element) return;

    switch (interaction.action) {
        case 'move':
            updateElement(interaction.elementId, { x: mouseX - interaction.offsetX, y: mouseY - interaction.offsetY });
            break;
        case 'resize-br':
            updateElement(interaction.elementId, { width: mouseX - element.x, height: mouseY - element.y });
            break;
        case 'rotate':
            const dx = mouseX - interaction.centerX!;
            const dy = mouseY - interaction.centerY!;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            updateElement(interaction.elementId, { rotation: Math.round(angle) + 90 });
            break;
        // Add other resize handlers similarly if needed
    }
  }, [interaction, editedTemplate.elements, updateElement]);

  const handleInteractionEnd = useCallback(() => {
    setInteraction(null);
  }, []);

  useEffect(() => {
    if (interaction) {
      document.addEventListener('mousemove', handleInteractionMove);
      document.addEventListener('mouseup', handleInteractionEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleInteractionMove);
      document.removeEventListener('mouseup', handleInteractionEnd);
    };
  }, [interaction, handleInteractionMove, handleInteractionEnd]);
  
  const handleContextMenu = (e: React.MouseEvent, elementId: string) => {
      e.preventDefault();
      setSelectedElementId(elementId);
      setContextMenu({ x: e.clientX, y: e.clientY, elementId });
  };
  
  // --- Render ---
  const selectedElement = editedTemplate.elements.find(el => el.id === selectedElementId);
  const sortedElements = editedTemplate.elements.slice().sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  const isArabicElement = selectedElement?.type === 'text' && (selectedElement.fontFamily === 'Noto Kufi Arabic' || selectedElement.dataBinding?.endsWith('_ar'));

  return (
    <div ref={pageRef} tabIndex={-1} className="flex flex-col md:flex-row gap-6 h-[calc(100vh-10rem)] outline-none">
      {/* Left Panel */}
       <div className="w-full md:w-80 flex-shrink-0 bg-white p-6 rounded-lg shadow-lg flex flex-col order-2 md:order-1">
        <div className="flex items-center justify-between pb-4 border-b">
            <h3 className="text-lg font-bold text-stone-700">Add Elements</h3>
            <div className="flex gap-1">
                <div className="tooltip"><button onClick={() => addElement('text')} className="p-2 rounded-md hover:bg-stone-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h.97l.26-1.755a1 1 0 111.94.286L12.47 6h.97l.26-1.755a1 1 0 111.94.286L15.47 6H16a1 1 0 110 2h-1.03l-.26 1.755a1 1 0 11-1.94-.286L12.97 8h-.97l-.26 1.755a1 1 0 11-1.94-.286L9.97 8h-.97l-.26 1.755a1 1 0 01-1.94-.286L6.53 8H4a1 1 0 110 2h1.03l.26-1.755a1 1 0 011.94-.286L7.53 6h.97l.26-1.755a1 1 0 011.213-.727zM9.03 8l.26-1.755A1 1 0 0110.47 6h.97l.26 1.755A1 1 0 0110.53 8h-.97l-.26-1.755a1 1 0 01-.214-.475H9.03z" clipRule="evenodd" /></svg><span className="tooltip-text">Add Text</span></button></div>
                <div className="tooltip"><button onClick={() => addElement('logo')} className="p-2 rounded-md hover:bg-stone-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg><span className="tooltip-text">Add Logo</span></button></div>
                <div className="tooltip"><button onClick={() => addElement('line')} className="p-2 rounded-md hover:bg-stone-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg><span className="tooltip-text">Add Line</span></button></div>
                <div className="tooltip"><button onClick={() => addElement('barcode')} className="p-2 rounded-md hover:bg-stone-100"><BarcodeIcon className="h-5 w-5" /><span className="tooltip-text">Add Barcode</span></button></div>
                <div className="tooltip"><button onClick={() => addElement('qrcode')} className="p-2 rounded-md hover:bg-stone-100"><QrCodeIcon className="h-5 w-5" /><span className="tooltip-text">Add QR Code</span></button></div>
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
                    <label>Rotation (deg)</label>
                    <input type="number" value={Math.round(selectedElement.rotation || 0)} onChange={e => updateElement(selectedElementId!, {rotation: +e.target.value})} className="w-full p-1 border rounded"/>
                 </div>
              </Accordion>

             {(selectedElement.type === 'text' || selectedElement.type === 'barcode' || selectedElement.type === 'qrcode') && (
                 <Accordion title="Content" isOpen={openSections.content} onToggle={() => setOpenSections(s=>({...s, content: !s.content}))}>
                    {selectedElement.type === 'text' && (
                        <div>
                            <label>Content Source</label>
                            <select value={selectedElement.dataBinding || 'static'} onChange={e => {
                                const value = e.target.value;
                                const updates: Partial<LayoutElement> = { dataBinding: value === 'static' ? undefined : value as DataBindingKey };
                                if (value.endsWith('_ar')) {
                                    updates.direction = 'rtl';
                                    updates.fontFamily = 'Noto Kufi Arabic';
                                    if (!selectedElement.fontWeight_ar) updates.fontWeight_ar = '400';
                                } else if (selectedElement.fontFamily === 'Noto Kufi Arabic') {
                                     updates.fontFamily = 'Montserrat';
                                     updates.direction = 'ltr';
                                }
                                updateElement(selectedElementId!, updates);
                            }} className="w-full p-1 border rounded">
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
                             <select value={selectedElement.fontFamily} onChange={e => {
                                const updates: Partial<LayoutElement> = { fontFamily: e.target.value };
                                if (e.target.value === 'Noto Kufi Arabic') {
                                    updates.direction = 'rtl';
                                    if (!selectedElement.fontWeight_ar) updates.fontWeight_ar = '400';
                                } else {
                                    updates.direction = 'ltr';
                                }
                                updateElement(selectedElementId!, updates);
                             }} className="w-full p-1 border rounded">
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
                           {isArabicElement ? (
                                <select value={selectedElement.fontWeight_ar || '400'} onChange={e => updateElement(selectedElementId!, {fontWeight_ar: e.target.value as any})} className="p-1 border rounded">
                                    <option value="400">Regular (AR)</option>
                                    <option value="700">Bold (AR)</option>
                                </select>
                           ) : (
                                <select value={selectedElement.fontWeight} onChange={e => updateElement(selectedElementId!, {fontWeight: e.target.value as any})} className="p-1 border rounded">
                                 <option value="400">Regular</option><option value="700">Bold</option><option value="900">Black</option>
                               </select>
                           )}
                           <input type="color" value={selectedElement.color || '#000000'} onChange={e => updateElement(selectedElementId!, {color: e.target.value})} className="p-1 border rounded w-full"/>
                           <select value={selectedElement.textAlign} onChange={e => updateElement(selectedElementId!, {textAlign: e.target.value as any})} className="p-1 border rounded">
                             <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                           </select>
                           <select value={selectedElement.verticalAlign || 'middle'} onChange={e => updateElement(selectedElementId!, {verticalAlign: e.target.value as any})} className="p-1 border rounded">
                             <option value="top">Top</option><option value="middle">Middle</option><option value="bottom">Bottom</option>
                           </select>
                        </div>
                    </div>
                    {isArabicElement && (
                        <div>
                            <label>Text Direction</label>
                            <select value={selectedElement.direction || 'rtl'} onChange={e => updateElement(selectedElementId!, {direction: e.target.value as any})} className="p-1 border rounded w-full">
                                <option value="ltr">Left-to-Right</option>
                                <option value="rtl">Right-to-Left</option>
                            </select>
                        </div>
                    )}
                    <div>
                         <label className="flex items-center gap-2"><input type="checkbox" checked={!!selectedElement.isUppercase} onChange={e => updateElement(selectedElementId!, {isUppercase: e.target.checked})} /> Uppercase</label>
                    </div>
                </Accordion>
             )}
              <div className="pt-4 mt-4 border-t space-y-2">
                  <button onClick={() => handleDuplicateElement(selectedElement.id)} className="w-full flex items-center justify-center gap-2 p-2 text-stone-600 border border-stone-200 rounded-md hover:bg-stone-50 hover:border-stone-500">
                      <DuplicateIcon className="h-4 w-4" />
                      Duplicate Element
                  </button>
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

      {/* Canvas */}
      <div className="flex-grow bg-white p-6 rounded-lg shadow-lg flex flex-col order-1 md:order-2">
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
        <div className="flex-grow bg-stone-100 rounded-md p-4 flex items-center justify-center relative overflow-hidden">
          <div
            className="relative"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s' }}
          >
              <div
                ref={canvasRef}
                className="bg-white shadow-md relative overflow-hidden"
                style={{ width: `${editedTemplate.widthMm * 5}px`, height: `${editedTemplate.heightMm * 5}px`}}
                onClick={(e) => { if(e.target === canvasRef.current) setSelectedElementId(null) }}
              >
                {sortedElements.map(el => (
                  <div
                    key={el.id}
                    className={`template-element absolute ${selectedElementId === el.id ? '' : 'hover:outline'}`}
                    style={{
                      left: `${el.x}%`, top: `${el.y}%`,
                      width: `${el.width}%`, height: `${el.height}%`,
                      transform: `rotate(${el.rotation || 0}deg)`,
                      zIndex: el.zIndex,
                    }}
                    onMouseDown={(e) => handleInteractionStart(e, 'move', el.id)}
                    onContextMenu={(e) => handleContextMenu(e, el.id)}
                  >
                     <div className={`w-full h-full ${el.fontFamily === 'Noto Kufi Arabic' ? 'font-arabic' : ''}`}
                        style={{
                            color: el.color, fontFamily: el.fontFamily, fontSize: `${el.fontSize}px`, 
                            fontWeight: (el.type === 'text' && (el.fontFamily === 'Noto Kufi Arabic' || el.dataBinding?.endsWith('_ar')) ? el.fontWeight_ar : el.fontWeight),
                            textAlign: el.textAlign, textTransform: el.isUppercase ? 'uppercase' : 'none', letterSpacing: el.tracking,
                            direction: el.direction,
                        }}
                     >
                        { el.type === 'logo' && <div className="w-full h-full border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400">LOGO</div> }
                        { el.type === 'line' && <div className="w-full h-full flex items-center"><div style={{width: '100%', height: `${el.strokeWidth}px`, backgroundColor: el.strokeColor}} /></div>}
                        { el.type === 'barcode' && <div className="w-full h-full flex items-center justify-center p-1 text-black bg-white"><div className="w-full h-full border border-dashed text-xs flex items-center justify-center">BARCODE</div></div> }
                        { el.type === 'qrcode' && <div className="w-full h-full flex items-center justify-center p-1 text-black bg-white"><div className="w-full h-full border border-dashed text-xs flex items-center justify-center">QR</div></div>}
                        { el.type === 'text' && <div className="w-full h-full overflow-hidden break-words whitespace-pre-wrap flex items-center justify-center">{el.dataBinding ? `{${el.dataBinding}}` : el.content}</div> }
                    </div>
                  </div>
                ))}
                
                {selectedElement && (
                    <div className="selection-box" style={{ left: `${selectedElement.x}%`, top: `${selectedElement.y}%`, width: `${selectedElement.width}%`, height: `${selectedElement.height}%`, transform: `rotate(${selectedElement.rotation || 0}deg)` }}>
                        <div className="rotator" onMouseDown={(e) => handleInteractionStart(e, 'rotate', selectedElement.id)}><div className="rotation-line"/></div>
                        <div className="resizer tl" onMouseDown={(e) => handleInteractionStart(e, 'resize-tl', selectedElement.id)}></div>
                        <div className="resizer tr" onMouseDown={(e) => handleInteractionStart(e, 'resize-tr', selectedElement.id)}></div>
                        <div className="resizer bl" onMouseDown={(e) => handleInteractionStart(e, 'resize-bl', selectedElement.id)}></div>
                        <div className="resizer br" onMouseDown={(e) => handleInteractionStart(e, 'resize-br', selectedElement.id)}></div>
                    </div>
                )}
              </div>
          </div>
          <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md flex items-center p-1">
              <div className="tooltip"><button onClick={() => setZoom(z => z > 0.2 ? z - 0.1 : z)} className="p-2 rounded-md hover:bg-stone-100"><ZoomOutIcon className="h-5 w-5" /><span className="tooltip-text">Zoom Out</span></button></div>
              <span className="text-sm font-medium text-stone-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <div className="tooltip"><button onClick={() => setZoom(z => z < 3 ? z + 0.1 : z)} className="p-2 rounded-md hover:bg-stone-100"><ZoomInIcon className="h-5 w-5" /><span className="tooltip-text">Zoom In</span></button></div>
          </div>
        </div>
      </div>
      
       {contextMenu && (
            <div
                style={{ top: contextMenu.y, left: contextMenu.x }}
                className="absolute z-50 bg-white rounded-md shadow-lg py-1 w-48 text-sm"
                onContextMenu={(e) => e.preventDefault()}
            >
                <button onClick={() => { handleReorderElement(contextMenu.elementId, 'front'); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-stone-100 flex items-center gap-2"><BringForwardIcon className="h-4 w-4" /> Bring to Front</button>
                <button onClick={() => { handleReorderElement(contextMenu.elementId, 'forward'); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-stone-100 flex items-center gap-2"><BringForwardIcon className="h-4 w-4 opacity-50" /> Bring Forward</button>
                <button onClick={() => { handleReorderElement(contextMenu.elementId, 'backward'); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-stone-100 flex items-center gap-2"><SendBackwardIcon className="h-4 w-4 opacity-50" /> Send Backward</button>
                <button onClick={() => { handleReorderElement(contextMenu.elementId, 'back'); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-stone-100 flex items-center gap-2"><SendBackwardIcon className="h-4 w-4" /> Send to Back</button>
                <div className="my-1 h-px bg-stone-200" />
                <button onClick={() => { handleDuplicateElement(contextMenu.elementId); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-stone-100 flex items-center gap-2"><DuplicateIcon className="h-4 w-4" /> Duplicate</button>
                <div className="my-1 h-px bg-stone-200" />
                <button onClick={() => { handleDeleteElement(contextMenu.elementId); setContextMenu(null); }} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"><BinIcon className="h-4 w-4" /> Delete</button>
            </div>
        )}
    </div>
  );
};

export default TemplateDesignerPage;