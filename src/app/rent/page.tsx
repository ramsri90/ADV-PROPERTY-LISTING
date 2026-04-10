'use client';

import { useState, useMemo } from 'react';
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PROPERTIES } from "@/lib/data";
import { Property, PropertyFilters } from "@/lib/types";
import { applyPropertyFilters } from "@/lib/propertyFilters";
import { Key, Clock, Shield } from 'lucide-react';

export default function RentPage() {
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyTypes: [],
    priceMin: '',
    priceMax: '',
    bedrooms: null,
    amenities: [],
  });

  // Filter only properties for rent
  const rentalProperties = useMemo(
    () => PROPERTIES.filter((property: Property) => property.status === 'for-rent'),
    []
  );

  const filteredProperties = useMemo(
    () => applyPropertyFilters(rentalProperties, filters),
    [filters, rentalProperties]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-blue-950 mb-4">
            Find Your Rental Home
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover comfortable rental properties across India. From short-term stays to long-term leases, find your perfect temporary home.
          </p>
          
          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-200">
              <Key className="text-green-500 mx-auto mb-3" size={32} />
              <h3 className="font-bold text-blue-950 mb-2">Flexible Terms</h3>
              <p className="text-gray-600 text-sm">Short & long-term leases</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-200">
              <Clock className="text-green-500 mx-auto mb-3" size={32} />
              <h3 className="font-bold text-blue-950 mb-2">Quick Move-In</h3>
              <p className="text-gray-600 text-sm">Ready-to-occupy properties</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-200">
              <Shield className="text-green-500 mx-auto mb-3" size={32} />
              <h3 className="font-bold text-blue-950 mb-2">Verified Owners</h3>
              <p className="text-gray-600 text-sm">Safe & transparent rentals</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* Property Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600 text-lg">
                <span className="font-bold text-blue-950">{filteredProperties.length}</span> rental properties available
              </p>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-md">
                <p className="text-xl text-gray-600 mb-4">No rental properties found</p>
                <p className="text-gray-400">Try adjusting your filters or check back later</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
