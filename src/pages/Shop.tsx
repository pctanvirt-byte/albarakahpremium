import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, Tag, X } from 'lucide-react';
import { Product } from '../types';
import { IslamicBorder } from '../components/IslamicPattern';

export const Shop: React.FC = () => {
  const { currentLanguage, products } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const saved = sessionStorage.getItem('shop_filter_category');
    if (saved) {
      sessionStorage.removeItem('shop_filter_category');
      return saved;
    }
    return 'all';
  });
  const [sortOption, setSortOption] = useState<string>('popular');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: { bn: 'সব পণ্য', en: 'All Products' } },
    { id: 'attar', label: { bn: 'লাক্সারি আতর', en: 'Luxury Attar' } },
    { id: 'womens', label: { bn: 'মহিলাদের কালেকশন', en: "Women Collection" } },
    { id: 'baby_toys', label: { bn: 'বাচ্চাদের খেলনা', en: 'Baby Toys' } },
    { id: 'watches', label: { bn: 'হাত ঘড়ি', en: 'Wrist Watches' } },
    { id: 'sunglasses', label: { bn: 'সানগ্লাস', en: 'Sunglasses' } },
    { id: 'accessories', label: { bn: 'এক্সেসরিজ', en: 'Accessories' } },
    { id: 'islamic', label: { bn: 'ইসলামিক সামগ্রী', en: 'Islamic Products' } },
    { id: 'organic_fruits', label: { bn: 'অর্গানিক ফ্রুটস', en: 'Organic Fruits' } },
    { id: 'medicine', label: { bn: 'মেডিসিন ও হেলথ', en: 'Medicine & Health' } },
  ];

  const priceFilters = [
    { id: 'all', label: { bn: 'সব দাম', en: 'Any Price' } },
    { id: 'under-1000', label: { bn: '৳১,০০০ এর নিচে', en: 'Under ৳1,000' } },
    { id: '1000-2000', label: { bn: '৳১,০০০ - ৳২,০০০', en: '৳1,000 - ৳2,000' } },
    { id: 'over-2000', label: { bn: '৳২,০০০ এর উপরে', en: 'Over ৳2,000' } },
  ];

  const sortOptions = [
    { id: 'popular', label: { bn: 'জনপ্রিয়তা', en: 'Popularity' } },
    { id: 'price-asc', label: { bn: 'দাম: কম থেকে বেশি', en: 'Price: Low to High' } },
    { id: 'price-desc', label: { bn: 'দাম: বেশি থেকে কম', en: 'Price: High to Low' } },
    { id: 'rating', label: { bn: 'সর্বোচ্চ রেটিং', en: 'Highest Rated' } },
  ];

  // Filtered and Sorted Products memo
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 2. Filter by price option
    if (priceRange !== 'all') {
      result = result.filter((p) => {
        const actualPrice = p.discountPrice || p.price;
        if (priceRange === 'under-1000') return actualPrice < 1000;
        if (priceRange === '1000-2000') return actualPrice >= 1000 && actualPrice <= 2000;
        if (priceRange === 'over-2000') return actualPrice > 2000;
        return true;
      });
    }

    // 3. Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const bnName = p.nameTrans.bn.toLowerCase();
        const enName = p.nameTrans.en.toLowerCase();
        const bnDesc = p.descriptionTrans.bn.toLowerCase();
        const enDesc = p.descriptionTrans.en.toLowerCase();
        return (
          bnName.includes(query) ||
          enName.includes(query) ||
          bnDesc.includes(query) ||
          enDesc.includes(query)
        );
      });
    }

    // 4. Sorting logic
    if (sortOption === 'price-asc') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // 'popular' / bestsellers first, then by review count
      result.sort((a, b) => {
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return b.reviewsCount - a.reviewsCount;
      });
    }

    return result;
  }, [products, selectedCategory, priceRange, searchQuery, sortOption]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setSortOption('popular');
    setSearchQuery('');
  };

  const isFiltered = selectedCategory !== 'all' || priceRange !== 'all' || searchQuery !== '';

  return (
    <div className="bg-black text-white min-h-screen py-10" id="shop-page-view">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title bar */}
        <div className="border-b border-zinc-900 pb-5 mb-8" id="shop-header">
          <h1 className="font-serif text-3xl font-bold tracking-wide">
            {currentLanguage === 'bn' ? 'আমাদের পণ্যসম্ভার' : 'Premium Shop'}
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            {currentLanguage === 'bn' 
              ? 'আল বারাকাহ এর সংগৃহীত খাঁটি হালাল আতর, ট্রেন্ডি সানগ্লাস ও রয়্যাল সামগ্রী।' 
              : 'Explore the pure, alcohol-free Attars, premium sunglasses and Islamic lifestyle accessories.'}
          </p>
        </div>

        {selectedCategory === 'islamic' && <IslamicBorder className="mb-8" />}

        {/* Filters and Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="shop-main-layout">
          
          {/* Left Sidebar (Desktop Filters) */}
          <aside className="hidden lg:block space-y-8" id="shop-sidebar-filters">
            
            {/* Search filter inside sidebar */}
            <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-lg" id="search-filter-box">
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-3 flex items-center gap-2">
                <Search size={14} className="text-amber-500" />
                {currentLanguage === 'bn' ? 'পণ্য খুঁজুন' : 'Search Products'}
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder={currentLanguage === 'bn' ? 'লিখুন...' : 'Type keyword...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 text-xs text-white border border-zinc-800 focus:border-amber-500/40 rounded-md py-2.5 pl-3 pr-8 focus:outline-none"
                  id="sidebar-search-input"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2 top-2.5 text-zinc-500 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Categories filter */}
            <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-lg" id="categories-filter-box">
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-3 flex items-center gap-2">
                <Tag size={14} className="text-amber-500" />
                {currentLanguage === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Categories'}
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 text-xs rounded transition-all duration-150 flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? cat.id === 'islamic'
                          ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/15'
                          : 'bg-amber-500 text-black font-bold'
                        : cat.id === 'islamic'
                          ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/20 font-semibold'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                    id={`sidebar-cat-btn-${cat.id}`}
                  >
                    <span>{cat.label[currentLanguage]}</span>
                    {selectedCategory === cat.id && <span className={`w-1.5 h-1.5 rounded-full ${cat.id === 'islamic' ? 'bg-white' : 'bg-black'}`}></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-lg" id="price-filter-box">
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-3 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-amber-500" />
                {currentLanguage === 'bn' ? 'মূল্য সীমা' : 'Filter by Price'}
              </h3>
              <div className="space-y-1">
                {priceFilters.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPriceRange(p.id)}
                    className={`w-full text-left px-3 py-2 text-xs rounded transition-all duration-150 flex items-center justify-between ${
                      priceRange === p.id
                        ? 'bg-amber-500 text-black font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                    id={`sidebar-price-btn-${p.id}`}
                  >
                    <span>{p.label[currentLanguage]}</span>
                    {priceRange === p.id && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters button */}
            {isFiltered && (
              <button
                onClick={clearAllFilters}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-500 hover:border-rose-500/30 text-xs py-2.5 rounded transition-all"
                id="sidebar-reset-btn"
              >
                {currentLanguage === 'bn' ? 'সব ফিল্টার মুছুন' : 'Clear All Filters'}
              </button>
            )}

          </aside>

          {/* Right Product Grid Column */}
          <main className="lg:col-span-3 space-y-6" id="shop-products-column">
            
            {/* Top Bar (Mobile filters trigger & sorting options) */}
            <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg flex flex-col sm:flex-row gap-4 items-center justify-between" id="shop-sort-row">
              <span className="text-xs text-zinc-500 self-start sm:self-center font-mono">
                {currentLanguage === 'bn' 
                  ? `মোট ${processedProducts.toLocaleString('bn-BD')} টি পণ্য পাওয়া গেছে` 
                  : `Showing ${processedProducts.length} premium products`}
              </span>

              {/* Sorting and category quick filters for mobile */}
              <div className="flex flex-wrap gap-2.5 items-center w-full sm:w-auto justify-end" id="sort-controls-wrapper">
                
                {/* Mobile view quick category filter dropdown */}
                <div className="block lg:hidden w-full sm:w-44" id="mobile-cat-filter-wrapper">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full bg-zinc-900 border text-xs px-3 py-2 rounded focus:outline-none ${
                      selectedCategory === 'islamic'
                        ? 'border-emerald-500/50 text-emerald-400 focus:border-emerald-500'
                        : 'border-zinc-800 text-zinc-300 focus:border-amber-500/50'
                    }`}
                    id="mobile-cat-select"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label[currentLanguage]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile view quick price filter dropdown */}
                <div className="block lg:hidden w-full sm:w-40" id="mobile-price-filter-wrapper">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-amber-500/50"
                    id="mobile-price-select"
                  >
                    {priceFilters.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label[currentLanguage]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Main sort dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto" id="sort-select-box">
                  <ArrowUpDown size={14} className="text-amber-500 shrink-0" />
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full sm:w-48 bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-amber-500/50 font-medium"
                    id="sort-select"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label[currentLanguage]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile filter reset button */}
                {isFiltered && (
                  <button
                    onClick={clearAllFilters}
                    className="lg:hidden bg-zinc-900 p-2 text-zinc-400 hover:text-rose-500 rounded border border-zinc-800"
                    title="Reset Filters"
                    id="mobile-reset-btn"
                  >
                    <X size={14} />
                  </button>
                )}

              </div>
            </div>

            {/* Products grid */}
            {processedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6" id="shop-grid">
                {processedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-zinc-950 border border-zinc-900 p-16 text-center rounded-lg" id="no-products-view">
                <SlidersHorizontal size={40} className="text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-serif font-bold text-white mb-2">
                  {currentLanguage === 'bn' ? 'কোনো পণ্য খুঁজে পাওয়া যায়নি' : 'No products matched'}
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
                  {currentLanguage === 'bn'
                    ? 'আপনার সার্চ কুয়েরি অথবা সিলেক্ট করা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।'
                    : 'Try checking your spelling, selecting a different category, or resetting your filter preferences.'}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-amber-500 text-black font-bold text-xs px-6 py-2.5 rounded hover:bg-amber-400 transition-colors"
                  id="no-products-reset-btn"
                >
                  {currentLanguage === 'bn' ? 'সব ফিল্টার মুছুন' : 'Reset All Filters'}
                </button>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
