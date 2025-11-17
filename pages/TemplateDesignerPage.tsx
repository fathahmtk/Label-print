import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { LabelTemplate, LayoutElement, DataBindingKey, PresetProduct } from '../types';
import { initialLabelData, calculateExpiryDate } from '../data/presets';
import { BarcodeIcon, QrCodeIcon, BringForwardIcon, SendBackwardIcon, BinIcon, RotateIcon, DuplicateIcon, ZoomInIcon, ZoomOutIcon, UndoIcon, RedoIcon, GridIcon } from '../components/icons';
import LabelPreview from '../components/LabelPreview';

// --- Custom History Hook for Undo/Redo ---
const useHistory = <T,>(initialState: T): [T, (newState: T, fromHistory?: boolean) => void, () => void, () => void, boolean, boolean] => {
    const [history, setHistory] = useState<T[]>([initialState]);
    const [index, setIndex] = useState(0);

    const setState = (newState: T, fromHistory = false) => {
        if (fromHistory) {
            setHistory(prev => {
                const newHistory = [...prev];
                newHistory[index] = newState;
                return newHistory;
            });
            return;
        }
        
        const newHistory = history.slice(0, index + 1);
        newHistory.push(newState);
        setHistory(newHistory);
        setIndex(newHistory.length - 1);
    };

    const undo = () => index > 0 && setIndex(index - 1);
    const redo = () => index < history.length - 1 && setIndex(index + 1);

    return [history[index], setState, undo, redo, index > 0, index < history.length - 1];
};


type InteractionState = {
  action: 'move' | 'resize-br' | 'resize-bl' | 'resize-tr' | 'resize-tl' | 'rotate';
  elementId: string;
  initialState: LabelTemplate; // For undo history
};

type SnapGuide = { type: 'v' | 'h', position: number, start: number, end: number };

interface TemplateDesignerPageProps {
  template: LabelTemplate | null;
  presets: PresetProduct[];
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

const Ruler: React.FC<{ orientation: 'horizontal' | 'vertical', size: number, zoom: number, scrollPos: number }> = React.memo(({ orientation, size, zoom, scrollPos }) => {
    const ticks = [];
    const interval = zoom > 1.5 ? 5 : zoom > 0.7 ? 10 : 20;
    const numTicks = Math.ceil(size / interval);

    for (let i = 0; i <= numTicks; i++) {
        const pos = i * interval;
        const isMajor = i % 5 === 0;
        const tickLength = isMajor ? 10 : 5;
        const style = orientation === 'horizontal' 
            ? { left: `${(pos * zoom) - scrollPos}px`, height: `${tickLength}px` } 
            : { top: `${(pos * zoom) - scrollPos}px`, width: `${tickLength}px` };

        ticks.push(<div key={`tick-${i}`} className="tick" style={style} />);
        if (isMajor && i > 0) {
            const labelStyle = orientation === 'horizontal' 
                ? { left: `${(pos * zoom) - scrollPos}px` } 
                : { top: `${(pos * zoom) - scrollPos}px` };
            ticks.push(<div key={`label-${i}`} className="label" style={labelStyle}>{pos}</div>);
        }
    }
    return <div className={`ruler ${orientation}`}>{ticks}</div>;
});


const TemplateDesignerPage: React.FC<TemplateDesignerPageProps> = ({ template, presets, onSave, onCancel }) => {
  const [editedTemplate, setEditedTemplate, undo, redo, canUndo, canRedo] = useHistory<LabelTemplate>(
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
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
  const [previewProductId, setPreviewProductId] = useState<string>('placeholders');
  const [showGrid, setShowGrid] = useState(true);
  const [rulerScroll, setRulerScroll] = useState({ x: 0, y: 0 });
  
  const interactionRef = useRef(interaction);
  interactionRef.current = interaction;

  const canvasRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const designerAreaRef = useRef<HTMLDivElement>(null);
  
  const updateElement = useCallback((id: string, updates: Partial<LayoutElement>, pushHistory = true) => {
    const newState = {
      ...editedTemplate,
      elements: editedTemplate.elements.map(el => el.id === id ? { ...el, ...updates } : el),
    };
    setEditedTemplate(newState, !pushHistory);
  }, [editedTemplate, setEditedTemplate]);

  // --- Keyboard & Global Handlers ---
  useEffect(() => {
     if(pageRef.current) pageRef.current.focus();
     
     const handleKeyDown = (e: KeyboardEvent) => {
         if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
            e.preventDefault();
            e.shiftKey ? redo() : undo();
         } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
            e.preventDefault();
            redo();
         } else if (e.key === 'Escape') {
            setSelectedElementId(null);
            setContextMenu(null);
         } else if (e.key === 'Delete' && selectedElementId) {
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
  }, [selectedElementId, onCancel, contextMenu, undo, redo]);
  
  useEffect(() => {
    const area = designerAreaRef.current;
    if (!area) return;
    const handleScroll = () => {
        setRulerScroll({ x: area.scrollLeft, y: area.scrollTop });
    };
    area.addEventListener('scroll', handleScroll);
    return () => area.removeEventListener('scroll', handleScroll);
  }, []);

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
    setEditedTemplate({...editedTemplate, elements: [...editedTemplate.elements, newElement]});
    setSelectedElementId(newElement.id);
  }
  
  const handleDeleteElement = (id: string) => {
      setEditedTemplate({...editedTemplate, elements: editedTemplate.elements.filter(el => el.id !== id)});
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
      setEditedTemplate({...editedTemplate, elements: [...editedTemplate.elements, newElement]});
      setSelectedElementId(newElement.id);
  };
  
  const handleReorderElement = (id: string, direction: 'forward' | 'backward' | 'front' | 'back') => {
    let newElements = [...editedTemplate.elements];
    const targetElement = newElements.find(el => el.id === id);
    if(!targetElement) return;

    const sortedByZ = newElements.slice().sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    
    if (direction === 'front') {
        targetElement.zIndex = (sortedByZ[sortedByZ.length - 1]?.zIndex || 0) + 1;
    } else if (direction === 'back') {
        targetElement.zIndex = (sortedByZ[0]?.zIndex || 0) - 1;
    } else {
       // This logic is simplified but effective. A robust implementation would re-index all z-indices.
       const currentZ = targetElement.zIndex || 0;
       if (direction === 'forward') targetElement.zIndex = currentZ + 1.5;
       if (direction === 'backward') targetElement.zIndex = currentZ - 1.5;
       
       newElements.sort((a,b) => (a.zIndex || 0) - (b.zIndex || 0)).forEach((el, index) => el.zIndex = index);
    }
    
    setEditedTemplate({...editedTemplate, elements: newElements});
  };

  // --- Interactive Canvas Logic ---
  const handleInteractionStart = (e: React.MouseEvent, action: InteractionState['action'], elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedElementId(elementId);
    setInteraction({ action, elementId, initialState: editedTemplate });
  };

  const handleInteractionMove = useCallback((e: MouseEvent) => {
    if (!interactionRef.current || !canvasRef.current) return;
    e.preventDefault();
    const { elementId, initialState } = interactionRef.current;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left) / zoom;
    const mouseY = (e.clientY - canvasRect.top) / zoom;
    
    const canvasW = canvasRect.width / zoom;
    const canvasH = canvasRect.height / zoom;
    
    let currentElementState = initialState.elements.find(el => el.id === elementId)!;
    
    // Snapping logic
    const SNAP_THRESHOLD = (5 / zoom);
    const newGuides: SnapGuide[] = [];
    let snappedX = mouseX;
    let snappedY = mouseY;
    
    const movingElBounds = {
        left: currentElementState.x/100 * canvasW,
        cx: (currentElementState.x + currentElementState.width/2)/100 * canvasW,
        right: (currentElementState.x + currentElementState.width)/100 * canvasW,
        top: currentElementState.y/100 * canvasH,
        cy: (currentElementState.y + currentElementState.height/2)/100 * canvasH,
        bottom: (currentElementState.y + currentElementState.height)/100 * canvasH,
    };
    
    const checkSnap = (movingVal: number, staticVal: number, setter: (val: number) => void) => {
        if (Math.abs(movingVal - staticVal) < SNAP_THRESHOLD) {
            setter(staticVal);
            return true;
        }
        return false;
    };
    
    // Snap targets: other elements and canvas center
    const targets = [
        ...initialState.elements.filter(el => el.id !== elementId).map(el => ({
            left: el.x/100 * canvasW, cx: (el.x + el.width/2)/100 * canvasW, right: (el.x + el.width)/100 * canvasW,
            top: el.y/100 * canvasH, cy: (el.y + el.height/2)/100 * canvasH, bottom: (el.y + el.height)/100 * canvasH,
        })),
        { cx: canvasW / 2, cy: canvasH / 2 } // Canvas center
    ];

    targets.forEach(target => {
        if (checkSnap(movingElBounds.left, target.left, val => snappedX = val)) newGuides.push({type: 'v', position: target.left, start: Math.min(movingElBounds.top, target.top), end: Math.max(movingElBounds.bottom, target.bottom)});
        if (checkSnap(movingElBounds.cx, target.cx, val => snappedX = val - (currentElementState.width/200 * canvasW))) newGuides.push({type: 'v', position: target.cx, start: Math.min(movingElBounds.top, target.cy), end: Math.max(movingElBounds.bottom, target.cy)});
        if (checkSnap(movingElBounds.right, target.right, val => snappedX = val - (currentElementState.width/100 * canvasW))) newGuides.push({type: 'v', position: target.right, start: Math.min(movingElBounds.top, target.top), end: Math.max(movingElBounds.bottom, target.bottom)});
        
        if (checkSnap(movingElBounds.top, target.top, val => snappedY = val)) newGuides.push({type: 'h', position: target.top, start: Math.min(movingElBounds.left, target.left), end: Math.max(movingElBounds.right, target.right)});
        if (checkSnap(movingElBounds.cy, target.cy, val => snappedY = val - (currentElementState.height/200 * canvasH))) newGuides.push({type: 'h', position: target.cy, start: Math.min(movingElBounds.left, target.cx), end: Math.max(movingElBounds.right, target.cx)});
        if (checkSnap(movingElBounds.bottom, target.bottom, val => snappedY = val - (currentElementState.height/100 * canvasH))) newGuides.push({type: 'h', position: target.bottom, start: Math.min(movingElBounds.left, target.left), end: Math.max(movingElBounds.right, target.bottom)});
    });
    setSnapGuides(newGuides);
    
    updateElement(elementId, { x: snappedX/canvasW * 100, y: snappedY/canvasH * 100 }, false);

  }, [zoom, updateElement]);

  const handleInteractionEnd = useCallback(() => {
    if (interactionRef.current) {
        setEditedTemplate(editedTemplate); // This pushes the final state to history
    }
    setInteraction(null);
    setSnapGuides([]);
  }, [editedTemplate, setEditedTemplate]);

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
  
  const previewProductData = presets.find(p => p.id === previewProductId);
  
  // --- Render ---
  const selectedElement = editedTemplate.elements.find(el => el.id === selectedElementId);
  const sortedElements = editedTemplate.elements.slice().sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  const isArabicElement = selectedElement?.type === 'text' && (selectedElement.fontFamily === 'Noto Kufi Arabic' || selectedElement.dataBinding?.endsWith('_ar'));
  const canvasPixelWidth = editedTemplate.widthMm * 5;
  const canvasPixelHeight = editedTemplate.heightMm * 5;

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
                        {isArabicElement && (
                            <div className="mt-4">
                                <label>Text Direction</label>
                                <select value={selectedElement.direction || 'rtl'} onChange={e => updateElement(selectedElementId!, {direction: e.target.value as any})} className="p-1 border rounded w-full">
                                    <option value="ltr">Left-to-Right</option>
                                    <option value="rtl">Right-to-Left</option>
                                </select>
                            </div>
                        )}
                    </div>
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
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
             <input 
                type="text"
                value={editedTemplate.name}
                onChange={(e) => setEditedTemplate({ ...editedTemplate, name: e.target.value, isDefault: false })}
                className="text-2xl font-bold text-stone-700 p-1 -m-1 rounded-md focus:ring-2 focus:ring-indigo-500"
             />
             <div className="flex items-center gap-2 text-sm">
                 <input type="number" value={editedTemplate.widthMm} onChange={e => setEditedTemplate({ ...editedTemplate, widthMm: +e.target.value, isDefault: false })} className="w-16 p-1 border rounded" />
                 <span>mm &times;</span>
                 <input type="number" value={editedTemplate.heightMm} onChange={e => setEditedTemplate({ ...editedTemplate, heightMm: +e.target.value, isDefault: false })} className="w-16 p-1 border rounded" />
                 <span>mm</span>
             </div>
        </div>
        <div ref={designerAreaRef} className="flex-grow bg-stone-100 rounded-md p-4 flex items-center justify-center relative overflow-auto">
          <div
            className="relative"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s', width: canvasPixelWidth, height: canvasPixelHeight }}
          >
              <div className="absolute -top-[25px] -left-[25px] right-0 bottom-0 pointer-events-none">
                  <Ruler orientation="horizontal" size={editedTemplate.widthMm} zoom={5 * zoom} scrollPos={rulerScroll.x} />
                  <Ruler orientation="vertical" size={editedTemplate.heightMm} zoom={5 * zoom} scrollPos={rulerScroll.y} />
              </div>
              <div
                ref={canvasRef}
                className="bg-white shadow-md relative overflow-hidden"
                style={{ width: canvasPixelWidth, height: canvasPixelHeight }}
                onClick={(e) => { if(e.target === canvasRef.current) setSelectedElementId(null) }}
              >
                {showGrid && <div className="grid-overlay" />}
                
                {/* Data Preview Layer */}
                 {previewProductId !== 'placeholders' && previewProductData && (
                    <div className="absolute inset-0 pointer-events-none z-0">
                         <LabelPreview 
                            data={{
                                ...initialLabelData,
                                ...previewProductData.data,
                                expiryDate: calculateExpiryDate(initialLabelData.productionDate, previewProductData.shelfLifeDays)
                            }} 
                            template={editedTemplate} 
                            labelCount={1} printDensity="normal" />
                    </div>
                )}

                {/* Design Elements Layer */}
                {sortedElements.map(el => (
                  <div
                    key={el.id}
                    className={`template-element absolute ${previewProductId !== 'placeholders' ? 'opacity-30 bg-white/20' : ''} ${selectedElementId === el.id ? '' : 'hover:outline'}`}
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
                
                {/* Selection Box & Resizers */}
                {selectedElement && (
                    <div className="selection-box" style={{ left: `${selectedElement.x}%`, top: `${selectedElement.y}%`, width: `${selectedElement.width}%`, height: `${selectedElement.height}%`, transform: `rotate(${selectedElement.rotation || 0}deg)` }}>
                        <div className="rotator" onMouseDown={(e) => handleInteractionStart(e, 'rotate', selectedElement.id)}><div className="rotation-line"/></div>
                        <div className="resizer tl" onMouseDown={(e) => handleInteractionStart(e, 'resize-tl', selectedElement.id)}></div>
                        <div className="resizer tr" onMouseDown={(e) => handleInteractionStart(e, 'resize-tr', selectedElement.id)}></div>
                        <div className="resizer bl" onMouseDown={(e) => handleInteractionStart(e, 'resize-bl', selectedElement.id)}></div>
                        <div className="resizer br" onMouseDown={(e) => handleInteractionStart(e, 'resize-br', selectedElement.id)}></div>
                    </div>
                )}
                
                {/* Snap Guides */}
                {snapGuides.map((guide, i) => (
                    <div
                        key={i}
                        className={`snap-guide ${guide.type === 'v' ? 'vertical' : 'horizontal'}`}
                        style={guide.type === 'v' ? 
                            { left: guide.position, top: guide.start, height: guide.end - guide.start } : 
                            { top: guide.position, left: guide.start, width: guide.end - guide.start }}
                    />
                ))}
              </div>
          </div>
          <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md flex items-center p-1 text-sm">
             <label htmlFor="preview-product" className="px-2 font-medium text-stone-600">Preview with:</label>
             <select id="preview-product" value={previewProductId} onChange={e => setPreviewProductId(e.target.value)} className="bg-transparent font-medium border-0 focus:ring-0">
                <option value="placeholders">Placeholder Data</option>
                {presets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
             </select>
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md flex items-center p-1">
                <div className="tooltip"><button onClick={undo} disabled={!canUndo} className="p-2 rounded-md hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"><UndoIcon className="h-5 w-5" /><span className="tooltip-text">Undo (Ctrl+Z)</span></button></div>
                <div className="tooltip"><button onClick={redo} disabled={!canRedo} className="p-2 rounded-md hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"><RedoIcon className="h-5 w-5" /><span className="tooltip-text">Redo (Ctrl+Y)</span></button></div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md flex items-center p-1">
                 <div className="tooltip"><button onClick={() => setShowGrid(!showGrid)} className={`p-2 rounded-md hover:bg-stone-100 ${showGrid ? 'text-indigo-600' : ''}`}><GridIcon className="h-5 w-5" /><span className="tooltip-text">Toggle Grid</span></button></div>
                <div className="w-px h-5 bg-stone-200 mx-1"></div>
                <div className="tooltip"><button onClick={() => setZoom(z => z > 0.2 ? z - 0.1 : z)} className="p-2 rounded-md hover:bg-stone-100"><ZoomOutIcon className="h-5 w-5" /><span className="tooltip-text">Zoom Out</span></button></div>
                <span className="text-sm font-medium text-stone-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
                <div className="tooltip"><button onClick={() => setZoom(z => z < 3 ? z + 0.1 : z)} className="p-2 rounded-md hover:bg-stone-100"><ZoomInIcon className="h-5 w-5" /><span className="tooltip-text">Zoom In</span></button></div>
            </div>
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