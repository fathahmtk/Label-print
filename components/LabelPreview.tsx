import React, { useEffect, useRef } from 'react';
import type { LabelData, LabelTemplate, LayoutElement, DataBindingKey } from '../types';

declare const JsBarcode: any;
declare const QRCode: any;

interface LabelPreviewProps {
  data: LabelData;
  template: LabelTemplate | null;
  labelCount: number;
  printDensity: string;
}

const getBoundValue = (data: LabelData, binding: DataBindingKey): string => {
  return data[binding] || '';
};

const BarcodeElement: React.FC<{ sku: string }> = ({ sku }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (ref.current && sku) {
            try {
                JsBarcode(ref.current, sku, {
                    format: 'CODE128',
                    displayValue: true,
                    fontSize: 14,
                    margin: 0,
                    height: 50,
                });
            } catch (e) {
                console.error("JsBarcode error:", e);
                 // Fallback to show error on canvas
                const ctx = ref.current.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
                    ctx.fillStyle = 'red';
                    ctx.font = '10px Arial';
                    ctx.fillText('Invalid Barcode Data', 2, 10);
                }
            }
        }
    }, [sku]);
    return <canvas ref={ref} className="w-full h-full object-contain" />;
};

const QrCodeElement: React.FC<{ sku: string }> = ({ sku }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (ref.current && sku) {
             QRCode.toCanvas(ref.current, sku, { errorCorrectionLevel: 'H', margin: 1, width: 200 }, (error: any) => {
                if (error) console.error("QRCode error:", error);
            });
        }
    }, [sku]);
    return <canvas ref={ref} className="w-full h-full object-contain" />;
};


const LabelContent: React.FC<{ data: LabelData; template: LabelTemplate }> = React.memo(({ data, template }) => {
  const renderElement = (element: LayoutElement) => {
    const isArabic = element.fontFamily === 'Noto Kufi Arabic' || element.dataBinding?.endsWith('_ar');
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.width}%`,
      height: `${element.height}%`,
      color: element.color,
      fontFamily: element.fontFamily,
      fontSize: `${element.fontSize}px`, // Will be scaled by parent
      fontWeight: isArabic && element.fontWeight_ar ? element.fontWeight_ar : element.fontWeight,
      textAlign: element.textAlign,
      letterSpacing: element.tracking,
      textTransform: element.isUppercase ? 'uppercase' : 'none',
      direction: element.direction || (isArabic ? 'rtl' : 'ltr'),
      transform: `rotate(${element.rotation || 0}deg)`,
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
                <svg xmlns="http://www.w.org/2000/svg" className="h-1/2 w-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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
             <div key={element.id} style={style} className="flex flex-col items-center justify-center p-1 bg-white text-black">
                <BarcodeElement sku={data.sku || 'NO-SKU'} />
            </div>
        )
      case 'qrcode':
          return (
             <div key={element.id} style={style} className="flex flex-col items-center justify-center p-1 bg-white text-black">
                <QrCodeElement sku={data.sku || 'NO-SKU'} />
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

  const sortedElements = template.elements.slice().sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  return (
    <div 
        className="w-full h-full bg-white text-black relative"
        style={{
            aspectRatio: `${template.widthMm} / ${template.heightMm}`,
        }}
    >
      {sortedElements.map(renderElement)}
    </div>
  );
});


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