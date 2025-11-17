import React, { useState, useEffect } from 'react';
import type { LabelData, PresetProduct, LabelTemplate } from '../types';
import LabelForm from '../components/LabelForm';
import LabelPreview from '../components/LabelPreview';
import { initialLabelData, calculateExpiryDate } from '../data/presets';

interface PrintPageProps {
  presets: PresetProduct[];
  templates: LabelTemplate[];
}

const PrintPage: React.FC<PrintPageProps> = ({ presets, templates }) => {
  const [labelData, setLabelData] = useState<LabelData>(() => {
    const firstPreset = presets[0];
    if (firstPreset) {
      return {
        ...initialLabelData,
        ...firstPreset.data,
        expiryDate: calculateExpiryDate(initialLabelData.productionDate, firstPreset.shelfLifeDays),
      };
    }
    return initialLabelData;
  });

  const [selectedPresetShelfLife, setSelectedPresetShelfLife] = useState<number | null>(() => presets[0]?.shelfLifeDays ?? null);
  const [selectedPresetName, setSelectedPresetName] = useState<string>(() => presets[0]?.name ?? '');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => templates[0]?.id ?? '');

  const [labelCount, setLabelCount] = useState<number>(4);
  const [printDensity, setPrintDensity] = useState<string>('normal');

  useEffect(() => {
    const quantity = parseFloat(labelData.quantityValue) || 0;
    const unitWeight = parseFloat(labelData.unitWeightValue) || 0;

    if (quantity > 0 && unitWeight > 0) {
      let totalGrams = 0;
      if (labelData.unitWeightUnit === 'g') {
        totalGrams = quantity * unitWeight;
      } else if (labelData.unitWeightUnit === 'oz') {
        totalGrams = quantity * unitWeight * 28.3495;
      }

      const totalOunces = totalGrams / 28.3495;
      const netWeightString = `${totalOunces.toFixed(1)} oz | ${Math.round(totalGrams)}g`;

      if (netWeightString !== labelData.netWeight) {
        setLabelData(prev => ({ ...prev, netWeight: netWeightString }));
      }
    } else if (labelData.netWeight !== '') {
       setLabelData(prev => ({...prev, netWeight: ''}));
    }
  }, [labelData.quantityValue, labelData.unitWeightValue, labelData.unitWeightUnit, labelData.netWeight]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLabelData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'productionDate' && selectedPresetShelfLife !== null) {
        newData.expiryDate = calculateExpiryDate(value, selectedPresetShelfLife);
      }
      return newData;
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLabelData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLabelData(prev => ({ ...prev, logo: undefined }));
  };

  const handlePresetChange = (presetName: string) => {
    const selectedPreset = presets.find(p => p.name === presetName);
    if (selectedPreset) {
      const newExpiryDate = calculateExpiryDate(labelData.productionDate, selectedPreset.shelfLifeDays);
      setLabelData(prev => ({
        ...prev,
        ...selectedPreset.data,
        expiryDate: newExpiryDate,
      }));
      setSelectedPresetShelfLife(selectedPreset.shelfLifeDays);
      setSelectedPresetName(selectedPreset.name);
    }
  };
  
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-start">
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg no-print">
        <LabelForm
          data={labelData}
          onChange={handleInputChange}
          onLogoChange={handleLogoChange}
          onRemoveLogo={handleRemoveLogo}
          presets={presets}
          onPresetChange={handlePresetChange}
          selectedPresetName={selectedPresetName}
          templates={templates}
          selectedTemplateId={selectedTemplateId}
          onTemplateChange={setSelectedTemplateId}
          onPrint={handlePrint}
          labelCount={labelCount}
          onLabelCountChange={setLabelCount}
          printDensity={printDensity}
          onPrintDensityChange={setPrintDensity}
        />
      </div>
      <div className="lg:col-span-1 lg:sticky lg:top-28">
        <h2 className="text-2xl font-bold text-stone-700 mb-4 text-center lg:text-left no-print">Live Preview</h2>
        <div className="flex-grow flex items-center justify-center lg:justify-start bg-white p-4 rounded-lg shadow-lg print-container">
          <LabelPreview 
            data={labelData}
            template={selectedTemplate}
            labelCount={labelCount}
            printDensity={printDensity}
          />
        </div>
      </div>
    </div>
  );
};

export default PrintPage;
