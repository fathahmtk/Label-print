import React from 'react';
import type { LabelData, LabelTemplate, LayoutElement, DataBindingKey } from '../types';
import { BarcodeIcon, QrCodeIcon } from './icons';

interface LabelPreviewProps {
  data: LabelData;
  template: LabelTemplate | null;
  labelCount: number;
  printDensity: string;
}

const getBoundValue = (data: LabelData, binding: DataBindingKey): string => {
  return data[binding] || '';
};

const LabelContent: React.FC<{ data: LabelData; template: LabelTemplate }> = ({ data, template }) => {
  const renderElement = (element: LayoutElement) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.width}%`,
      height: `${element.height}%`,
      color: element.color,
      fontFamily: element.fontFamily,
      fontSize: `${element.fontSize}px`, // Will be scaled by parent
      fontWeight: element.fontWeight,
      textAlign: element.textAlign,
      letterSpacing: element.tracking,
      textTransform: element.isUppercase ? 'uppercase' : 'none',
      direction: element.dataBinding?.endsWith('_ar') ? 'rtl' : 'ltr',
    };
    
    const content = element.dataBinding ? getBoundValue(data, element.dataBinding) : (element.content || '');

    switch (element.type) {
      case 'logo':
        return (
          <div key={element.id} style={style} className="flex items-center justify-center">
            {data.logo ? (
              <img src={data.logo} alt="Brand Logo" className="max-w-full max-h-full object-contain" />
            ) : (
               <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-1/2 w-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               </div>
            )}
          </div>
        );
      case 'line':
         return (
          <div key={element.id} style={style} className="flex items-center justify-center">
             <div style={{ width: '100%', height: `${element.strokeWidth}px`, backgroundColor: element.strokeColor }} />
          </div>
         );
      case 'barcode':
        return (
             <div key={element.id} style={style} className="flex flex-col items-center justify-center p-1 text-black">
                <BarcodeIcon className="w-full h-auto flex-grow" />
                <span className="text-[5px] tracking-widest">{data.sku || '123456789012'}</span>
            </div>
        )
      case 'qrcode':
          return (
             <div key={element.id} style={style} className="flex flex-col items-center justify-center p-1 text-black">
                <QrCodeIcon className="w-auto h-full" />
            </div>
        )
      case 'text':
      default:
        const getVAlignClass = (vAlign: LayoutElement['verticalAlign']) => {
            switch (vAlign) {
                case 'top': return 'items-start';
                case 'bottom': return 'items-end';
                case 'middle':
                default: return 'items-center';
            }
        };
        return (
          <div key={element.id} style={style} className={`flex ${getVAlignClass(element.verticalAlign)} break-words whitespace-pre-wrap ${element.fontFamily === 'Noto Kufi Arabic' ? 'font-arabic' : ''}`}>
            <p className="w-full">{content}</p>
          </div>
        );
    }
  };

  return (
    <div 
        className="w-full h-full bg-white text-black relative"
        style={{
            aspectRatio: `${template.widthMm} / ${template.heightMm}`,
        }}
    >
      {template.elements.map(renderElement)}
    </div>
  );
};


const LabelPreview: React.FC<LabelPreviewProps> = ({ data, template, labelCount, printDensity }) => {
  if (!template) {
    return (
        <div className="no-print w-full max-w-2xl aspect-[16/9] bg-stone-100 text-stone-500 shadow-lg border border-stone-200 flex flex-col items-center justify-center font-['Montserrat'] rounded-lg overflow-hidden">
            <p>Please select a template to see a preview.</p>
        </div>
    );
  }

  const getPrintLayoutClasses = (count: number): string => {
    if (count === 12) return 'labels-12';
    if (count === 6) return 'labels-6';
    return 'labels-4';
  };

  const printClasses = `${getPrintLayoutClasses(labelCount)} ${printDensity === 'high' ? 'density-high' : ''}`;

  return (
    <>
      {/* Live Preview for Screen */}
      <div id="label-preview" className="no-print w-full max-w-2xl bg-white shadow-2xl border border-stone-200 flex flex-col rounded-lg overflow-hidden" style={{ aspectRatio: `${template.widthMm} / ${template.heightMm}`}}>
        <div className="w-full h-full" style={{ fontSize: '1.2vw' }}> {/* Scale font based on preview width */}
            <LabelContent data={data} template={template} />
        </div>
      </div>

      {/* Print Area for A4 Sheet - hidden on screen, visible on print */}
      <div id="print-area" className={printClasses}>
        <div className="print-grid-container">
          {[...Array(labelCount)].map((_, i) => (
            <div key={i} className="label-copy bg-white text-black relative overflow-hidden">
              <LabelContent data={data} template={template} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LabelPreview;