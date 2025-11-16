
import type { PresetProduct, LabelData } from '../types';

export const initialPresets: PresetProduct[] = [
  {
    id: 'preset-1',
    name: 'Chocolate Chip Cookies',
    shelfLifeDays: 7,
    data: {
      productName: 'CHOCOLATE CHIP COOKIES',
      size: '6-Pack',
      ingredients: 'Enriched Wheat Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Sugar, Brown Sugar, Butter (Cream, Salt), Eggs, Vanilla Extract, Baking Soda, Salt, Chocolate Chips (Sugar, Chocolate Liquor, Cocoa Butter, Soy Lecithin, Vanilla Extract).',
      allergens: 'CONTAINS: WHEAT, MILK, EGGS, SOY.',
      quantityValue: '6',
      quantityUnit: 'Pieces',
      unitWeightValue: '33.3',
      unitWeightUnit: 'g',
      tagline: 'Freshly baked happiness.',
    }
  },
  {
    id: 'preset-2',
    name: 'Sourdough Bread',
    shelfLifeDays: 5,
    data: {
      productName: 'ARTISAN SOURDOUGH BREAD',
      size: 'Large Loaf',
      ingredients: 'Organic Wheat Flour, Water, Sourdough Starter (Flour, Water), Sea Salt.',
      allergens: 'CONTAINS: WHEAT.',
      quantityValue: '1',
      quantityUnit: 'Loaf',
      unitWeightValue: '680',
      unitWeightUnit: 'g',
      tagline: 'Naturally leavened, handcrafted.',
    }
  },
  {
    id: 'preset-3',
    name: 'Strawberry Jam',
    shelfLifeDays: 365,
    data: {
      productName: 'HOMEMADE STRAWBERRY JAM',
      size: '8oz Jar',
      ingredients: 'Strawberries, Sugar, Lemon Juice, Pectin.',
      allergens: '',
      quantityValue: '1',
      quantityUnit: 'Jar',
      unitWeightValue: '227',
      unitWeightUnit: 'g',
      tagline: 'Sunshine in a jar.',
    }
  },
];

export const initialLabelData: LabelData = {
    brandName: "Hot Bake",
    productName: '',
    tagline: 'Quality You Can Taste',
    size: 'Regular',
    logo: '',
    ingredients: '',
    allergens: '',
    mfgAndDist: "Your Company Name\nYour City, Country",
    quantityValue: '0',
    quantityUnit: '',
    unitWeightValue: '0',
    unitWeightUnit: 'g',
    netWeight: '',
    disclaimer: 'MADE IN COTTAGE FOOD OPERATION THAT IS NOT SUBJECT TO ROUTINE GOVERNMENT FOOD SAFETY INSPECTIONS.',
    productionDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
};

export const calculateExpiryDate = (startDate: string, days: number): string => {
    if (!startDate || isNaN(days)) return '';
    
    // Using UTC to avoid timezone-related errors.
    const parts = startDate.split('-').map(part => parseInt(part, 10));
    const utcDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    
    utcDate.setUTCDate(utcDate.getUTCDate() + days);

    return utcDate.toISOString().split('T')[0];
};