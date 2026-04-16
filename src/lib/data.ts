import { Property, Agent } from './types';

const agent1: Agent = {
  id: 'a1',
  name: 'Priya Sharma',
  role: 'Senior Luxury Consultant',
  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
  phone: '+1 (555) 657-4503',
  email: 'priya@webbheads.in',
  bio: 'With over 15 years of experience in India\'s luxury real estate market, Priya specializes in premium properties across Mumbai and Delhi.'
};

const agent2: Agent = {
  id: 'a2',
  name: 'Rajesh Kumar',
  role: 'Commercial Specialist',
  image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
  phone: '+1 (555) 657-4503',
  email: 'rajesh@webbheads.in',
  bio: 'Rajesh brings expertise in commercial real estate, helping investors find high-yield opportunities across India\'s major cities.'
};

export const PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: 'Luxury Sea-View Penthouse',
    description: 'Experience unparalleled luxury in this exquisite penthouse offering panoramic views of the Arabian Sea. Features include a private terrace, infinity pool, and state-of-the-art smart home automation.',
    price: 125000000,
    location: {
      address: 'Altamount Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400026',
      lat: 18.9570,
      lng: 72.8050
    },
    type: 'residential',
    category: 'condo',
    status: 'for-sale',
    specs: {
      bedrooms: 5,
      bathrooms: 6,
      sqft: 6500,
      yearBuilt: 2024
    },
    features: ['Sea View', 'Smart Home', 'Private Pool', 'Gym', 'Spa', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200'
    ],
    mainImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000',
    virtualTourUrl: '#3d-tour',
    agent: agent1,
    isFeatured: true,
    createdAt: '2025-12-01T10:00:00Z'
  },
  {
    id: 'p2',
    title: 'Modern Villa in Whitefield',
    description: 'A masterpiece of contemporary architecture in Bangalore\'s tech hub. Features floor-to-ceiling windows, sustainable design, and seamless indoor-outdoor living spaces.',
    price: 42000000,
    location: {
      address: 'Whitefield Main Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zip: '560066',
      lat: 12.9698,
      lng: 77.7499
    },
    type: 'residential',
    category: 'house',
    status: 'for-sale',
    specs: {
      bedrooms: 4,
      bathrooms: 4,
      sqft: 3800,
      lotSize: 2.5,
      yearBuilt: 2023
    },
    features: ['Solar Power', 'Infinity Pool', 'Home Theater', 'Wine Cellar', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
    ],
    mainImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=2000',
    agent: agent1,
    isFeatured: true,
    createdAt: '2025-12-15T14:30:00Z'
  },
  {
    id: 'p3',
    title: 'Prime Commercial Space in Connaught Place',
    description: 'Exceptional high-traffic retail location in the heart of Delhi. Perfect for flagship stores, large display windows, and modern interiors.',
    price: 85000000,
    location: {
      address: 'Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      zip: '110001',
      lat: 28.6315,
      lng: 77.2167
    },
    type: 'commercial',
    category: 'retail',
    status: 'for-rent',
    specs: {
      sqft: 2200,
      yearBuilt: 1985
    },
    features: ['High Foot Traffic', 'Large Windows', 'HVAC Updated', 'Security System'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200'
    ],
    mainImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
    agent: agent2,
    isFeatured: false,
    createdAt: '2026-01-02T09:15:00Z'
  },
  {
    id: 'p4',
    title: 'Elegant Heritage Apartment',
    description: 'Beautifully restored heritage apartment in the heart of Kolkata. Classic architecture meets modern comfort with high ceilings, intricate woodwork, and a private terrace.',
    price: 68000000,
    location: {
      address: 'Park Street',
      city: 'Kolkata',
      state: 'West Bengal',
      zip: '700016',
      lat: 22.5549,
      lng: 88.3520
    },
    type: 'residential',
    category: 'condo',
    status: 'for-rent',
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2500,
      yearBuilt: 1920
    },
    features: ['Heritage Building', 'Terrace', 'High Ceilings', 'Parking', 'Central Location'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'
    ],
    mainImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2000',
    agent: agent1,
    isFeatured: true,
    createdAt: '2026-01-05T11:20:00Z'
  },
  {
    id: 'p5',
    title: 'Modern Tech Office Space',
    description: 'Grade A office space in Hyderabad\'s thriving tech hub. Open floor plans, conference centers, and ample parking. Ideal for IT companies and startups.',
    price: 180000000,
    location: {
      address: 'HITEC City',
      city: 'Hyderabad',
      state: 'Telangana',
      zip: '500081',
      lat: 17.4435,
      lng: 78.3772
    },
    type: 'commercial',
    category: 'office',
    status: 'for-sale',
    specs: {
      sqft: 25000,
      lotSize: 4.0,
      yearBuilt: 2020
    },
    features: ['LEED Certified', 'Cafeteria', 'Parking Garage', 'Fiber Internet'],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200'
    ],
    mainImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000',
    agent: agent2,
    isFeatured: false,
    createdAt: '2025-11-20T16:45:00Z'
  },
  {
    id: 'p6',
    title: 'Serene Waterfront Villa',
    description: 'Located on the pristine shores of Ashwem, this villa offers direct beach access, a private pool, and Balinese-inspired architecture. A perfect getaway or rental investment.',
    price: 55000000,
    location: {
      address: 'Ashwem Beach Road',
      city: 'North Goa',
      state: 'Goa',
      zip: '403512',
      lat: 15.6559,
      lng: 73.7268
    },
    type: 'residential',
    category: 'house',
    status: 'for-sale',
    specs: {
      bedrooms: 4,
      bathrooms: 4,
      sqft: 4200,
      lotSize: 8.5,
      yearBuilt: 2022
    },
    features: ['Beach Access', 'Private Pool', 'Tropical Garden', 'Staff Quarters', 'Fully Furnished'],
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&q=80&w=1200'
    ],
    mainImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=2000',
    agent: agent1,
    isFeatured: true,
    createdAt: '2026-01-08T08:00:00Z'
  }
];
