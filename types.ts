export interface LabelData {
  brandName: string;
  productName: string;
  productName_ar: string;
  tagline: string;
  tagline_ar: string;
  size: string;
  ingredients: string;
  ingredients_ar: string;
  allergens: string;
  allergens_ar: string;
  mfgAndDist: string;
  mfgAndDist_ar: string;
  quantityValue: string;
  quantityUnit: string;
  unitWeightValue: string;
  unitWeightUnit: string;
  netWeight: string;
  disclaimer: string;
  disclaimer_ar: string;
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

export type DataBindingKey = keyof Omit<LabelData, 'logo'>;

export interface LayoutElement {
  id: string;
  type: 'text' | 'logo' | 'line';
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  
  // Text-specific properties
  dataBinding?: DataBindingKey;
  content?: string; // for static text
  fontFamily?: string;
  fontSize?: number; // relative unit
  fontWeight?: '400' | '500' | '600' | '700' | '900';
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  color?: string;
  isUppercase?: boolean;
  tracking?: string; // letter-spacing
  
  // Line-specific properties
  strokeWidth?: number;
  strokeColor?: string;
}

export interface LabelTemplate {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  elements: LayoutElement[];
}