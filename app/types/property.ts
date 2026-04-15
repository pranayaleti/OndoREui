export type PropertyType = "apartment" | "house" | "townhouse" | "condo" | "studio";

export interface ApiPhoto {
  id: string;
  propertyId: string;
  url: string;
  caption: string | null;
  orderIndex: number;
  createdAt: string;
}

export interface ApiContact {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface ApiProperty {
  publicId: string;
  title: string;
  type: PropertyType | string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  description: string | null;
  price: number;                 // monthly (₹)
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  phone: string | null;
  website: string | null;
  leaseTerms: string | null;
  fees: string | null;
  availability: string | null;
  rating: string | number | null; // "4.50" from API
  reviewCount: number | null;
  amenities: string[];
  specialties: string[];
  services: string[];
  valueRanges: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  photos: ApiPhoto[];
  lat?: number | null;
  lng?: number | null;
  owner?: ApiContact | null;
  manager?: ApiContact | null;
}

export interface Property {
  id: string;                    // use publicId
  title: string;
  type: PropertyType | string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  phone: string;
  website: string | null;
  leaseTerms: string | null;
  fees: string | null;
  availability: string | null;
  rating: number;
  reviewCount: number;
  amenities: string[];
  specialties: string[];
  services: string[];
  valueRanges: string[];
  images: string[];
  image: string;                 // cover image
  dateAdded: Date;               // from createdAt
  logo: string;                  // keep placeholder for now
  description: string;
  lat?: number | null;
  lng?: number | null;
  addressParts?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zipcode?: string | null;
  };
  contact: {
    name: string;          // e.g., "Hari Krishna"
    phone: string;         // prefer manager.phone, else owner.phone, else property.phone
    email: string;         // prefer manager.email, else owner.email, else ""
    role: "manager" | "owner" | "property";
  };
}
