import { PROPERTIES } from "@/lib/data";
import { Property } from "@/lib/types";

export interface WhatsappLead {
  id: string;
  name: string;
  phone: string;
  propertyId: string;
  stage: "new" | "contacted" | "follow-up" | "visit-booked" | "negotiation";
  source: "website" | "catalog" | "broadcast";
  lastContactAt: string;
  nextFollowUpAt: string;
  assignedAgent: string;
  notes: string;
}

export interface FollowUpTemplate {
  id: string;
  label: string;
  delay: string;
  message: string;
}

export interface BroadcastAudience {
  id: string;
  name: string;
  recipients: number;
  type: "broadcast" | "group";
  focus: string;
}

export const DEFAULT_WHATSAPP_NUMBER = "918367743555";
export const FLOATING_WHATSAPP_NUMBER = "+91 83677 43555";

export const WHATSAPP_LEADS: WhatsappLead[] = [
  {
    id: "lead-1",
    name: "Rohan Mehta",
    phone: "+91 98111 22334",
    propertyId: "p1",
    stage: "new",
    source: "website",
    lastContactAt: "2026-04-05T10:30:00Z",
    nextFollowUpAt: "2026-04-06T09:00:00Z",
    assignedAgent: "Priya Sharma",
    notes: "Asked for pricing breakdown and maintenance details.",
  },
  {
    id: "lead-2",
    name: "Neha Kapoor",
    phone: "+91 98990 44556",
    propertyId: "p6",
    stage: "follow-up",
    source: "catalog",
    lastContactAt: "2026-04-04T13:00:00Z",
    nextFollowUpAt: "2026-04-07T11:00:00Z",
    assignedAgent: "Priya Sharma",
    notes: "Interested in rental yield and villa management support.",
  },
  {
    id: "lead-3",
    name: "Aditya Rao",
    phone: "+91 98222 66778",
    propertyId: "p5",
    stage: "visit-booked",
    source: "broadcast",
    lastContactAt: "2026-04-03T15:45:00Z",
    nextFollowUpAt: "2026-04-08T08:30:00Z",
    assignedAgent: "Rajesh Kumar",
    notes: "Site visit booked for Wednesday with operations team.",
  },
];

export const FOLLOW_UP_TEMPLATES: FollowUpTemplate[] = [
  {
    id: "instant",
    label: "Instant reply",
    delay: "0 min",
    message:
      "Hi {{name}}, thanks for reaching out about {{property}}. I can share pricing, brochure, and a quick walkthrough right here on WhatsApp.",
  },
  {
    id: "qualification",
    label: "Lead qualification",
    delay: "30 min",
    message:
      "Would you like this for self-use or investment? I can shortlist similar options in {{city}} based on your budget and move-in timeline.",
  },
  {
    id: "visit",
    label: "Visit reminder",
    delay: "1 day",
    message:
      "Checking in on {{property}}. I have open slots for a virtual or in-person visit tomorrow. Reply with your preferred time and I’ll lock it in.",
  },
  {
    id: "nurture",
    label: "Re-engagement",
    delay: "3 days",
    message:
      "I’ve also prepared 2 more listings similar to {{property}}. If you want, I can send a compact catalog here and help compare them quickly.",
  },
];

export const BROADCAST_AUDIENCES: BroadcastAudience[] = [
  {
    id: "luxury-buyers",
    name: "Luxury Buyers - Mumbai",
    recipients: 146,
    type: "broadcast",
    focus: "Premium homes above Rs. 4 Cr",
  },
  {
    id: "commercial-investors",
    name: "Commercial Investors",
    recipients: 82,
    type: "broadcast",
    focus: "Office and retail inventory",
  },
  {
    id: "goa-villa-circle",
    name: "Goa Villa Circle",
    recipients: 31,
    type: "group",
    focus: "Holiday homes and managed rentals",
  },
];

export function formatIndianPrice(price: number) {
  const crores = price / 10000000;
  return `₹${crores.toFixed(2)} Cr`;
}

export function buildPropertyShareText(property: Property) {
  return [
    `*${property.title}*`,
    `${property.location.city}, ${property.location.state}`,
    `${formatIndianPrice(property.price)}${property.status === "for-rent" ? " / month" : ""}`,
    `${property.specs.sqft.toLocaleString()} sq ft`,
    property.specs.bedrooms ? `${property.specs.bedrooms} bed / ${property.specs.bathrooms ?? "-"} bath` : "Commercial inventory",
    `Highlights: ${property.features.slice(0, 3).join(", ")}`,
  ].join("\n");
}

export function buildPropertyCatalogText(property: Property, origin?: string) {
  const path = origin ? `${origin}/property/${property.id}` : `/property/${property.id}`;

  return `${buildPropertyShareText(property)}\nView listing: ${path}`;
}

export function getWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppHref(message: string, phone = DEFAULT_WHATSAPP_NUMBER) {
  return getWhatsAppLink(phone, message);
}

export function buildPropertyInquiryMessage(property: Property) {
  return [
    `Hi Webb Heads, I'm interested in ${property.title}.`,
    `Location: ${property.location.city}, ${property.location.state}`,
    `Please share price details, brochure, and available visit slots.`,
  ].join("\n");
}

export function getCatalogProperties() {
  return PROPERTIES.slice(0, 5);
}
