import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-blue-950">
              Webb Heads
            </h3>
            <p className="text-sm leading-relaxed">
              India&apos;s premier destination for luxury real estate listings, connecting buyers, sellers, and agents with the finest properties.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-blue-950 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-blue-950 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-blue-950 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-blue-950 font-semibold mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/search" className="hover:text-blue-950 transition-colors">Find a Home</Link></li>
              <li><Link href="/search?status=for-rent" className="hover:text-blue-950 transition-colors">Rent a Home</Link></li>
              <li><Link href="/search?type=commercial" className="hover:text-blue-950 transition-colors">Commercial Real Estate</Link></li>
              <li><Link href="/search" className="hover:text-blue-950 transition-colors">New Construction</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
             <h4 className="text-blue-950 font-semibold mb-6">Company</h4>
             <ul className="space-y-3 text-sm">
              <li><Link href="/agents" className="hover:text-blue-950 transition-colors">About Us</Link></li>
              <li><Link href="/agents" className="hover:text-blue-950 transition-colors">Our Team</Link></li>
              <li><Link href="/agents" className="hover:text-blue-950 transition-colors">Careers</Link></li>
              <li><Link href="/agents" className="hover:text-blue-950 transition-colors">Contact Us</Link></li>
              <li><Link href="/agents" className="hover:text-blue-950 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
             <h4 className="text-blue-950 font-semibold mb-6">Contact</h4>
             <ul className="space-y-4 text-sm">
               <li className="flex items-start space-x-3">
                 <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                 <span>Bandra West, Mumbai<br />Maharashtra 400050</span>
               </li>
               <li className="flex items-center space-x-3">
                 <Phone size={18} className="flex-shrink-0" />
                 <span>+91 22 4567 8900</span>
               </li>
               <li className="flex items-center space-x-3">
                 <Mail size={18} className="flex-shrink-0" />
                 <span>info@webbheads.in</span>
               </li>
             </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Webb Heads India Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
