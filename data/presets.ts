import type { PresetProduct, LabelData, LabelTemplate } from '../types';

export const initialPresets: PresetProduct[] = [
  {
    id: 'preset-1',
    name: 'Chocolate Chip Cookies',
    shelfLifeDays: 7,
    lastModified: '2023-10-26T10:00:00Z',
    data: {
      sku: 'HBB-CK-CC-001',
      productName: 'CHOCOLATE CHIP COOKIES',
      productName_ar: 'كوكيز برقائق الشوكولاتة',
      size: '6-Pack',
      ingredients: 'Enriched Wheat Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Sugar, Brown Sugar, Butter (Cream, Salt), Eggs, Vanilla Extract, Baking Soda, Salt, Chocolate Chips (Sugar, Chocolate Liquor, Cocoa Butter, Soy Lecithin, Vanilla Extract).',
      ingredients_ar: 'دقيق القمح المخصب (دقيق القمح، نياسين، حديد مختزل، ثيامين أحادي النترات، ريبوفلافين، حمض الفوليك)، سكر، سكر بني، زبدة (كريمة، ملح)، بيض، خلاصة الفانيليا، صودا الخبز، ملح، رقائق الشوكولاتة (سكر، سائل الشوكولاتة، زبدة الكاكاو، ليسيثين الصويا، خلاصة الفانيليا).',
      allergens: 'CONTAINS: WHEAT, MILK, EGGS, SOY.',
      allergens_ar: 'يحتوي على: قمح، حليب، بيض، صويا.',
      quantityValue: '6',
      quantityUnit: 'Pieces',
      unitWeightValue: '33.3',
      unitWeightUnit: 'g',
      tagline: 'Freshly baked happiness.',
      tagline_ar: 'سعادة مخبوزة طازجة.',
    }
  },
  {
    id: 'preset-2',
    name: 'Sourdough Bread',
    shelfLifeDays: 5,
    lastModified: '2023-10-25T12:30:00Z',
    data: {
      sku: 'HBB-BR-SD-001',
      productName: 'ARTISAN SOURDOUGH BREAD',
      productName_ar: 'خبز الساوردو الحرفي',
      size: 'Large Loaf',
      ingredients: 'Organic Wheat Flour, Water, Sourdough Starter (Flour, Water), Sea Salt.',
      ingredients_ar: 'دقيق قمح عضوي، ماء، خميرة طبيعية (دقيق، ماء)، ملح بحري.',
      allergens: 'CONTAINS: WHEAT.',
      allergens_ar: 'يحتوي على: قمح.',
      quantityValue: '1',
      quantityUnit: 'Loaf',
      unitWeightValue: '680',
      unitWeightUnit: 'g',
      tagline: 'Naturally leavened, handcrafted.',
      tagline_ar: 'مخمر طبيعياً، صنع يدوي.',
    }
  },
  {
    id: 'preset-3',
    name: 'Spicy Hummus',
    shelfLifeDays: 10,
    lastModified: '2023-10-24T09:00:00Z',
    data: {
      sku: 'HBB-DP-HM-001',
      productName: 'SPICY RED PEPPER HUMMUS',
      productName_ar: 'حمص بالفلفل الأحمر الحار',
      size: '250g Container',
      ingredients: 'Chickpeas, Tahini (Sesame Paste), Roasted Red Peppers, Olive Oil, Lemon Juice, Garlic, Cumin, Cayenne Pepper, Sea Salt.',
      ingredients_ar: 'حمص، طحينة (معجون سمسم)، فلفل أحمر مشوي، زيت زيتون، عصير ليمون، ثوم، كمون، فلفل حريف، ملح بحري.',
      allergens: 'CONTAINS: SESAME.',
      allergens_ar: 'يحتوي على: سمسم.',
      quantityValue: '1',
      quantityUnit: 'Container',
      unitWeightValue: '250',
      unitWeightUnit: 'g',
      tagline: 'Bold & Creamy Dip.',
      tagline_ar: 'تغميسة جريئة وكريمية.',
    }
  }
];

export const initialLabelData: LabelData = {
    brandName: "Hot Bake",
    productName: '',
    productName_ar: '',
    tagline: 'Quality You Can Taste',
    tagline_ar: 'جودة يمكنك تذوقها',
    size: 'Regular',
    logo: '',
    ingredients: '',
    ingredients_ar: '',
    allergens: '',
    allergens_ar: '',
    mfgAndDist: "Your Company Name\nYour City, Country",
    mfgAndDist_ar: "اسم شركتك\nمدينتك، دولتك",
    quantityValue: '0',
    quantityUnit: '',
    unitWeightValue: '0',
    unitWeightUnit: 'g',
    netWeight: '',
    disclaimer: 'MADE IN COTTAGE FOOD OPERATION.',
    disclaimer_ar: 'صنع في منشأة أغذية منزلية.',
    productionDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    sku: ''
};

export const calculateExpiryDate = (startDate: string, days: number): string => {
    if (!startDate || isNaN(days)) return '';
    const parts = startDate.split('-').map(part => parseInt(part, 10));
    const utcDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    utcDate.setUTCDate(utcDate.getUTCDate() + days);
    return utcDate.toISOString().split('T')[0];
};

export const initialTemplates: LabelTemplate[] = [
    {
        id: 'template-default-bilingual',
        name: 'Default Bilingual Side-by-Side',
        widthMm: 100,
        heightMm: 50,
        lastModified: '2023-10-26T11:00:00Z',
        elements: [
            { id: crypto.randomUUID(), type: 'logo', x: 2, y: 5, width: 20, height: 20 },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'brandName', x: 2, y: 30, width: 20, height: 10, fontSize: 14, fontWeight: '700', textAlign: 'center', fontFamily: 'Dancing Script' },
            { id: crypto.randomUUID(), type: 'line', x: 25, y: 5, width: 0.5, height: 90, strokeWidth: 1, strokeColor: '#e5e7eb' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName_ar', x: 28, y: 5, width: 68, height: 10, fontSize: 10, fontWeight: '900', textAlign: 'right', fontFamily: 'Noto Kufi Arabic', isUppercase: false },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName', x: 28, y: 15, width: 68, height: 10, fontSize: 10, fontWeight: '900', textAlign: 'left', fontFamily: 'Montserrat', isUppercase: true },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients_ar', x: 28, y: 28, width: 68, height: 30, fontSize: 4, textAlign: 'right', fontFamily: 'Noto Kufi Arabic' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients', x: 28, y: 58, width: 68, height: 20, fontSize: 4, textAlign: 'left', fontFamily: 'Montserrat' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'allergens_ar', x: 28, y: 80, width: 33, height: 5, fontSize: 4, fontWeight: '700', textAlign: 'right', fontFamily: 'Noto Kufi Arabic' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'allergens', x: 63, y: 80, width: 33, height: 5, fontSize: 4, fontWeight: '700', textAlign: 'left', fontFamily: 'Montserrat' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productionDate', content: 'Prod:', x: 2, y: 75, width: 10, height: 5, fontSize: 5 },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'expiryDate', content: 'Exp:', x: 2, y: 82, width: 10, height: 5, fontSize: 5 },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'netWeight', x: 2, y: 90, width: 20, height: 5, fontSize: 6, fontWeight: '700', textAlign: 'center' }
        ]
    },
    {
        id: 'template-modern-portrait',
        name: 'Modern Minimalist Portrait',
        widthMm: 50,
        heightMm: 70,
        lastModified: '2023-10-25T14:00:00Z',
        elements: [
           { id: crypto.randomUUID(), type: 'logo', x: 30, y: 5, width: 40, height: 15 },
           { id: crypto.randomUUID(), type: 'text', dataBinding: 'brandName', x: 10, y: 22, width: 80, height: 8, fontSize: 10, fontWeight: '700', textAlign: 'center', fontFamily: 'Dancing Script'},
           { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName', x: 5, y: 32, width: 90, height: 12, fontSize: 12, fontWeight: '900', textAlign: 'center', isUppercase: true },
           { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName_ar', x: 5, y: 44, width: 90, height: 8, fontSize: 10, fontWeight: '700', textAlign: 'center', fontFamily: 'Noto Kufi Arabic'},
           { id: crypto.randomUUID(), type: 'line', x: 10, y: 55, width: 80, height: 0.5, strokeWidth: 1, strokeColor: '#e5e7eb' },
           { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients', x: 5, y: 60, width: 90, height: 15, fontSize: 4, textAlign: 'center'},
           { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients_ar', x: 5, y: 75, width: 90, height: 15, fontSize: 4, textAlign: 'center', fontFamily: 'Noto Kufi Arabic'},
           { id: crypto.randomUUID(), type: 'text', dataBinding: 'netWeight', x: 5, y: 92, width: 30, height: 5, fontSize: 6, fontWeight: '700', textAlign: 'left'},
           { id: crypto.randomUUID(), type: 'text', dataBinding: 'productionDate', content: 'Prod:', x: 40, y: 92, width: 30, height: 5, fontSize: 5 },
           { id: crypto.randomUUID(), type: 'text', dataBinding: 'expiryDate', content: 'Exp:', x: 70, y: 92, width: 30, height: 5, fontSize: 5 },
        ]
    }
];
