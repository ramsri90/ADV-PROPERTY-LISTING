'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Heart, Search, Trash2 } from 'lucide-react';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { PROPERTIES } from '@/lib/data';
import { FAVORITES_EVENT, getStoredFavorites, setStoredFavorites } from '@/lib/favorites';

export default function SavedPropertiesPage() {
  const { showToast } = useToast();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getStoredFavorites());

  useEffect(() => {
    const syncFavorites = () => {
      setFavoriteIds(getStoredFavorites());
    };

    window.addEventListener('storage', syncFavorites);
    window.addEventListener(FAVORITES_EVENT, syncFavorites);

    return () => {
      window.removeEventListener('storage', syncFavorites);
      window.removeEventListener(FAVORITES_EVENT, syncFavorites);
    };
  }, []);

  const savedProperties = useMemo(
    () => PROPERTIES.filter((property) => favoriteIds.includes(property.id)),
    [favoriteIds]
  );

  const clearSavedProperties = () => {
    setStoredFavorites([]);
    setFavoriteIds([]);
    showToast('Saved properties cleared.', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 rounded-[2rem] border border-gray-200 bg-white p-8 shadow-lg md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <Heart size={26} fill="currentColor" />
            </div>
            <h1 className="text-5xl font-serif font-bold text-blue-950">Saved Properties</h1>
            <p className="mt-3 max-w-2xl text-lg text-gray-600">
              Keep your shortlist in one place and jump back into the properties you want to revisit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600">
              {savedProperties.length} saved
            </div>
            {savedProperties.length > 0 ? (
              <Button type="button" variant="outline" onClick={clearSavedProperties} className="gap-2">
                <Trash2 size={16} />
                Clear Saved
              </Button>
            ) : null}
          </div>
        </div>

        {savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white px-8 py-20 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-950">
              <Search size={26} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-blue-950">No saved properties yet</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Tap the heart icon on any property to build your shortlist. Your saved homes will appear here instantly.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/search">
                <Button variant="accent" className="px-8 font-bold">
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
