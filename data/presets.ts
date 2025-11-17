import type { PresetProduct, LabelData, LabelTemplate, BrandingSettings } from '../types';

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

export const initialBrandingSettings: BrandingSettings = {
    defaultLogo: undefined,
    defaultMfgAndDist: "Hot Bake Co.\nDoha, Qatar",
    defaultMfgAndDist_ar: "شركة هوت بيك\nالدوحة، قطر"
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
        id: 'template-ing-40', name: 'ING-40 (40x30mm)', widthMm: 40, heightMm: 30, isDefault: true,
        lastModified: '2023-10-27T10:00:00Z', elements: [
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName', x: 5, y: 5, width: 90, height: 25, fontSize: 8, fontWeight: '900', textAlign: 'center', isUppercase: true },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients', x: 5, y: 35, width: 90, height: 60, fontSize: 4, textAlign: 'center' },
        ]
    },
    {
        id: 'template-ing-60', name: 'ING-60 (60x40mm)', widthMm: 60, heightMm: 40, isDefault: true,
        lastModified: '2023-10-27T10:01:00Z', elements: [
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName', x: 5, y: 5, width: 90, height: 20, fontSize: 10, fontWeight: '900', textAlign: 'center', isUppercase: true },
            { id: crypto.randomUUID(), type: 'line', x: 10, y: 28, width: 80, height: 0.5, strokeWidth: 1, strokeColor: '#ccc' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients', x: 5, y: 35, width: 90, height: 40, fontSize: 5, textAlign: 'left' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'netWeight', x: 5, y: 80, width: 40, height: 15, fontSize: 6, fontWeight: '700', textAlign: 'left' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'expiryDate', x: 50, y: 80, width: 45, height: 15, fontSize: 6, fontWeight: '700', textAlign: 'right' },
        ]
    },
    {
        id: 'template-ing-80', name: 'ING-80 (80x50mm)', widthMm: 80, heightMm: 50, isDefault: true,
        lastModified: '2023-10-27T10:02:00Z', elements: [
            { id: crypto.randomUUID(), type: 'logo', x: 5, y: 8, width: 20, height: 20 },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'brandName', x: 5, y: 28, width: 20, height: 10, fontSize: 8, fontFamily: 'Dancing Script', textAlign: 'center' },
            { id: crypto.randomUUID(), type: 'line', x: 28, y: 8, width: 0.5, height: 84, strokeWidth: 1, strokeColor: '#e5e7eb' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName', x: 32, y: 8, width: 63, height: 20, fontSize: 12, fontWeight: '900', textAlign: 'center', isUppercase: true },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients', x: 32, y: 30, width: 63, height: 40, fontSize: 5 },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'allergens', x: 32, y: 72, width: 63, height: 10, fontSize: 5, fontWeight: '700' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productionDate', x: 5, y: 80, width: 20, height: 10, fontSize: 5, textAlign: 'left' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'expiryDate', x: 5, y: 88, width: 20, height: 10, fontSize: 5, textAlign: 'left' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'netWeight', x: 32, y: 85, width: 63, height: 10, fontSize: 8, fontWeight: '700', textAlign: 'right' },
        ]
    },
    {
        id: 'template-ing-90', name: 'ING-90 (90x60mm)', widthMm: 90, heightMm: 60, isDefault: true,
        lastModified: '2023-10-27T10:03:00Z', elements: [
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName_ar', x: 5, y: 5, width: 90, height: 15, fontSize: 12, fontWeight: '700', textAlign: 'center', fontFamily: 'Noto Kufi Arabic' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName', x: 5, y: 20, width: 90, height: 15, fontSize: 12, fontWeight: '900', textAlign: 'center', isUppercase: true },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients_ar', x: 55, y: 40, width: 40, height: 45, fontSize: 5, textAlign: 'right', fontFamily: 'Noto Kufi Arabic' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients', x: 5, y: 40, width: 40, height: 45, fontSize: 5, textAlign: 'left' },
            { id: crypto.randomUUID(), type: 'line', x: 50, y: 40, width: 0.2, height: 55, strokeWidth: 1, strokeColor: '#ccc' },
            { id: crypto.randomUUID(), type: 'barcode', x: 5, y: 85, width: 40, height: 12 },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'mfgAndDist', x: 55, y: 88, width: 40, height: 10, fontSize: 4, textAlign: 'right' },
        ]
    },
    {
        id: 'template-ing-100', name: 'ING-100 (100x60mm)', widthMm: 100, heightMm: 60, isDefault: true,
        lastModified: '2023-10-27T10:04:00Z', elements: [
            { id: crypto.randomUUID(), type: 'logo', x: 2, y: 5, width: 20, height: 20 },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'brandName', x: 2, y: 30, width: 20, height: 10, fontSize: 14, fontWeight: '700', textAlign: 'center', fontFamily: 'Dancing Script' },
            { id: crypto.randomUUID(), type: 'line', x: 25, y: 5, width: 0.5, height: 90, strokeWidth: 1, strokeColor: '#e5e7eb' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName_ar', x: 28, y: 5, width: 68, height: 10, fontSize: 10, fontWeight: '900', textAlign: 'right', fontFamily: 'Noto Kufi Arabic', isUppercase: false },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName', x: 28, y: 15, width: 68, height: 10, fontSize: 10, fontWeight: '900', textAlign: 'left', fontFamily: 'Montserrat', isUppercase: true },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients_ar', x: 28, y: 28, width: 68, height: 30, fontSize: 4, textAlign: 'right', fontFamily: 'Noto Kufi Arabic' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients', x: 28, y: 58, width: 68, height: 20, fontSize: 4, textAlign: 'left', fontFamily: 'Montserrat' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'allergens_ar', x: 28, y: 80, width: 33, height: 5, fontSize: 4, fontWeight: '700', textAlign: 'right', fontFamily: 'Noto Kufi Arabic' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'allergens', x: 63, y: 80, width: 33, height: 5, fontSize: 4, fontWeight: '700', textAlign: 'left', fontFamily: 'Montserrat' },
            { id: crypto.randomUUID(), type: 'text', content: 'Prod:', x: 2, y: 75, width: 6, height: 5, fontSize: 5 },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productionDate', x: 8, y: 75, width: 15, height: 5, fontSize: 5 },
            { id: crypto.randomUUID(), type: 'text', content: 'Exp:', x: 2, y: 82, width: 6, height: 5, fontSize: 5 },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'expiryDate', x: 8, y: 82, width: 15, height: 5, fontSize: 5 },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'netWeight', x: 2, y: 90, width: 20, height: 5, fontSize: 6, fontWeight: '700', textAlign: 'center' }
        ]
    },
    {
        id: 'template-ing-120', name: 'ING-120 (120x80mm)', widthMm: 120, heightMm: 80, isDefault: true,
        lastModified: '2023-10-27T10:05:00Z', elements: [
            { id: crypto.randomUUID(), type: 'logo', x: 3, y: 4, width: 15, height: 15 },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'brandName', x: 20, y: 5, width: 50, height: 12, fontSize: 20, fontWeight: '700', fontFamily: 'Dancing Script' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName_ar', x: 50, y: 5, width: 47, height: 10, fontSize: 14, fontWeight: '700', textAlign: 'right', fontFamily: 'Noto Kufi Arabic' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'productName', x: 3, y: 20, width: 94, height: 15, fontSize: 16, fontWeight: '900', isUppercase: true },
            { id: crypto.randomUUID(), type: 'line', x: 3, y: 36, width: 94, height: 0.5, strokeWidth: 1, strokeColor: '#ccc' },
            { id: crypto.randomUUID(), type: 'text', content: 'Ingredients:', x: 3, y: 40, width: 45, height: 8, fontSize: 8, fontWeight: '700' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients', x: 3, y: 48, width: 45, height: 32, fontSize: 6 },
            { id: crypto.randomUUID(), type: 'text', content: 'المكونات:', x: 52, y: 40, width: 45, height: 8, fontSize: 8, fontWeight: '700', textAlign: 'right', fontFamily: 'Noto Kufi Arabic' },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'ingredients_ar', x: 52, y: 48, width: 45, height: 32, fontSize: 6, textAlign: 'right', fontFamily: 'Noto Kufi Arabic' },
            { id: crypto.randomUUID(), type: 'barcode', x: 5, y: 82, width: 40, height: 15 },
            { id: crypto.randomUUID(), type: 'qrcode', x: 80, y: 80, width: 15, height: 18 },
            { id: crypto.randomUUID(), type: 'text', dataBinding: 'mfgAndDist', x: 50, y: 82, width: 28, height: 15, fontSize: 5, textAlign: 'right' },
        ]
    }
];