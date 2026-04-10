export interface Agent {
  id: string;
  name: string;
  role: string;
  image: string;
  phone: string;
  email: string;
  bio: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  type: 'residential' | 'commercial';
  category: 'house' | 'apartment' | 'condo' | 'office' | 'retail' | 'land';
  status: 'for-sale' | 'for-rent';
  specs: {
    bedrooms?: number;
    bathrooms?: number;
    sqft: number;
    lotSize?: number; // in acres
    yearBuilt: number;
  };
  features: string[];
  images: string[];
  mainImage: string;
  virtualTourUrl?: string; // Mock URL for 3D tour
  videoUrl?: string; // Mock URL for video
  agent: Agent;
  isFeatured: boolean;
  createdAt: string;
}

export interface PropertyFilters {
  propertyTypes: string[];
  priceMin: string;
  priceMax: string;
  bedrooms: number | null;
  amenities: string[];
}
