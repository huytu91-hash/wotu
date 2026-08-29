export interface CustomerLead {
  id?: string;
  fullName: string;
  phone: string;
  address: string;
  email?: string;
  acceptedConsent: boolean;
}

export type ServiceType = 'DESIGN' | 'CONSTRUCTION' | 'INTERIOR';

export interface DesignCalculationInput {
  packageId: 'g1' | 'g2' | 'g3';
  areaSqm: number;
}

export interface DesignCalculationResult {
  packageName: string;
  pricePerSqm: number;
  areaSqm: number;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
}

export interface ConstructionCalculationInput {
  houseType: 'nhà ống' | 'nhà 2 mặt tiền' | 'nhà villa / biệt thự' | 'nhà mái thái';
  roadType: 'đường ô tô' | 'hẻm lớn' | 'hẻm nhỏ';
  landArea: number;
  width: number;
  length: number;
  balconyLength: number; 
  floorsCount: number;
  hasRoofTon: boolean; 
  packageId: 'c1' | 'c2' | 'c3';
}

export interface ConstructionCalculationResult {
  landArea: number;
  balconyArea: number;
  floorsAreaBTCT: number;
  floorsAreaTon: number;
  totalCalculationArea: number;
  packagePricePerSqm: number;
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
}
