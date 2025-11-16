export interface LabelData {
  brandName: string;
  productName: string;
  tagline: string;
  ingredients: string;
  allergens: string;
  mfgAndDist: string;
  quantityValue: string;
  quantityUnit: string;
  unitWeightValue: string;
  unitWeightUnit: string;
  netWeight: string;
  disclaimer: string;
  productionDate: string;
  expiryDate: string;
  logo?: string;
}

export interface PresetProduct {
  id: string;
  name: string;
  data: Partial<Omit<LabelData, 'logo' | 'productionDate' | 'expiryDate'>>;
  shelfLifeDays: number;
}
