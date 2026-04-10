'use client';

import Image from 'next/image';
import { Mail, Phone, MapPin, Award, Home, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { getWhatsAppLink } from '@/lib/whatsapp';

const agents = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Senior Real Estate Agent',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&crop=faces',
    email: 'priya.sharma@webbheads.in',
    phone: '+91 83677 43555',
    location: 'Mumbai, Maharashtra',
    specialties: ['Luxury Homes', 'Waterfront Properties', 'Investment'],
    listings: 45,
    experience: '12 years',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    role: 'Commercial Real Estate Expert',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=faces',
    email: 'rajesh.kumar@webbheads.in',
    phone: '+91 83677 43555',
    location: 'Bangalore, Karnataka',
    specialties: ['Commercial', 'Office Spaces', 'Retail'],
    listings: 38,
    experience: '15 years',
  },
  {
    id: 3,
    name: 'Anjali Reddy',
    role: 'Residential Property Specialist',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&crop=faces',
    email: 'anjali.reddy@webbheads.in',
    phone: '+91 83677 43555',
    location: 'Hyderabad, Telangana',
    specialties: ['Residential', 'First-Time Buyers', 'Relocation'],
    listings: 52,
    experience: '8 years',
  },
  {
    id: 4,
    name: 'Arjun Mehta',
    role: 'Luxury Estate Advisor',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&crop=faces',
    email: 'arjun.mehta@webbheads.in',
    phone: '+91 83677 43555',
    location: 'New Delhi',
    specialties: ['Luxury Estates', 'High-End Properties', 'Premium Homes'],
    listings: 28,
    experience: '20 years',
  },
  {
    id: 5,
    name: 'Kavya Patel',
    role: 'Investment Property Consultant',
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=600&h=800&fit=crop&crop=faces',
    email: 'kavya.patel@webbheads.in',
    phone: '+91 83677 43555',
    location: 'Pune, Maharashtra',
    specialties: ['Investment', 'Multi-Family', 'ROI Analysis'],
    listings: 41,
    experience: '10 years',
  },
  {
    id: 6,
    name: 'Vikram Singh',
    role: 'Vacation Property Expert',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop&crop=faces',
    email: 'vikram.singh@webbheads.in',
    phone: '+91 83677 43555',
    location: 'Goa',
    specialties: ['Vacation Homes', 'Beach Properties', 'Short-term Rentals'],
    listings: 35,
    experience: '7 years',
  },
];

export default function AgentsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-serif font-bold text-blue-950 mb-6">Our Expert Agents</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our team of experienced real estate professionals dedicated to helping you find your perfect property
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-blue-950 hover:shadow-xl transition-all duration-300"
            >
              {/* Agent Image */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={agent.image}
                  alt={agent.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{agent.name}</h3>
                  <p className="text-amber-400 text-sm font-medium">{agent.role}</p>
                </div>
              </div>

              {/* Agent Info */}
              <div className="p-6 space-y-4">
                {/* Stats */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-500">{agent.listings}</div>
                    <div className="text-xs text-gray-500 uppercase">Active Listings</div>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-500">{agent.experience}</div>
                    <div className="text-xs text-gray-500 uppercase">Experience</div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2 text-amber-500 flex-shrink-0" />
                    {agent.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-2 text-blue-950 flex-shrink-0" />
                    {agent.email}
                  </div>
                  <div className="flex items-center justify-between gap-3 text-gray-600">
                    <div className="flex items-center min-w-0">
                    <Phone size={16} className="mr-2 text-blue-950 flex-shrink-0" />
                    <span>{agent.phone}</span>
                    </div>
                    <a
                      href={getWhatsAppLink(
                        agent.phone,
                        `Hi ${agent.name}, I found your profile on Webb Heads.\nI'd like to discuss a property.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      title="Chat on WhatsApp for details"
                      aria-label={`Chat with ${agent.name} on WhatsApp`}
                      className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#1ebe5d]"
                    >
                      <MessageCircle size={18} />
                    </a>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-2">
                    {agent.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-amber-50 text-blue-950 text-xs rounded-full font-medium border border-amber-200"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    onClick={() => {
                      window.location.href = `mailto:${agent.email}?subject=${encodeURIComponent(`Inquiry for ${agent.name}`)}`;
                    }}
                    className="flex-1"
                    size="sm"
                  >
                    <Mail size={16} className="mr-1" /> Contact
                  </Button>
                  <Button
                    type="button"
                    onClick={() => router.push(`/search?q=${encodeURIComponent(agent.location.split(',')[0])}`)}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    <Home size={16} className="mr-1" /> Listings
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-950 rounded-2xl p-12 text-center shadow-xl border-2 border-blue-900">
          <Award size={48} className="mx-auto mb-4 text-amber-500" />
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Join Our Team of Elite Agents
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for talented real estate professionals to join Webb Heads India
          </p>
          <Button
            type="button"
            onClick={() => {
              window.location.href =
                'mailto:careers@webbheads.in?subject=' +
                encodeURIComponent('Application for Webb Heads agent network');
            }}
            variant="white"
            size="lg"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
