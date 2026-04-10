import { Property, PropertyFilters } from "@/lib/types";

const PROPERTY_TYPE_GROUPS = {
  house: ["house"],
  apartment_condo: ["apartment", "condo"],
  commercial: ["office", "retail", "land"],
} as const;

const AMENITY_MATCHERS: Record<string, string[]> = {
  Pool: ["pool"],
  Waterfront: ["waterfront", "sea view", "beach access", "water view"],
  Gym: ["gym", "fitness"],
  Parking: ["parking", "garage"],
  Doorman: ["doorman", "concierge", "security"],
};

function matchesAmenity(property: Property, amenity: string) {
  const featureText = property.features.join(" ").toLowerCase();
  const variants = AMENITY_MATCHERS[amenity] ?? [amenity.toLowerCase()];

  return variants.some((variant) => featureText.includes(variant));
}

export function togglePropertyTypeGroup(
  currentTypes: string[],
  group: keyof typeof PROPERTY_TYPE_GROUPS
) {
  const groupTypes = PROPERTY_TYPE_GROUPS[group];
  const hasAllGroupTypes = groupTypes.every((type) => currentTypes.includes(type));

  if (hasAllGroupTypes) {
    return currentTypes.filter((type) => !groupTypes.includes(type as never));
  }

  return Array.from(new Set([...currentTypes, ...groupTypes]));
}

export function isPropertyTypeGroupSelected(
  currentTypes: string[],
  group: keyof typeof PROPERTY_TYPE_GROUPS
) {
  return PROPERTY_TYPE_GROUPS[group].every((type) => currentTypes.includes(type));
}

export function applyPropertyFilters(properties: Property[], filters: PropertyFilters) {
  return properties.filter((property) => {
    if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.category)) {
      return false;
    }

    if (filters.priceMin && property.price < Number(filters.priceMin)) {
      return false;
    }

    if (filters.priceMax && property.price > Number(filters.priceMax)) {
      return false;
    }

    if (filters.bedrooms) {
      const bedroomCount = property.specs.bedrooms ?? 0;

      if (bedroomCount < filters.bedrooms) {
        return false;
      }
    }

    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) =>
        matchesAmenity(property, amenity)
      );

      if (!hasAllAmenities) {
        return false;
      }
    }

    return true;
  });
}
