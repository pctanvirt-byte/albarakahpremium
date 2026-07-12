import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  Star, 
  Heart, 
  CheckCircle2, 
  AlertCircle, 
  Eye 
} from 'lucide-react';
import { motion } from 'motion/react';

export const Wishlist: React.FC = () => {
  const { 
    currentLanguage, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    currentUser, 
    setCurrentPage, 
    setSelectedProduct 
  } = useApp();

  // Track selected sizes/volumes for each product in wishlist (defaulting to first option or 'Standard')
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  // Track success messages when items are added to cart
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: Product) => {
    const chosenSize = selectedSizes[product.id] || product.sizeOrVolume?.[0] || 'Standard';
    addToCart(product, 1, chosenSize);
    
    // Trigger "Added!" status feedback
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-details');
  };

  return (
    <div className="bg-black text-white min-h-screen py-10" id="wishlist-page-view">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={() => setCurrentPage('shop')}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-500 transition-colors text-xs font-bold tracking-widest uppercase mb-8"
          id="btn-back-to-shop-from-wishlist"
        >
          <ArrowLeft size={16} />
          {currentLanguage === 'bn' ? 'শপে ফিরে যান' : 'Back to Shop'}
        </button>

        {/* Title bar */}
        <div className="border-b border-zinc-900 pb-5 mb-8" id="wishlist-header">
          <h1 className="font-serif text-3xl font-bold tracking-wide flex items-center gap-3">
            <Heart size={28} className="text-amber-500 fill-amber-500 animate-pulse" />
            {currentLanguage === 'bn' ? 'পছন্দের তালিকা' : 'My Wishlist'}
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            {currentLanguage === 'bn' 
              ? 'আপনার পছন্দের খাঁটি আতর, চশমা বা পোশাকগুলো জমিয়ে রাখুন এবং যেকোনো সময় কার্টে যুক্ত করুন।' 
              : 'Save your favorite premium items here and add them to cart anytime.'}
          </p>
        </div>

        {/* Profile Sync Notification Banner */}
        <div className="mb-8" id="wishlist-sync-banner">
          {currentUser ? (
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-3 text-emerald-400 text-xs sm:text-sm">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
              <div>
                <p className="font-semibold">
                  {currentLanguage === 'bn' ? 'প্রোফাইলে সংরক্ষিত আছে' : 'Saved to Profile'}
                </p>
                <p className="text-zinc-400 text-[11px] sm:text-xs mt-0.5">
                  {currentLanguage === 'bn' 
                    ? `আপনার পছন্দের তালিকাটি মোবাইল নম্বর (${currentUser.phone}) দিয়ে সংযুক্ত অ্যাকাউন্টে সংরক্ষিত আছে।` 
                    : `Your wishlist items are synced to your registered profile (${currentUser.phone}).`}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-950/20 border border-amber-500/10 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-500 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-semibold">
                    {currentLanguage === 'bn' ? 'তালিকাটি অ্যাকাউন্টে সংরক্ষণ করুন' : 'Keep Your Wishlist Forever'}
                  </p>
                  <p className="text-zinc-400 text-[11px] sm:text-xs mt-0.5">
                    {currentLanguage === 'bn' 
                      ? 'অ্যাকাউন্ট ছাড়া পণ্য সেভ করছেন। যেকোনো ডিভাইস থেকে পছন্দের তালিকাটি দেখতে লগইন করুন।' 
                      : 'You are using as a guest. Register/Login to access your wishlist from any computer or mobile.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentPage('user-dashboard')}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-4 py-2 rounded shrink-0 transition-all font-sans uppercase tracking-wider"
                id="btn-wishlist-login-shortcut"
              >
                {currentLanguage === 'bn' ? 'লগইন করুন' : 'Login Now'}
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Items List Grid */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="wishlist-items-grid">
            {wishlist.map((p) => {
              const name = p.nameTrans[currentLanguage] || p.name;
              const originalPrice = p.price;
              const currentPrice = p.discountPrice || p.price;
              const isBestSeller = p.isBestSeller;
              const isOut = p.stock <= 0;
              const discountPercent = p.discountPrice 
                ? Math.round(((p.price - p.discountPrice) / p.price) * 100) 
                : 0;

              const activeSize = selectedSizes[p.id] || p.sizeOrVolume?.[0] || '';

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="group relative flex flex-col overflow-hidden rounded-lg bg-zinc-950 border border-zinc-900 hover:border-amber-500/40 shadow-lg shadow-black/60 transition-all duration-300"
                  id={`wishlist-card-${p.id}`}
                >
                  {/* Item Image Stage */}
                  <div 
                    className="relative aspect-square w-full overflow-hidden bg-zinc-900 cursor-pointer"
                    onClick={() => handleProductClick(p)}
                    id={`wishlist-img-box-${p.id}`}
                  >
                    <img 
                      src={p.images[0]} 
                      alt={name} 
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(p);
                        }}
                        className="flex items-center gap-1.5 bg-amber-500 text-black px-4 py-2 rounded font-semibold text-xs tracking-wider uppercase hover:bg-amber-400 active:scale-95 transition-all"
                        id={`btn-wishlist-view-${p.id}`}
                      >
                        <Eye size={13} />
                        {currentLanguage === 'bn' ? 'বিস্তারিত' : 'View Info'}
                      </button>
                    </div>

                    {/* Delete Item (Remove) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p);
                      }}
                      className="absolute top-3 right-3 p-2 bg-black/60 text-zinc-400 hover:text-rose-500 rounded-full hover:bg-black transition-colors shadow-md"
                      title={currentLanguage === 'bn' ? 'তালিকা থেকে মুছুন' : 'Remove from wishlist'}
                      id={`btn-wishlist-remove-${p.id}`}
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* Badge layout */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1" id={`wishlist-badges-${p.id}`}>
                      {isBestSeller && (
                        <span className="bg-amber-500 text-black text-[9px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded">
                          {currentLanguage === 'bn' ? 'সেরা' : 'BEST'}
                        </span>
                      )}
                      {p.discountPrice && (
                        <span className="bg-rose-600 text-white text-[9px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded">
                          {p.discountBadge || `${discountPercent}% OFF`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content / Info Panel */}
                  <div className="flex flex-col flex-1 p-4" id={`wishlist-info-${p.id}`}>
                    <div className="flex items-center justify-between mb-1" id={`wishlist-meta-${p.id}`}>
                      <span className="text-[10px] tracking-wider text-amber-500/60 font-semibold uppercase font-mono">
                        {p.category.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-mono">
                        <Star size={10} fill="currentColor" />
                        <span>{p.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h3 
                      className="text-white font-medium text-sm line-clamp-1 group-hover:text-amber-500 transition-colors duration-150 mb-1.5 cursor-pointer"
                      onClick={() => handleProductClick(p)}
                    >
                      {name}
                    </h3>

                    {/* Price view */}
                    <div className="flex items-baseline gap-1.5 mb-3" id={`wishlist-price-${p.id}`}>
                      {p.discountPrice ? (
                        <>
                          <span className="text-amber-500 font-extrabold text-sm font-mono">
                            ৳{currentPrice.toLocaleString('bn-BD')}
                          </span>
                          <span className="text-[10px] text-zinc-500 line-through font-mono">
                            ৳{originalPrice.toLocaleString('bn-BD')}
                          </span>
                        </>
                      ) : (
                        <span className="text-amber-500 font-extrabold text-sm font-mono">
                          ৳{originalPrice.toLocaleString('bn-BD')}
                        </span>
                      )}
                    </div>

                    {/* Direct Size selection inside Wishlist card */}
                    {p.sizeOrVolume && p.sizeOrVolume.length > 0 && (
                      <div className="space-y-1.5 mb-4 pt-2 border-t border-zinc-900" id={`wishlist-size-selector-${p.id}`}>
                        <span className="text-[10px] text-zinc-500 block uppercase font-medium">
                          {currentLanguage === 'bn' ? 'সাইজ / পরিমাণ নির্ধারণ করুন:' : 'Select Size / Volume:'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {p.sizeOrVolume.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSizeChange(p.id, sz)}
                              className={`text-[10px] font-semibold px-2 py-1 rounded transition-all border ${
                                (activeSize || p.sizeOrVolume?.[0]) === sz
                                  ? 'bg-amber-500 border-amber-500 text-black'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                              }`}
                              id={`wish-sz-btn-${p.id}-${sz}`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stock & Direct Purchase action buttons */}
                    <div className="mt-auto pt-2 border-t border-zinc-900 flex items-center justify-between" id={`wishlist-actions-${p.id}`}>
                      <span className={`text-[10px] font-bold ${isOut ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {isOut 
                          ? (currentLanguage === 'bn' ? 'স্টক শেষ' : 'OUT OF STOCK') 
                          : (currentLanguage === 'bn' ? 'স্টকে আছে' : 'IN STOCK')}
                      </span>

                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={isOut}
                        className={`text-xs font-bold px-3.5 py-2.5 rounded flex items-center gap-1 transition-all ${
                          isOut
                            ? 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                            : addedItems[p.id]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 text-black hover:bg-amber-400 active:scale-95 shadow-md shadow-amber-500/5'
                        }`}
                        id={`btn-wishlist-cart-${p.id}`}
                      >
                        <ShoppingBag size={12} />
                        <span>
                          {addedItems[p.id] 
                            ? (currentLanguage === 'bn' ? 'যোগ হয়েছে!' : 'Added!') 
                            : (currentLanguage === 'bn' ? 'কার্টে রাখুন' : 'Add to Cart')}
                        </span>
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty wishlist state */
          <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900/60 rounded-xl space-y-5" id="wishlist-empty-stage">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-600">
              <Heart size={26} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {currentLanguage === 'bn' ? 'আপনার তালিকাটি খালি' : 'Your Wishlist is Empty'}
              </h3>
              <p className="text-zinc-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                {currentLanguage === 'bn' 
                  ? 'পছন্দের তালিকায় কোনো পণ্য যোগ করা হয়নি। এখনই আমাদের প্রিমিয়াম কালেকশনগুলো ঘুরে দেখুন।' 
                  : 'You haven\'t added any favorites yet. Explore our selection of Attar, sunglasses and Islamic lifestyle products.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('shop')}
              className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider px-6 py-3 rounded shadow-lg shadow-amber-500/10 transition-all font-sans"
              id="btn-wishlist-go-shop"
            >
              {currentLanguage === 'bn' ? 'পণ্যসমূহ ব্রাউজ করুন' : 'Browse Products'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
