import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Bed, Bath, Ruler, Check } from 'lucide-react';
import { PROPERTIES } from '@/lib/data';
import { MapPlaceholder } from '@/components/search/MapPlaceholder';
import { formatIndianPrice } from '@/lib/whatsapp';
import { PropertyActionPanel } from '@/components/property/PropertyActionPanel';

// This is correct for Next.js 15+ async params
export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const property = PROPERTIES.find((p) => p.id === resolvedParams.id);

  if (!property) {
    notFound();
  }

  return (
    <div className="bg-white pb-20">
      
      {/* Gallery Header */}
      <div className="h-[60vh] md:h-[70vh] relative bg-slate-100 flex">
        {/* Main Image */}
        <div className="relative w-full md:w-2/3 h-full">
            <Image
                src={property.mainImage}
                alt={property.title}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover"
                priority
            />
            {/* <Link 
                href="/" 
                className="absolute top-6 left-6 z-[60] bg-white hover:bg-gray-100 text-blue-950 px-4 py-2 rounded-lg flex items-center transition-colors border-2 border-gray-200 shadow-md"
            >
                <ArrowLeft size={18} className="mr-2" /> Back to Home
            </Link> */}
        </div>
        {/* Side Grid Images (Desktop only) */}
        <div className="hidden md:flex flex-col w-1/3 h-full">
            {property.images.slice(0, 2).map((img, idx) => (
                <div key={idx} className="relative w-full h-1/2 border-l-4 border-white first:border-b-4">
                    <Image
                        src={img}
                        alt={`Interior view ${idx + 1}`}
                        fill
                        sizes="33vw"
                        className="object-cover"
                    />
                </div>
            ))}
        </div>
        
        {/* Action Buttons overlay */}
        <PropertyActionPanel property={property} section="overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                  
                  {/* Title Card */}
                  <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-200">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                          <div>
                              <div className="flex items-center gap-3 mb-2">
                                  <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded uppercase tracking-wide font-bold">{property.type}</span>
                                  <span className="bg-blue-950 text-white text-xs px-2 py-1 rounded uppercase tracking-wide font-bold">{property.status}</span>
                              </div>
                              <h1 className="text-3xl font-serif font-bold text-blue-950 mb-2">{property.title}</h1>
                              <div className="flex items-center text-gray-600">
                                  <MapPin size={18} className="mr-1 text-amber-500" />
                                  <span className="text-lg">{property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}</span>
                              </div>
                          </div>
                          <div className="text-3xl font-bold text-amber-500">
                              {formatIndianPrice(property.price)}
                          </div>
                      </div>

                      <div className="flex justify-between items-center bg-gray-50 p-6 rounded-lg border border-gray-200">
                          <div className="text-center">
                              <div className="flex items-center justify-center text-blue-950 mb-1"><Bed size={24} /></div>
                              <div className="font-bold text-blue-950 text-xl">{property.specs.bedrooms}</div>
                              <div className="text-xs text-gray-600 uppercase tracking-widest">Beds</div>
                          </div>
                          <div className="w-px h-10 bg-gray-200" />
                          <div className="text-center">
                              <div className="flex items-center justify-center text-blue-950 mb-1"><Bath size={24} /></div>
                              <div className="font-bold text-blue-950 text-xl">{property.specs.bathrooms}</div>
                              <div className="text-xs text-gray-600 uppercase tracking-widest">Baths</div>
                          </div>
                          <div className="w-px h-10 bg-gray-200" />
                          <div className="text-center">
                              <div className="flex items-center justify-center text-blue-950 mb-1"><Ruler size={24} /></div>
                              <div className="font-bold text-blue-950 text-xl">{property.specs.sqft.toLocaleString()}</div>
                              <div className="text-xs text-gray-600 uppercase tracking-widest">Sq Ft</div>
                          </div>
                           <div className="w-px h-10 bg-gray-200 hidden sm:block" />
                           <div className="text-center hidden sm:block">
                              <div className="font-bold text-blue-950 text-xl pt-1">{property.specs.yearBuilt}</div>
                              <div className="text-xs text-gray-600 uppercase tracking-widest">Year</div>
                          </div>
                      </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-200">
                      <h2 className="text-xl font-bold text-blue-950 mb-4">About this Property</h2>
                      <p className="text-gray-600 leading-relaxed text-lg">
                          {property.description}
                      </p>
                  </div>

                  {/* Features */}
                  <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-200">
                       <h2 className="text-xl font-bold text-blue-950 mb-6">Features & Amenities</h2>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {property.features.map((feature, idx) => (
                               <div key={idx} className="flex items-center text-gray-600">
                                   <div className="h-6 w-6 rounded-full bg-amber-100 text-blue-950 flex items-center justify-center mr-3 flex-shrink-0">
                                       <Check size={14} />
                                   </div>
                                   {feature}
                               </div>
                           ))}
                       </div>
                  </div>
                  
                  {/* Map Section */}
                  <div className="h-[400px] w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                        <MapPlaceholder properties={[property]} />
                  </div>

              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                  {/* Agent Card */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 sticky top-24">
                      <div className="flex items-center space-x-4 mb-6">
                          <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-amber-500">
                              <Image 
                                  src={property.agent.image} 
                                  alt={property.agent.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                              />
                          </div>
                          <div>
                              <h3 className="font-bold text-blue-950 text-lg">{property.agent.name}</h3>
                              <p className="text-gray-600 text-sm">{property.agent.role}</p>
                          </div>
                      </div>
                      
                      <PropertyActionPanel property={property} section="sidebar" />
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
