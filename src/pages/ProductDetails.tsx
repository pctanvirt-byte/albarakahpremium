import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowLeft, Star, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { 
    currentLanguage, 
    selectedProduct, 
    setCurrentPage, 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return selectedProduct?.sizeOrVolume?.[0] || 'Standard';
  });
  const [quantity, setQuantity] = useState<number>(1);

  if (!selectedProduct) {
    return (
      <div className="bg-black text-white min-h-[70vh] flex flex-col items-center justify-center p-6" id="empty-details-view">
        <AlertTriangle size={48} className="text-amber-500 mb-4" />
        <p className="text-sm text-zinc-400 mb-6 text-center">
          {currentLanguage === 'bn' 
            ? 'কোনো পণ্য নির্বাচন করা হয়নি।' 
            : 'No product selected. Please select a product from the shop.'}
        </p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-amber-500 text-black px-6 py-2.5 rounded font-bold text-xs uppercase tracking-widest"
          id="btn-empty-details-back-shop"
        >
          {currentLanguage === 'bn' ? 'শপে ফিরে যান' : 'Go to Shop'}
        </button>
      </div>
    );
  }

  const p = selectedProduct;
  const isWished = isInWishlist(p.id);
  const name = p.nameTrans[currentLanguage] || p.name;
  const description = p.descriptionTrans[currentLanguage] || p.description;
  const originalPrice = p.price;
  const currentPrice = p.discountPrice || p.price;
  const savings = p.discountPrice ? p.price - p.discountPrice : 0;

  // Add to cart action
  const handleAddToCart = () => {
    addToCart(p, quantity, selectedSize);
  };

  // Buy now action: add to cart and immediately go to checkout
  const handleBuyNow = () => {
    addToCart(p, quantity, selectedSize);
    setCurrentPage('checkout');
  };

  // Filter similar products
  const similarProducts = products
    .filter((item) => item.category === p.category && item.id !== p.id)
    .slice(0, 4);

  return (
    <div className="bg-black text-white min-h-screen py-10" id={`product-details-${p.id}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={() => setCurrentPage('shop')}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-500 transition-colors text-xs font-bold tracking-widest uppercase mb-8"
          id="btn-back-to-shop"
        >
          <ArrowLeft size={16} />
          {currentLanguage === 'bn' ? 'শপে ফিরে যান' : 'Back to Shop'}
        </button>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start mb-20" id="product-details-grid">
          
          {/* Left Panel: Image Gallery */}
          <div className="space-y-4" id="details-image-panel">
            {/* Primary Main Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 shadow-xl shadow-black relative" id="main-image-box">
              <img
                src={p.images[activeImageIdx]}
                alt={name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                id="main-details-image"
              />
              {p.discountPrice && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded">
                  {p.discountBadge || (currentLanguage === 'bn' ? 'বিশেষ অফার' : 'OFFER')}
                </span>
              )}
            </div>

            {/* Thumbnail Indicators */}
            {p.images.length > 1 && (
              <div className="flex gap-3" id="image-thumbnails-box">
                {p.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 aspect-square rounded overflow-hidden bg-zinc-900 border transition-all ${
                      activeImageIdx === idx 
                        ? 'border-amber-500 scale-102 ring-1 ring-amber-500' 
                        : 'border-zinc-800 hover:border-zinc-500'
                    }`}
                    id={`thumb-btn-${idx}`}
                  >
                    <img src={img} alt={`${name} ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Content Info */}
          <div className="flex flex-col gap-6" id="details-content-panel">
            
            {/* Category & Ratings */}
            <div className="flex items-center justify-between" id="details-meta-row">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-500 font-mono bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded">
                {p.category === 'attar' && (currentLanguage === 'bn' ? 'আতর' : 'ATTAR')}
                {p.category === 'sunglasses' && (currentLanguage === 'bn' ? 'সানগ্লাস' : 'SUNGLASSES')}
                {p.category === 'accessories' && (currentLanguage === 'bn' ? 'আনুষঙ্গিক' : 'ACCESSORIES')}
                {p.category === 'islamic' && (currentLanguage === 'bn' ? 'ইসলামিক' : 'ISLAMIC')}
              </span>

              <div className="flex items-center gap-1 text-amber-500 text-xs font-mono" id="details-rating">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < Math.floor(p.rating) ? "currentColor" : "none"} 
                      className="shrink-0"
                    />
                  ))}
                </div>
                <span className="font-bold text-sm text-white ml-1">{p.rating.toFixed(1)}</span>
                <span className="text-zinc-500">({p.reviewsCount} {currentLanguage === 'bn' ? 'রিভিউ' : 'reviews'})</span>
              </div>
            </div>

            {/* Title */}
            <div id="details-title-box">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                {name}
              </h1>
              {p.notes && (
                <p className="text-zinc-500 text-xs sm:text-sm italic mt-2">
                  {p.notes}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-lg flex items-center justify-between" id="details-price-box">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 mb-1">
                  {currentLanguage === 'bn' ? 'মূল্য' : 'Price'}
                </span>
                <div className="flex items-baseline gap-2.5">
                  {p.discountPrice ? (
                    <>
                      <span className="text-xl sm:text-2xl font-bold text-amber-500 font-mono">
                        ৳{currentPrice.toLocaleString('bn-BD')}
                      </span>
                      <span className="text-xs sm:text-sm text-zinc-500 line-through font-mono">
                        ৳{originalPrice.toLocaleString('bn-BD')}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold text-amber-500 font-mono">
                      ৳{originalPrice.toLocaleString('bn-BD')}
                    </span>
                  )}
                </div>
              </div>

              {savings > 0 && (
                <div className="bg-rose-950/40 border border-rose-500/20 text-rose-400 font-bold text-xs px-3 py-1.5 rounded" id="details-savings">
                  {currentLanguage === 'bn' 
                    ? `৳${savings.toLocaleString('bn-BD')} সাশ্রয়!` 
                    : `Save ৳${savings.toLocaleString('en-US')}!`}
                </div>
              )}
            </div>

            {/* Stock status & Sizes */}
            <div className="space-y-4" id="details-config-box">
              
              {/* Stock info */}
              <div className="flex items-center gap-2 text-xs font-semibold" id="stock-status">
                {p.stock > 0 ? (
                  <>
                    <CheckCircle size={16} className="text-emerald-500" />
                    <span className="text-emerald-500">
                      {currentLanguage === 'bn' 
                        ? `স্টকে আছে (${p.stock.toLocaleString('bn-BD')} টি অবশিষ্ট)` 
                        : `In Stock (${p.stock} items left)`}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={16} className="text-rose-500 animate-pulse" />
                    <span className="text-rose-500">
                      {currentLanguage === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
                    </span>
                  </>
                )}
              </div>

              {/* Sizes / Volume selection */}
              {p.sizeOrVolume && p.sizeOrVolume.length > 0 && (
                <div className="space-y-2" id="size-selection-row">
                  <span className="text-xs text-zinc-400 font-semibold block uppercase tracking-wider">
                    {p.category === 'attar' 
                      ? (currentLanguage === 'bn' ? 'পরিমাণ নির্বাচন করুন' : 'Select Volume') 
                      : (currentLanguage === 'bn' ? 'সাইজ' : 'Select Size')}
                  </span>
                  <div className="flex flex-wrap gap-2.5" id="size-buttons-group">
                    {p.sizeOrVolume.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 text-xs font-semibold rounded border transition-all ${
                          selectedSize === sz
                            ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-md shadow-amber-500/15'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-500'
                        }`}
                        id={`size-btn-${sz}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector & Wishlist */}
            <div className="flex items-center gap-4 py-4 border-t border-b border-zinc-900" id="quantity-action-row">
              <div className="flex flex-col gap-1.5" id="qty-box">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">
                  {currentLanguage === 'bn' ? 'সংখ্যা' : 'QTY'}
                </span>
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 hover:text-amber-500 transition-colors"
                    disabled={p.stock <= 0}
                    id="btn-qty-dec"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold font-mono text-white select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((prev) => Math.min(p.stock, prev + 1))}
                    className="px-3 py-1.5 hover:text-amber-500 transition-colors"
                    disabled={p.stock <= 0 || quantity >= p.stock}
                    id="btn-qty-inc"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Wishlist toggle */}
              <div className="flex flex-col gap-1.5 ml-auto" id="wishlist-box">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block text-right">
                  {currentLanguage === 'bn' ? 'পছন্দ' : 'WISHLIST'}
                </span>
                <button
                  onClick={() => toggleWishlist(p)}
                  className={`p-2.5 rounded border transition-all ${
                    isWished 
                      ? 'bg-amber-500 text-black border-amber-500' 
                      : 'bg-zinc-900 text-amber-500 border-zinc-800 hover:border-amber-500/30'
                  }`}
                  id="btn-details-wishlist"
                >
                  <Heart size={16} fill={isWished ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Main CTA buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2" id="action-buttons">
              <button
                onClick={handleAddToCart}
                disabled={p.stock <= 0}
                className={`w-full py-4 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  p.stock <= 0
                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'bg-zinc-900 border border-amber-500/40 text-amber-500 hover:bg-amber-500 hover:text-black active:scale-98'
                }`}
                id="btn-add-to-cart-details"
              >
                <ShoppingBag size={14} />
                {currentLanguage === 'bn' ? 'কার্টে যুক্ত করুন' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={p.stock <= 0}
                className={`w-full py-4 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  p.stock <= 0
                    ? 'bg-zinc-900 border border-zinc-850 text-zinc-600 cursor-not-allowed'
                    : 'bg-amber-500 text-black hover:bg-amber-400 active:scale-98 shadow-lg shadow-amber-500/10'
                }`}
                id="btn-buy-now-details"
              >
                <CreditCard size={14} />
                {currentLanguage === 'bn' ? 'সরাসরি কিনুন' : 'Buy It Now'}
              </button>
            </div>

            {/* Description Text */}
            <div className="mt-4 border-t border-zinc-900 pt-6" id="details-desc-box">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-2">
                {currentLanguage === 'bn' ? 'পণ্যের বিবরণ' : 'Product Description'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {description}
              </p>
            </div>

          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <section className="border-t border-zinc-900 pt-16 mb-10" id="similar-products-section">
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-white mb-8 text-center md:text-left">
              {currentLanguage === 'bn' ? 'সংশ্লিষ্ট অন্যান্য পণ্য' : 'Similar Premium Products'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" id="similar-grid">
              {similarProducts.map((sim) => (
                <ProductCard key={sim.id} product={sim} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
