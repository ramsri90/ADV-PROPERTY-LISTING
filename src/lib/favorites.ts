export const FAVORITES_STORAGE_KEY = 'webb-heads-favorites';
export const FAVORITES_EVENT = 'webb-heads-favorites-updated';

export function getStoredFavorites() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

export function setStoredFavorites(favoriteIds: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  window.dispatchEvent(new Event(FAVORITES_EVENT));
}
