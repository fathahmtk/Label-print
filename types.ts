export interface LabelData {
  brandName: string;
  productName: string;
  tagline: string;
  ingredients: string;
  allergens: string;
  mfgAndDist: string;
  quantity: string;
  netWeight: string;
  disclaimer: string;
  productionDate: string;
  expiryDate: string;
  logo?: string;
}

export interface PresetProduct {
  name: string;
  data: Partial<Omit<LabelData, 'logo' | 'productionDate' | 'expiryDate'>>;
  shelfLifeDays: number;
}
