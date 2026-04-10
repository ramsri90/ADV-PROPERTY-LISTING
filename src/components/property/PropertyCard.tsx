'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Bed, Bath, Heart, Ruler, MapPin, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { FAVORITES_EVENT, getStoredFavorites, setStoredFavorites } from '@/lib/favorites';
import { Property } from '@/lib/types';
import { buildPropertyInquiryMessage, buildWhatsAppHref, formatIndianPrice } from '@/lib/whatsapp';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { showToast } = useToast();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const whatsappHref = buildWhatsAppHref(buildPropertyInquiryMessage(property));
  const isSaved = favoriteIds.includes(property.id);

  useEffect(() => {
    const syncFavorites = () => {
      setFavoriteIds(getStoredFavorites());
    };

    syncFavorites();
    window.addEventListener('storage', syncFavorites);
    window.addEventListener(FAVORITES_EVENT, syncFavorites);

    return () => {
      window.removeEventListener('storage', syncFavorites);
      window.removeEventListener(FAVORITES_EVENT, syncFavorites);
    };
  }, []);

  const toggleFavorite = () => {
    const nextFavorites = isSaved
      ? favoriteIds.filter((favoriteId) => favoriteId !== property.id)
      : Array.from(new Set([...favoriteIds, property.id]));

    setStoredFavorites(nextFavorites);
    setFavoriteIds(nextFavorites);
    showToast(
      isSaved ? 'Property removed from favorites.' : 'Property saved to favorites.',
      isSaved ? 'info' : 'success'
    );
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-950">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={property.mainImage}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-amber-500 text-blue-950 px-3 py-1 rounded-full text-xs font-bold uppercase">
             {property.type}
        </div>
        <div className="absolute top-4 right-4 bg-blue-950 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
             {property.status.replace('-', ' ')}
        </div>
        <button
          type="button"
          onClick={toggleFavorite}
          title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
          aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
          className={`absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-colors ${
            isSaved
              ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-950'
          }`}
        >
          <Heart size={18} strokeWidth={2.2} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
            <div>
                 <h3 className="text-xl font-serif font-bold text-blue-950 line-clamp-1 group-hover:text-amber-600 transition-colors">{property.title}</h3>
                 <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin size={14} className="mr-1 text-amber-500" />
                    <span>{property.location.city}, {property.location.state}</span>
                 </div>
            </div>
            <p className="text-lg font-bold text-blue-950 whitespace-nowrap">
                {formatIndianPrice(property.price)}
                {property.status === 'for-rent' && <span className="text-sm text-gray-500 font-normal">/mo</span>}
            </p>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 text-gray-600">
             <div className="flex items-center gap-2">
                 <Bed size={18} />
                 <span className="text-sm font-medium">{property.specs.bedrooms || '-'} Beds</span>
             </div>
             <div className="flex items-center gap-2">
                 <Bath size={18} />
                 <span className="text-sm font-medium">{property.specs.bathrooms || '-'} Baths</span>
             </div>
             <div className="flex items-center gap-2">
                 <Ruler size={18} />
                 <span className="text-sm font-medium">{property.specs.sqft.toLocaleString()} Sq Ft</span>
             </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
             <Link href={`/property/${property.id}`} className="block w-full text-center py-3 bg-blue-950 hover:bg-amber-500 text-white hover:text-blue-950 rounded-lg font-bold transition-all duration-300">
                View Details
             </Link>
             <a
               href={whatsappHref}
               target="_blank"
               rel="noreferrer"
               title="Chat on WhatsApp for details"
               aria-label="Chat on WhatsApp for details"
               className="flex w-full items-center justify-center rounded-lg border-2 border-green-600 py-3 font-bold text-green-700 transition-all duration-300 hover:bg-green-600 hover:text-white"
             >
               <MessageCircle size={18} className="mr-2" />
               WhatsApp
             </a>
        </div>
      </div>
    </div>
  );
}
