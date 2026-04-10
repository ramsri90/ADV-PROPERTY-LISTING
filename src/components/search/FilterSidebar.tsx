'use client';

import { Dispatch, SetStateAction } from "react";
import { PropertyFilters } from "@/lib/types";
import {
  isPropertyTypeGroupSelected,
  togglePropertyTypeGroup,
} from "@/lib/propertyFilters";

interface FilterSidebarProps {
  filters: PropertyFilters;
  setFilters: Dispatch<SetStateAction<PropertyFilters>>;
}

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const handleAmenityChange = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    setFilters({ ...filters, amenities: newAmenities });
  };

  const handleBedroomSelect = (num: number) => {
    setFilters({ ...filters, bedrooms: filters.bedrooms === num ? null : num });
  };

  const clearFilters = () => {
    setFilters({
      propertyTypes: [],
      priceMin: '',
      priceMax: '',
      bedrooms: null,
      amenities: [],
    });
  };

  return (
    <div className="sticky top-28 rounded-[1.35rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-[2rem] font-semibold tracking-[-0.02em] text-blue-950">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
        >
          Clear All
        </button>
      </div>

      <div>
        <h3 className="mb-4 text-[1.15rem] font-semibold text-blue-950">Property Type</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isPropertyTypeGroupSelected(filters.propertyTypes, 'house')}
              onChange={() =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  propertyTypes: togglePropertyTypeGroup(currentFilters.propertyTypes, 'house'),
                }))
              }
              className="h-5 w-5 rounded-[0.3rem] border border-slate-400 text-blue-600 focus:ring-2 focus:ring-blue-200" 
            />
            <span className="text-[1.05rem] text-slate-600">House</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isPropertyTypeGroupSelected(filters.propertyTypes, 'apartment_condo')}
              onChange={() =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  propertyTypes: togglePropertyTypeGroup(currentFilters.propertyTypes, 'apartment_condo'),
                }))
              }
              className="h-5 w-5 rounded-[0.3rem] border border-slate-400 text-blue-600 focus:ring-2 focus:ring-blue-200" 
            />
            <span className="text-[1.05rem] text-slate-600">Apartment / Condo</span>
          </label>
           <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isPropertyTypeGroupSelected(filters.propertyTypes, 'commercial')}
              onChange={() =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  propertyTypes: togglePropertyTypeGroup(currentFilters.propertyTypes, 'commercial'),
                }))
              }
              className="h-5 w-5 rounded-[0.3rem] border border-slate-400 text-blue-600 focus:ring-2 focus:ring-blue-200" 
            />
            <span className="text-[1.05rem] text-slate-600">Commercial</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-[1.15rem] font-semibold text-blue-950">Price Range</h3>
        <div className="flex gap-4">
           <input 
             type="number" 
             placeholder="Min" 
             value={filters.priceMin}
             onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
             className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-700 outline-none transition focus:border-blue-950 focus:ring-2 focus:ring-blue-100" 
           />
           <input 
             type="number" 
             placeholder="Max" 
             value={filters.priceMax}
             onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
             className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-700 outline-none transition focus:border-blue-950 focus:ring-2 focus:ring-blue-100" 
           />
        </div>
      </div>

       <div>
        <h3 className="mb-4 text-[1.15rem] font-semibold text-blue-950">Bedrooms</h3>
        <div className="flex gap-2">
           {[1, 2, 3, 4, 5].map((num) => (
             <button 
               key={num} 
               type="button"
               onClick={() => handleBedroomSelect(num)}
               className={`h-11 w-11 rounded-lg border transition-colors text-base font-medium ${
                 filters.bedrooms === num 
                   ? 'border-blue-950 bg-blue-950 text-white shadow-sm' 
                   : 'border-slate-300 bg-white text-slate-700 hover:border-blue-950'
               }`}
             >
               {num === 5 ? '5+' : num}
             </button>
           ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-[1.15rem] font-semibold text-blue-950">Amenities</h3>
        <div className="space-y-3">
           {['Pool', 'Waterfront', 'Gym', 'Parking', 'Doorman'].map((amenity) => (
             <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="h-5 w-5 rounded-[0.3rem] border border-slate-400 text-blue-600 focus:ring-2 focus:ring-blue-200" 
                />
                <span className="text-[1.05rem] text-slate-600">{amenity}</span>
            </label>
           ))}
        </div>
      </div>
    </div>
  );
}
