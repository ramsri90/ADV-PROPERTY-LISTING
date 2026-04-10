'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PROPERTIES } from "@/lib/data";
import { Property, PropertyFilters } from "@/lib/types";
import { applyPropertyFilters } from "@/lib/propertyFilters";

const PROPERTIES_PER_PAGE = 4;

function PaginatedPropertyResults({ properties }: { properties: Property[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(properties.length / PROPERTIES_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PROPERTIES_PER_PAGE;
  const paginatedProperties = properties.slice(startIndex, startIndex + PROPERTIES_PER_PAGE);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {properties.length > PROPERTIES_PER_PAGE && (
        <div className="flex justify-center mt-12 space-x-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safeCurrentPage === 1}
            className="px-4 py-2 border-2 border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === safeCurrentPage;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-4 py-2 rounded-md font-bold ${
                  isActive
                    ? 'bg-blue-950 text-white'
                    : 'border-2 border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={safeCurrentPage === totalPages}
            className="px-4 py-2 border-2 border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialStatus = searchParams.get('status');
  const initialType = searchParams.get('type');
  const initialSell = searchParams.get('sell');
  
  // Filter state
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyTypes: [] as string[],
    priceMin: '',
    priceMax: '',
    bedrooms: null as number | null,
    amenities: [] as string[],
  });

  // Filter properties
  const baseProperties = useMemo(() => {
    return PROPERTIES.filter((property: Property) => {
      // URL Param Filters
      if (initialStatus && property.status !== initialStatus) return false;
      if (initialSell === 'true' && property.status !== 'for-sale') return false;
      if (initialType === 'commercial' && property.type !== 'commercial') return false;

      // Search query filter
      if (initialQuery) {
        const query = initialQuery.toLowerCase();
        const matchesQuery = 
          property.title.toLowerCase().includes(query) ||
          property.location.city.toLowerCase().includes(query) ||
          property.location.state.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [initialQuery, initialSell, initialStatus, initialType]);

  const filteredProperties = useMemo(
    () => applyPropertyFilters(baseProperties, filters),
    [baseProperties, filters]
  );
  const paginationKey = JSON.stringify({
    initialQuery,
    initialStatus,
    initialType,
    initialSell,
    filters,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-5xl font-serif font-bold text-blue-950 mb-2">Find Your Next Property</h1>
          {initialQuery && (
            <p className="text-gray-600 text-lg">Showing results for &quot;{initialQuery}&quot; - {filteredProperties.length} properties found</p>
          )}
          {!initialQuery && (
            <p className="text-gray-600 text-lg">Showing {filteredProperties.length} properties</p>
          )}
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
           <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        {/* Listenings Grid & Map */}
        <div className="lg:col-span-3 space-y-6">
           {/* Mobile Filter Toggle could go here */}
           
           {/* Map Removed as per request */}
           
           {filteredProperties.length > 0 ? (
             <PaginatedPropertyResults key={paginationKey} properties={filteredProperties} />
           ) : (
             <div className="text-center py-20">
               <p className="text-xl text-gray-600 mb-4">No properties found matching your criteria</p>
               <p className="text-gray-400">Try adjusting your filters or search terms</p>
             </div>
           )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <SearchContent />
    </Suspense>
  );
}
