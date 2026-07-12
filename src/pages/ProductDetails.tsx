import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowLeft, Star, CheckCircle, AlertTriangle, CreditCard, ZoomIn, ZoomOut, Maximize2, X, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

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

  // Hover Zoom State
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transform: 'scale(1)',
    transformOrigin: 'center'
  });
  const [isZoomed, setIsZoomed] = useState(false);

  // Lightbox Modal Zoom & Pan States
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Mouse move handler for primary hover pan-zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: 'scale(2.2)',
      transformOrigin: `${x}% ${y}%`
    });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center'
    });
  };

  // Lightbox Drag Handlers
  const handleLightboxMouseDown = (e: React.MouseEvent) => {
    if (lightboxScale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - lightboxPan.x, y: e.clientY - lightboxPan.y });
  };

  const handleLightboxMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setLightboxPan({ x: newX, y: newY });
  };

  const handleLightboxMouseUp = () => {
    setIsDragging(false);
  };

  const changeLightboxImage = (idx: number) => {
    if (!selectedProduct) return;
    const total = selectedProduct.images.length;
    const nextIdx = (idx + total) % total;
    setActiveImageIdx(nextIdx);
    setLightboxScale(1);
    setLightboxPan({ x: 0, y: 0 });
  };

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
          className={`flex items-center gap-1.5 text-zinc-400 transition-colors text-xs font-bold tracking-widest uppercase mb-8 ${
            p.category === 'islamic' ? 'hover:text-emerald-400' : 'hover:text-amber-500'
          }`}
          id="btn-back-to-shop"
        >
          <ArrowLeft size={16} />
          {currentLanguage === 'bn' ? 'শপে ফিরে যান' : 'Back to Shop'}
        </button>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start mb-20" id="product-details-grid">
          
          {/* Left Panel: Image Gallery */}
          <div className="space-y-4" id="details-image-panel">
            {/* Primary Main Image with Hover Zoom & Click to Lightbox */}
            <div 
              className="aspect-square rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 shadow-xl shadow-black relative cursor-zoom-in group" 
              id="main-image-box"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={p.images[activeImageIdx]}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-75 ease-out select-none"
                style={zoomStyle}
                referrerPolicy="no-referrer"
                id="main-details-image"
              />
              
              {/* Discount Badge */}
              {p.discountPrice && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded pointer-events-none z-10">
                  {p.discountBadge || (currentLanguage === 'bn' ? 'বিশেষ অফার' : 'OFFER')}
                </span>
              )}

              {/* Hover Overlay Hint */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <span className="text-[10px] uppercase tracking-wider text-zinc-300 font-medium">
                  {currentLanguage === 'bn' ? 'মাউস ঘুরিয়ে জুম করুন • ক্লিক করে বড় করুন' : 'Hover to Zoom • Click to Expand'}
                </span>
                <div className="bg-black/60 p-1.5 rounded border border-zinc-800">
                  <Maximize2 size={12} className={p.category === 'islamic' ? 'text-emerald-400' : 'text-amber-500'} />
                </div>
              </div>
              
              {/* Corner Zoom Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className={`absolute top-4 right-4 bg-black/60 hover:bg-black/90 p-2 rounded-full border border-zinc-800/80 text-zinc-300 transition-colors z-10 ${
                  p.category === 'islamic' ? 'hover:text-emerald-400' : 'hover:text-amber-500'
                }`}
                title={currentLanguage === 'bn' ? 'পূর্ণ স্ক্রিন' : 'Fullscreen Gallery'}
                id="btn-details-expand-gallery"
              >
                <ZoomIn size={16} />
              </button>
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
                        ? p.category === 'islamic'
                          ? 'border-emerald-500 scale-102 ring-1 ring-emerald-500'
                          : 'border-amber-500 scale-102 ring-1 ring-amber-500' 
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
              <span className={`text-xs font-semibold uppercase tracking-widest font-mono border px-2.5 py-1 rounded ${
                p.category === 'islamic'
                  ? 'text-emerald-400 bg-emerald-950/25 border-emerald-500/20'
                  : 'text-amber-500 bg-amber-500/5 border-amber-500/10'
              }`}>
                {p.category === 'attar' && (currentLanguage === 'bn' ? 'আতর' : 'ATTAR')}
                {p.category === 'sunglasses' && (currentLanguage === 'bn' ? 'সানগ্লাস' : 'SUNGLASSES')}
                {p.category === 'accessories' && (currentLanguage === 'bn' ? 'আনুষঙ্গিক' : 'ACCESSORIES')}
                {p.category === 'islamic' && (currentLanguage === 'bn' ? 'ইসলামিক' : 'ISLAMIC')}
              </span>

              <div className={`flex items-center gap-1 text-xs font-mono ${p.category === 'islamic' ? 'text-emerald-400' : 'text-amber-500'}`} id="details-rating">
                <div className={`flex items-center ${p.category === 'islamic' ? 'text-emerald-400' : 'text-amber-500'}`}>
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
            <div className={`bg-zinc-950 border p-5 rounded-lg flex items-center justify-between ${
              p.category === 'islamic' ? 'border-emerald-500/15' : 'border-zinc-900'
            }`} id="details-price-box">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 mb-1">
                  {currentLanguage === 'bn' ? 'মূল্য' : 'Price'}
                </span>
                <div className="flex items-baseline gap-2.5">
                  {p.discountPrice ? (
                    <>
                      <span className={`text-xl sm:text-2xl font-bold font-mono ${
                        p.category === 'islamic' ? 'text-emerald-400' : 'text-amber-500'
                      }`}>
                        ৳{currentPrice.toLocaleString('bn-BD')}
                      </span>
                      <span className="text-xs sm:text-sm text-zinc-500 line-through font-mono">
                        ৳{originalPrice.toLocaleString('bn-BD')}
                      </span>
                    </>
                  ) : (
                    <span className={`text-xl sm:text-2xl font-bold font-mono ${
                      p.category === 'islamic' ? 'text-emerald-400' : 'text-amber-500'
                    }`}>
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
                            ? p.category === 'islamic'
                              ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-md shadow-emerald-500/15'
                              : 'bg-amber-500 text-black border-amber-500 font-bold shadow-md shadow-amber-500/15'
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
                    className={`px-3 py-1.5 transition-colors ${
                      p.category === 'islamic' ? 'hover:text-emerald-400' : 'hover:text-amber-500'
                    }`}
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
                    className={`px-3 py-1.5 transition-colors ${
                      p.category === 'islamic' ? 'hover:text-emerald-400' : 'hover:text-amber-500'
                    }`}
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
                      ? p.category === 'islamic'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-amber-500 text-black border-amber-500' 
                      : p.category === 'islamic'
                        ? 'bg-zinc-900 text-emerald-400 border-zinc-800 hover:border-emerald-500/30'
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
                    : p.category === 'islamic'
                      ? 'bg-zinc-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white active:scale-98'
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
                    : p.category === 'islamic'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-98 shadow-lg shadow-emerald-500/10'
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

      {/* Premium Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 md:p-6 select-none"
          id="product-lightbox-modal"
        >
          {/* Top Bar */}
          <div className="w-full flex justify-between items-center border-b border-zinc-900 pb-3" id="lightbox-top-bar">
            <div className="flex flex-col">
              <span className={`text-[10px] uppercase tracking-widest font-bold ${p.category === 'islamic' ? 'text-emerald-400' : 'text-amber-500'}`}>
                {currentLanguage === 'bn' ? 'প্রিমিয়াম জুমিং ভিউ' : 'Premium Zoom Viewer'}
              </span>
              <h2 className="text-sm font-bold text-zinc-100 font-serif leading-tight">
                {name} <span className="text-xs font-sans text-zinc-500 font-normal">({activeImageIdx + 1}/{p.images.length})</span>
              </h2>
            </div>
            
            {/* Gallery Control Tools */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-zinc-400">
                <button
                  onClick={() => {
                    setLightboxScale(prev => Math.min(4, prev + 0.5));
                  }}
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  title={currentLanguage === 'bn' ? 'জুম ইন' : 'Zoom In'}
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={() => {
                    setLightboxScale(prev => {
                      const next = prev - 0.5;
                      if (next <= 1) {
                        setLightboxPan({ x: 0, y: 0 });
                        return 1;
                      }
                      return next;
                    });
                  }}
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  disabled={lightboxScale <= 1}
                  title={currentLanguage === 'bn' ? 'জুম আউট' : 'Zoom Out'}
                >
                  <ZoomOut size={16} />
                </button>
                <div className="h-4 w-px bg-zinc-800 mx-1" />
                <button
                  onClick={() => {
                    setLightboxScale(1);
                    setLightboxPan({ x: 0, y: 0 });
                  }}
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors text-[10px] font-bold flex items-center gap-1"
                  disabled={lightboxScale === 1 && lightboxPan.x === 0 && lightboxPan.y === 0}
                  title={currentLanguage === 'bn' ? 'রিসেট' : 'Reset Zoom'}
                >
                  <RotateCcw size={14} />
                  <span>1:1</span>
                </button>
              </div>

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 p-2 rounded-lg transition-all"
                title={currentLanguage === 'bn' ? 'বন্ধ করুন' : 'Close Viewer'}
                id="btn-close-lightbox"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Interactive Image Container */}
          <div 
            className="flex-1 w-full max-w-5xl my-4 relative flex items-center justify-center overflow-hidden rounded-lg bg-zinc-950/40 border border-zinc-900/50"
            id="lightbox-canvas-area"
            onMouseDown={handleLightboxMouseDown}
            onMouseMove={handleLightboxMouseMove}
            onMouseUp={handleLightboxMouseUp}
            onMouseLeave={handleLightboxMouseUp}
          >
            {/* Previous Image Trigger */}
            {p.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  changeLightboxImage(activeImageIdx - 1);
                }}
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/90 text-zinc-300 border border-zinc-800/80 p-2.5 rounded-full transition-all ${
                  p.category === 'islamic' ? 'hover:text-emerald-400' : 'hover:text-amber-500'
                }`}
                title={currentLanguage === 'bn' ? 'পূর্ববর্তী ছবি' : 'Previous Image'}
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Main Interactive Zoomable Image */}
            <div 
              className={`transition-all duration-100 select-none ${lightboxScale > 1 ? 'cursor-move' : 'cursor-zoom-in'}`}
              style={{
                transform: `translate(${lightboxPan.x}px, ${lightboxPan.y}px) scale(${lightboxScale})`,
                transformOrigin: 'center center',
              }}
              onClick={() => {
                if (lightboxScale === 1) {
                  setLightboxScale(2);
                } else {
                  setLightboxScale(1);
                  setLightboxPan({ x: 0, y: 0 });
                }
              }}
            >
              <img
                src={p.images[activeImageIdx]}
                alt={name}
                className="max-h-[70vh] max-w-[85vw] object-contain rounded pointer-events-none select-none shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Next Image Trigger */}
            {p.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  changeLightboxImage(activeImageIdx + 1);
                }}
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/90 text-zinc-300 border border-zinc-800/80 p-2.5 rounded-full transition-all ${
                  p.category === 'islamic' ? 'hover:text-emerald-400' : 'hover:text-amber-500'
                }`}
                title={currentLanguage === 'bn' ? 'পরবর্তী ছবি' : 'Next Image'}
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* Mini Toast Info inside Lightbox */}
            {lightboxScale > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 border border-zinc-800 px-3 py-1.5 rounded-full text-[10px] text-zinc-400 font-sans tracking-wide pointer-events-none">
                {currentLanguage === 'bn' ? 'ছবিটি সরাতে মাউস দিয়ে ড্র্যাগ করুন' : 'Drag with mouse to pan around'}
              </div>
            )}
          </div>

          {/* Bottom Bar: Thumbnail Quick-Select */}
          <div className="w-full flex flex-col items-center gap-3 border-t border-zinc-900 pt-3" id="lightbox-bottom-bar">
            {p.images.length > 1 && (
              <div className="flex gap-2 justify-center max-w-full overflow-x-auto pb-1" id="lightbox-thumbnails">
                {p.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => changeLightboxImage(idx)}
                    className={`w-14 h-14 rounded overflow-hidden bg-zinc-900 border transition-all ${
                      activeImageIdx === idx 
                        ? p.category === 'islamic'
                          ? 'border-emerald-500 scale-102 ring-1 ring-emerald-500'
                          : 'border-amber-500 scale-102 ring-1 ring-amber-500' 
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <img src={img} alt={`${name} thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
            <div className="text-[10px] text-zinc-500 text-center font-sans">
              {currentLanguage === 'bn' 
                ? 'ভিউপোর্ট বন্ধ করতে Esc চাপুন অথবা উপরে বন্ধ বোতামে ক্লিক করুন' 
                : 'Press Esc to close • Double-click/tap to toggle 2x zoom'}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
