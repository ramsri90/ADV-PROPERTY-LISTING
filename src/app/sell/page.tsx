'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload, Home, MapPin, DollarSign, Bed, Bath, Ruler, Calendar, Check, X } from 'lucide-react';
import Image from 'next/image';

export default function SellPropertyPage() {
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: '',
    category: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    yearBuilt: '',
    features: [] as string[],
  });

  const [newFeature, setNewFeature] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setImages([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({ ...formData, images });
    alert('Property listing submitted! (Demo only)');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-slate-950 mb-4">List Your Property</h1>
          <p className="text-xl text-slate-600">
            Fill in the details below to list your property on Webb Heads
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-slate-950 mb-6 flex items-center">
              <Upload className="mr-3 text-amber-500" size={28} />
              Property Images
            </h2>
            
            <div className="mb-6">
              <label className="block w-full">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-amber-500 transition-colors cursor-pointer bg-gray-50 hover:bg-amber-50">
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-slate-600 mb-2">Click to upload property images</p>
                  <p className="text-sm text-gray-400">PNG, JPG, JPEG up to 10MB each</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={img}
                      alt={`Property ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-slate-950 mb-6 flex items-center">
              <Home className="mr-3 text-amber-500" size={28} />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Title*
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Luxury Sea-View Penthouse"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description*
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your property in detail..."
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="inline mr-1" size={16} />
                  Price (₹)*
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 125000000"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Type*
                </label>
                <select
                  required
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                >
                  <option value="">Select Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category*
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                >
                  <option value="">Select Category</option>
                  <option value="house">House</option>
                  <option value="condo">Condo/Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="office">Office</option>
                  <option value="retail">Retail Space</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status*
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                >
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-slate-950 mb-6 flex items-center">
              <MapPin className="mr-3 text-amber-500" size={28} />
              Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address*
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g., Altamount Road"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City*
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g., Mumbai"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State*
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g., Maharashtra"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ZIP Code*
                </label>
                <input
                  type="text"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  placeholder="e.g., 400026"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-slate-950 mb-6 flex items-center">
              <Ruler className="mr-3 text-amber-500" size={28} />
              Property Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Bed className="inline mr-1" size={16} />
                  Bedrooms*
                </label>
                <input
                  type="number"
                  required
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Bath className="inline mr-1" size={16} />
                  Bathrooms*
                </label>
                <input
                  type="number"
                  required
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  placeholder="e.g., 6"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Ruler className="inline mr-1" size={16} />
                  Area (sq ft)*
                </label>
                <input
                  type="number"
                  required
                  value={formData.sqft}
                  onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                  placeholder="e.g., 6500"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline mr-1" size={16} />
                  Year Built*
                </label>
                <input
                  type="number"
                  required
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                  placeholder="e.g., 2024"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Features & Amenities */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-slate-950 mb-6 flex items-center">
              <Check className="mr-3 text-amber-500" size={28} />
              Features & Amenities
            </h2>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature (e.g., Swimming Pool)"
                className="flex-grow px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-950 text-gray-900"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} variant="secondary">
                Add
              </Button>
            </div>

            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Check size={16} className="text-slate-950" />
                    <span className="text-slate-950">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" size="lg" className="px-12">
              Submit Property Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
