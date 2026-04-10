'use client';

import { useState, useMemo } from 'react';
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PROPERTIES } from "@/lib/data";
import { Property, PropertyFilters } from "@/lib/types";
import { applyPropertyFilters } from "@/lib/propertyFilters";
import { Building2, TrendingUp, Briefcase } from 'lucide-react';

export default function CommercialPage() {
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyTypes: [],
    priceMin: '',
    priceMax: '',
    bedrooms: null,
    amenities: [],
  });

  // Filter only commercial properties
  const commercialProperties = useMemo(
    () => PROPERTIES.filter((property: Property) => property.type === 'commercial'),
    []
  );

  const filteredProperties = useMemo(
    () => applyPropertyFilters(commercialProperties, filters),
    [commercialProperties, filters]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-blue-950 mb-4">
            Commercial Properties
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Premium business spaces for investors, corporates, and entrepreneurs. Office spaces, retail shops, warehouses, and more.
          </p>
          
          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-200">
              <Building2 className="text-blue-600 mx-auto mb-3" size={32} />
              <h3 className="font-bold text-blue-950 mb-2">Prime Locations</h3>
              <p className="text-gray-600 text-sm">High-traffic business areas</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-200">
              <TrendingUp className="text-blue-600 mx-auto mb-3" size={32} />
              <h3 className="font-bold text-blue-950 mb-2">High ROI</h3>
              <p className="text-gray-600 text-sm">Excellent investment returns</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-200">
              <Briefcase className="text-blue-600 mx-auto mb-3" size={32} />
              <h3 className="font-bold text-blue-950 mb-2">Business Ready</h3>
              <p className="text-gray-600 text-sm">Fully equipped spaces</p>
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
                <span className="font-bold text-blue-950">{filteredProperties.length}</span> commercial spaces available
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
                <p className="text-xl text-gray-600 mb-4">No commercial properties found</p>
                <p className="text-gray-400">Try adjusting your filters or contact us for off-market opportunities</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
