'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingUp, Home, Globe, Award, Headphones } from "lucide-react";
import { PROPERTIES } from "@/lib/data";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/Button";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  const featuredProperties = PROPERTIES.filter(p => p.isFeatured).slice(0, 3);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <div className="flex flex-col gap-0 pb-20 bg-gray-50">
      
      {/* Hero Section - Redesigned */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 overflow-hidden pt-16">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-800 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left Side - Content */}
            <div className="flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                Discover Your Dream Home in India
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl">
                Experience luxury living with Webb Heads - Where exceptional properties meet extraordinary service across India&apos;s finest locations
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 mb-8 w-full">
                <input
                  type="text"
                  placeholder="Search by city, neighborhood, or property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 text-gray-900"
                />
                <Button type="submit" size="lg" className="w-full md:w-auto px-8">
                  Search
                </Button>
              </form>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <span className="flex items-center bg-white/10 border-2 border-white/20 px-4 py-2 rounded-lg text-white">
                  <ShieldCheck size={18} className="mr-2 text-amber-500" /> Verified Listings
                </span>
                <span className="flex items-center bg-white/10 border-2 border-white/20 px-4 py-2 rounded-lg text-white">
                  <TrendingUp size={18} className="mr-2 text-amber-500" /> Market Insights
                </span>
              </div>
            </div>

            {/* Right Side - Featured Property Card */}
            <div className="hidden lg:block">
              {featuredProperties[0] && (
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-800">
                  <div className="relative h-64">
                    <Image
                      src={featuredProperties[0].mainImage}
                      alt={featuredProperties[0].title}
                      fill
                      sizes="(max-width: 1024px) 0vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-blue-950 mb-2">{featuredProperties[0].title}</h3>
                    <p className="text-gray-600 mb-4">{featuredProperties[0].location.city}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-amber-500">
                        ₹{(featuredProperties[0].price / 10000000).toFixed(2)} Cr
                      </span>
                      <Link href={`/property/${featuredProperties[0].id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="flex justify-between items-end mb-12"
         >
            <div>
              <h2 className="text-5xl font-serif font-bold text-blue-950 mb-3">Featured Properties</h2>
              <p className="text-gray-600 text-lg">Handpicked luxury properties across India</p>
            </div>
            <Link href="/search" className="hidden md:flex items-center text-amber-600 font-semibold hover:text-amber-700 transition-all duration-300 hover:gap-3 gap-2">
               View All Properties <ArrowRight size={18} />
            </Link>
         </motion.div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
               <motion.div
                 key={property.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
               >
                 <PropertyCard property={property} />
               </motion.div>
            ))}
         </div>
         
         </div>
      </section>

      {/* Value Props / Why Choose Us */}
      <section className="bg-white py-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16">
               <h2 className="text-5xl font-serif font-bold text-blue-950 mb-6">Why Webb Heads?</h2>
               <p className="text-gray-600 text-xl mt-4 max-w-2xl mx-auto">We combine cutting-edge technology with personalized service to deliver an unmatched real estate experience.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: 0.1 }}
                 className="bg-white border-2 border-blue-950 p-10 rounded-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
               >
                  <div className="h-16 w-16 bg-blue-950 text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                     <TrendingUp size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-950 mb-4">AI-Powered Insights</h3>
                  <p className="text-gray-600 leading-relaxed">Our advanced algorithms analyze market trends to help you find the best investment opportunities and perfect homes.</p>
               </motion.div>
               
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="bg-white border-2 border-blue-950 p-10 rounded-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
               >
                   <div className="h-16 w-16 bg-blue-950 text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                     <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-950 mb-4">Verified Listings</h3>
                  <p className="text-gray-600 leading-relaxed">Every property on our platform is vetted by our team of experts to ensure authenticity and quality.</p>
               </motion.div>
               
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: 0.3 }}
                 className="bg-white border-2 border-blue-950 p-10 rounded-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
               >
                   <div className="h-16 w-16 bg-blue-950 text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                     <Home size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-950 mb-4">Immersive Tours</h3>
                  <p className="text-gray-600 leading-relaxed">Experience properties from anywhere with high-definition 3D tours, video walkthroughs, and detailed floor plans.</p>
               </motion.div>
               
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: 0.4 }}
                 className="bg-white border-2 border-blue-950 p-10 rounded-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
               >
                   <div className="h-16 w-16 bg-blue-950 text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                     <Globe size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-950 mb-4">Pan-India Network</h3>
                  <p className="text-gray-600 leading-relaxed">Access properties across all major Indian cities through our extensive network of trusted partners and agents.</p>
               </motion.div>
               
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: 0.5 }}
                 className="bg-white border-2 border-blue-950 p-10 rounded-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
               >
                   <div className="h-16 w-16 bg-blue-950 text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                     <Headphones size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-950 mb-4">24/7 Support</h3>
                  <p className="text-gray-600 leading-relaxed">Our dedicated team is available around the clock to answer questions and guide you through every step of your journey.</p>
               </motion.div>
               
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: 0.6 }}
                 className="bg-white border-2 border-blue-950 p-10 rounded-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
               >
                   <div className="h-16 w-16 bg-blue-950 text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                     <Award size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-950 mb-4">Award-Winning Service</h3>
                  <p className="text-gray-600 leading-relaxed">Recognized industry-wide for exceptional service, innovative technology, and outstanding client satisfaction.</p>
               </motion.div>
            </div>
         </div>
      </section>
      
      {/* Stats Section */}
      <Stats />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Ready to Find Your Dream Property?</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
               Join thousands of satisfied clients who have found their perfect home or investment through Webb Heads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/search">
                 <Button variant="accent" size="lg" className="w-full sm:w-auto font-bold px-8">Start Searching</Button>
               </Link>
               <Link href="/agents">
                 <Button size="lg" className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-950 font-bold px-8">Contact an Agent</Button>
               </Link>
            </div>
         </div>
        </div>
      </section>

    </div>
  );
}
