'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Box, Heart, MessageCircle, Share2, Video } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { Property } from '@/lib/types';
import { FAVORITES_EVENT, getStoredFavorites, setStoredFavorites } from '@/lib/favorites';
import { buildPropertyShareText, getWhatsAppLink } from '@/lib/whatsapp';

interface PropertyActionPanelProps {
  property: Property;
  section: 'overlay' | 'sidebar';
}

function hasLiveMedia(url?: string) {
  return Boolean(url && url !== '#' && !url.startsWith('#'));
}

export function PropertyActionPanel({ property, section }: PropertyActionPanelProps) {
  const { showToast } = useToast();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getStoredFavorites());
  const isSaved = favoriteIds.includes(property.id);
  const [shareLabel, setShareLabel] = useState('Share');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in ${property.title}. Please share more details.`,
  });

  const listingUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return `/property/${property.id}`;
    }

    return `${window.location.origin}/property/${property.id}`;
  }, [property.id]);

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

  const persistSavedState = (nextSaved: boolean) => {
    const currentFavorites = getStoredFavorites();
    const nextFavorites = nextSaved
      ? Array.from(new Set([...currentFavorites, property.id]))
      : currentFavorites.filter((favoriteId) => favoriteId !== property.id);

    setStoredFavorites(nextFavorites);
    setFavoriteIds(nextFavorites);
    showToast(nextSaved ? 'Property saved to favorites.' : 'Property removed from favorites.', nextSaved ? 'success' : 'info');
  };

  const openWhatsApp = (message: string) => {
    window.open(getWhatsAppLink(property.agent.phone, message), '_blank', 'noopener,noreferrer');
    showToast('Opening WhatsApp chat with the agent.', 'success');
  };

  const handleMediaAction = (kind: 'tour' | 'video') => {
    const mediaUrl = kind === 'tour' ? property.virtualTourUrl : property.videoUrl;

    if (hasLiveMedia(mediaUrl)) {
      window.open(mediaUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    openWhatsApp(
      `Hi ${property.agent.name.split(' ')[0]}, I'm interested in ${property.title}. Please share the ${kind === 'tour' ? '3D tour' : 'property video'} link.`
    );
  };

  const handleShare = async () => {
    const shareText = `${buildPropertyShareText(property)}\nView listing: ${listingUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: shareText,
          url: listingUrl,
        });
        setShareLabel('Shared');
        showToast('Listing shared successfully.', 'success');
        return;
      } catch {
        // Fall back to clipboard copy when native sharing is dismissed or unavailable.
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setShareLabel('Copied');
      showToast('Listing details copied to clipboard.', 'success');
    } catch {
      showToast('Sharing is not available on this device.', 'warning');
    }
  };

  const handleScheduleTour = () => {
    openWhatsApp(
      `Hi ${property.agent.name.split(' ')[0]}, I'd like to schedule a tour for ${property.title}. Please share available time slots.`
    );
  };

  const handleInquirySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inquiryMessage = [
      `Hi ${property.agent.name.split(' ')[0]}, I have a question about ${property.title}.`,
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Message: ${formData.message}`,
    ].join('\n');

    openWhatsApp(inquiryMessage);
  };

  if (section === 'overlay') {
    return (
      <div className="absolute bottom-6 right-6 flex gap-3 z-10">
        <button
          type="button"
          onClick={() => handleMediaAction('tour')}
          className="bg-white px-4 py-2 rounded-lg text-blue-950 font-medium shadow-lg hover:bg-gray-100 flex items-center border-2 border-gray-200"
        >
          <Box size={18} className="mr-2" /> 3D Tour
        </button>
        <button
          type="button"
          onClick={() => handleMediaAction('video')}
          className="bg-white px-4 py-2 rounded-lg text-blue-950 font-medium shadow-lg hover:bg-gray-100 flex items-center border-2 border-gray-200"
        >
          <Video size={18} className="mr-2" /> Video
        </button>
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share listing"
          className="bg-white px-3 py-2 rounded-lg text-blue-950 shadow-lg hover:bg-gray-100 border-2 border-gray-200"
        >
          <span className="flex items-center gap-2">
            <Share2 size={20} />
            <span className="hidden sm:inline">{shareLabel}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => persistSavedState(!isSaved)}
          aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
          className={`rounded-lg border-2 p-2 shadow-lg transition-colors ${
            isSaved
              ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'border-gray-200 bg-white text-blue-950 hover:bg-gray-100'
          }`}
        >
          <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <Button type="button" onClick={handleScheduleTour} className="w-full">
          Schedule a Tour
        </Button>
        <a
          href={getWhatsAppLink(
            property.agent.phone,
            `Hi ${property.agent.name.split(' ')[0]}, I'm interested in ${property.title}. Please share more details.`
          )}
          target="_blank"
          rel="noreferrer"
          title="Chat on WhatsApp for details"
          aria-label="Chat on WhatsApp for details"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#25D366] px-4 py-2 font-medium text-white transition-colors hover:bg-[#1ebe5d]"
        >
          <MessageCircle size={18} className="mr-2" />
          Chat on WhatsApp
        </a>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-blue-950 mb-3">Ask a Question</h4>
        <form className="space-y-3" onSubmit={handleInquirySubmit}>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
            placeholder="Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
          />
          <input
            type="email"
            required
            value={formData.email}
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
          />
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
            placeholder="Phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
          />
          <textarea
            required
            value={formData.message}
            onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
          />
          <Button type="submit" variant="secondary" className="w-full">
            Send Request
          </Button>
        </form>
      </div>
    </>
  );
}
