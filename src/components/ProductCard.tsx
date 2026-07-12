import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    currentLanguage, 
    toggleWishlist, 
    isInWishlist, 
    addToCart, 
    setCurrentPage, 
    setSelectedProduct 
  } = useApp();

  const isWished = isInWishlist(product.id);
  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  const handleViewDetails = () => {
    setSelectedProduct(product);
    setCurrentPage('product-details');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.sizeOrVolume?.[0] || 'Standard');
  };

  const name = product.nameTrans[currentLanguage] || product.name;
  const originalPrice = product.price;
  const currentPrice = product.discountPrice || product.price;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-zinc-950 border border-amber-500/20 hover:border-amber-500/60 shadow-lg shadow-black/50 transition-all duration-300"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div 
        className="relative aspect-square w-full overflow-hidden bg-zinc-900 cursor-pointer"
        onClick={handleViewDetails}
        id={`product-image-container-${product.id}`}
      >
        <img
          src={product.images[0]}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          referrerPolicy="no-referrer"
          id={`product-img-${product.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="flex items-center gap-1.5 bg-amber-500 text-black px-4 py-2 rounded font-semibold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-transform"
            id={`btn-view-${product.id}`}
          >
            <Eye size={14} />
            {currentLanguage === 'bn' ? 'বিস্তারিত দেখুন' : 'Quick View'}
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
            isWished 
              ? 'bg-amber-500 text-black' 
              : 'bg-black/50 text-amber-500/80 hover:bg-amber-500 hover:text-black'
          }`}
          aria-label="Wishlist"
          id={`btn-wishlist-${product.id}`}
        >
          <Heart size={16} fill={isWished ? "currentColor" : "none"} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5" id={`badges-container-${product.id}`}>
          {product.isBestSeller && (
            <span className="bg-amber-500 text-black text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded shadow-sm shadow-amber-500/10">
              {currentLanguage === 'bn' ? 'সেরা বিক্রি' : 'BESTSELLER'}
            </span>
          )}
          {product.discountPrice && (
            <span className="bg-rose-600 text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded shadow-sm">
              {currentLanguage === 'bn' ? `${product.discountBadge || 'ছাড়'}` : `${discountPercent}% OFF`}
            </span>
          )}
        </div>
      </div>

      {/* Content details */}
      <div className="flex flex-col flex-1 p-4" id={`product-info-${product.id}`}>
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-1.5" id={`product-meta-${product.id}`}>
          <span className="text-[10px] tracking-widest text-amber-500/70 font-semibold uppercase font-mono">
            {product.category === 'attar' && (currentLanguage === 'bn' ? 'আতর' : 'ATTAR')}
            {product.category === 'sunglasses' && (currentLanguage === 'bn' ? 'সানগ্লাস' : 'SUNGLASSES')}
            {product.category === 'accessories' && (currentLanguage === 'bn' ? 'আনুষঙ্গিক' : 'ACCESSORIES')}
            {product.category === 'islamic' && (currentLanguage === 'bn' ? 'ইসলামিক' : 'ISLAMIC')}
          </span>
          <div className="flex items-center gap-1 bg-zinc-900 px-1.5 py-0.5 rounded text-amber-500 text-[11px]" id={`rating-${product.id}`}>
            <Star size={10} fill="currentColor" />
            <span className="font-semibold font-mono">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          className="text-white font-medium text-sm md:text-base line-clamp-1 group-hover:text-amber-500 transition-colors duration-200 mb-2 cursor-pointer"
          onClick={handleViewDetails}
          id={`title-${product.id}`}
        >
          {name}
        </h3>

        {/* Subtitle notes if attar / sunglasses */}
        {product.notes && (
          <p className="text-[11px] text-zinc-500 line-clamp-1 mb-3 italic" id={`notes-${product.id}`}>
            {product.notes}
          </p>
        )}

        {/* Price & Buy Button Row */}
        <div className="mt-auto flex items-end justify-between pt-2 border-t border-zinc-900" id={`price-action-${product.id}`}>
          <div className="flex flex-col" id={`price-box-${product.id}`}>
            {product.discountPrice ? (
              <>
                <span className="text-[11px] text-zinc-500 line-through font-mono">
                  ৳{originalPrice.toLocaleString('bn-BD')}
                </span>
                <span className="text-amber-500 font-bold text-base md:text-lg font-mono">
                  ৳{currentPrice.toLocaleString('bn-BD')}
                </span>
              </>
            ) : (
              <span className="text-amber-500 font-bold text-base md:text-lg font-mono">
                ৳{originalPrice.toLocaleString('bn-BD')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2 rounded transition-all duration-300 ${
              product.stock <= 0
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-zinc-900 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black hover:border-amber-500 active:scale-95'
            }`}
            title={product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            id={`btn-cart-${product.id}`}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
