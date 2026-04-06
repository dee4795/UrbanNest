export type ListingPurpose = 'rent' | 'buy';
export type PropertyType = 'apartment' | 'row-house';
export type BHKType = 1 | 2 | 3 | 4;

export interface PropertyListing {
  id: string;
  ownerEmail: string;
  purpose: ListingPurpose;
  propertyType: PropertyType;
  title: string;
  area: string;
  bhk: BHKType;
  price: number;
  address: string;
  contactName: string;
  contactPhone: string;
  imageDataUrls: string[];
  parking?: string | null;
  carpetAreaSqft?: number | null;
  builtUpAreaSqft?: number | null;
  amenities?: string[];
  propertyAge?: number | null;
  builderName?: string | null;
  createdAt: string;
}

export interface PropertyFilters {
  purpose: 'all' | ListingPurpose;
  propertyType: 'all' | PropertyType;
  minBudget?: number;
  maxBudget?: number;
  area: string;
  bhk: 'all' | BHKType;
}
