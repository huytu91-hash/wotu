import {
  DesignCalculationInput,
  DesignCalculationResult,
  ConstructionCalculationInput,
  ConstructionCalculationResult,
} from '@/types';

const DESIGN_PRICES = {
  g1: { name: 'GÓI 1 – TIẾT KIỆM', price: 79000 },
  g2: { name: 'GÓI 2 – CƠ BẢN', price: 119000 },
  g3: { name: 'GÓI 3 – HOÀN THIỆN', price: 179000 },
};

const CONSTRUCTION_PRICES = {
  c1: { name: 'CƠ BẢN', price: 6000000 },
  c2: { name: 'TRUNG BÌNH', price: 7000000 },
  c3: { name: 'CAO CẤP', price: 8000000 },
};

const CONST_COEFFICIENTS = {
  balcony: 0.5,
  roofTon: 0.3,
};

export class PricingEngine {
  static calculateDesign(input: DesignCalculationInput): DesignCalculationResult {
    const pkg = DESIGN_PRICES[input.packageId];
    if (!pkg) throw new Error('Gói thiết kế không hợp lệ');

    const subtotal = input.areaSqm * pkg.price;
    const vatRate = 0.1; 
    const vatAmount = subtotal * vatRate;
    const grandTotal = subtotal + vatAmount;

    return {
      packageName: pkg.name,
      pricePerSqm: pkg.price,
      areaSqm: input.areaSqm,
      subtotal,
      vatRate,
      vatAmount,
      grandTotal,
    };
  }

  static calculateConstruction(input: ConstructionCalculationInput): ConstructionCalculationResult {
    const pkg = CONSTRUCTION_PRICES[input.packageId];
    if (!pkg) throw new Error('Gói xây dựng không hợp lệ');

    const balconyArea = input.width * input.balconyLength * CONST_COEFFICIENTS.balcony;
    const singleFloorArea = input.landArea + balconyArea;

    let floorsAreaBTCT = 0;
    let floorsAreaTon = 0;

    if (input.hasRoofTon) {
      floorsAreaBTCT = singleFloorArea * (input.floorsCount - 1);
      floorsAreaTon = singleFloorArea * CONST_COEFFICIENTS.roofTon;
    } else {
      floorsAreaBTCT = singleFloorArea * input.floorsCount;
    }

    const totalCalculationArea = floorsAreaBTCT + floorsAreaTon;
    const subtotal = totalCalculationArea * pkg.price;
    const vatAmount = 0; 
    const grandTotal = subtotal + vatAmount;

    return {
      landArea: input.landArea,
      balconyArea,
      floorsAreaBTCT,
      floorsAreaTon,
      totalCalculationArea,
      packagePricePerSqm: pkg.price,
      subtotal,
      vatAmount,
      grandTotal,
    };
  }
}
