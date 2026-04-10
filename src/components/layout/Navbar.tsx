'use client';

import Link from 'next/link';
import { Menu, X, Search, Heart, Home, Building2, DollarSign, Key, Phone, User, Users2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useToast } from '@/components/ui/ToastProvider';
import { getWhatsAppLink } from '@/lib/whatsapp';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const { showToast } = useToast();

  const navItems = [
    { href: '/buy', label: 'Buy', icon: Home },
    { href: '/rent', label: 'Rent', icon: Key },
    { href: '/commercial', label: 'Commercial', icon: Building2 },
    { href: '/sell', label: 'Sell', icon: DollarSign },
    { href: '/agents', label: 'Agents', icon: Users2 },
  ];

  const handleGoogleSignIn = () => {
    window.location.href =
      'mailto:admin@webbheads.in?subject=' +
      encodeURIComponent('Enable Google Sign-In for Webb Heads');
    showToast('Opening admin support for Google sign-in.', 'info');
  };

  const handlePhoneSignIn = () => {
    if (!phoneNumber.trim()) {
      showToast('Enter your phone number first.', 'warning');
      return;
    }

    window.open(
      getWhatsAppLink(
        '+91 83677 43555',
        `Hi, I want to sign in to Webb Heads with my phone number: ${phoneNumber}. Please help me with access.`
      ),
      '_blank',
      'noopener,noreferrer'
    );
    showToast('Opening WhatsApp for phone sign-in help.', 'success');
  };

  return (
    <>
      <nav className="fixed z-50 top-4 left-0 right-0 mx-auto max-w-7xl bg-white/80 backdrop-blur-md shadow-md rounded-full border border-white/20">
        <div className="px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
              <Link href="/" className="flex items-center group">
                <span className="text-2xl font-serif font-bold text-blue-950">
                  Webb Heads
                </span>
              </Link>

              <div className="hidden md:flex space-x-1 items-center">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className="group flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-950 transition-all duration-300 font-medium rounded-lg hover:bg-gray-100"
                  >
                    <item.icon size={18} className="text-gray-500 group-hover:text-amber-500 transition-colors" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="hidden md:flex items-center space-x-3">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => router.push('/search')}
                  aria-label="Open property search"
                  className="text-gray-600 hover:text-blue-950 hover:bg-gray-100 p-2 rounded-lg transition-all duration-300"
                >
                  <Search size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignInOpen(true)}
                  aria-label="Open sign in help"
                  className="text-gray-600 hover:text-blue-950 hover:bg-gray-100 p-2 rounded-lg transition-all duration-300"
                >
                  <User size={20} />
                </button>
                <Link href="/saved" aria-label="Go to saved properties" className="text-gray-600 hover:text-blue-950 hover:bg-gray-100 p-2 rounded-lg transition-all duration-300">
                  <Heart size={20} />
                </Link>
                <Button
                  type="button"
                  onClick={() => router.push('/sell')}
                  variant="accent"
                  className="font-bold"
                >
                  List Property
                </Button>
              </div>

              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-600 hover:text-blue-950 p-2"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-950 hover:bg-gray-100 rounded-lg transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={20} className="text-gray-500" />
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-2 px-3">
                <ThemeToggle mobile />
                <Button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsSignInOpen(true);
                  }}
                  className="w-full bg-blue-950 hover:bg-blue-900 text-white"
                >
                  Sign In
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/saved');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Saved Properties
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/sell');
                  }}
                  variant="accent"
                  className="w-full font-bold"
                >
                  List Property
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {isSignInOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
                  Account Access
                </p>
                <h2 className="text-2xl font-serif font-bold text-blue-950">Sign In</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Choose a basic sign-in method to continue.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSignInOpen(false)}
                aria-label="Close sign in help"
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-950"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 text-left transition-colors hover:border-blue-950 hover:bg-blue-50"
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white font-semibold text-blue-950 shadow-sm">
                    G
                  </span>
                  <span>
                    <span className="block font-semibold text-blue-950">Continue with Google</span>
                    <span className="block text-sm text-gray-600">Use your Google account</span>
                  </span>
                </span>
                <span className="text-sm font-medium text-amber-600">Continue</span>
              </button>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-950 shadow-sm">
                    <Phone size={18} />
                  </span>
                  <div>
                    <span className="block font-semibold text-blue-950">Continue with Phone Number</span>
                    <span className="block text-sm text-gray-600">Enter your phone number</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
                  />
                  <Button type="button" onClick={handlePhoneSignIn} className="sm:min-w-44">
                    Continue
                  </Button>
                </div>
              </div>

            </div>

            <div className="mt-5 flex justify-end">
              <Button type="button" variant="outline" onClick={() => setIsSignInOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
