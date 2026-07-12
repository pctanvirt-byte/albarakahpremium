import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';

export const Cart: React.FC = () => {
  const { 
    currentLanguage, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    setCurrentPage 
  } = useApp();

  const handleQtyChange = (productId: string, currentQty: number, action: 'inc' | 'dec', size?: string) => {
    const nextQty = action === 'inc' ? currentQty + 1 : currentQty - 1;
    updateCartQuantity(productId, nextQty, size);
  };

  // Calculate Subtotal
  const subtotal = cart.reduce((total, item) => {
    const actualPrice = item.product.discountPrice || item.product.price;
    return total + actualPrice * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="bg-black text-white min-h-[70vh] flex flex-col items-center justify-center px-4" id="empty-cart-view">
        <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-full text-amber-500 mb-5 shadow-inner" id="cart-icon-wrapper">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-xl font-serif font-bold mb-2">
          {currentLanguage === 'bn' ? 'আপনার কার্টটি খালি!' : 'Your Cart is Empty'}
        </h2>
        <p className="text-xs text-zinc-500 mb-6 text-center max-w-sm leading-relaxed">
          {currentLanguage === 'bn'
            ? 'এখনই আমাদের আভিজাত্যপূর্ণ শপ ভিজিট করুন এবং আপনার পছন্দের আতর বা সানগ্লাসটি কার্টে যুক্ত করুন।'
            : 'Explore our luxury collections and add premium alcohol-free attars or sunglasses to your shopping cart.'}
        </p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-amber-500 text-black px-8 py-3 rounded font-bold text-xs uppercase tracking-widest hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/15"
          id="btn-cart-shop"
        >
          {currentLanguage === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen py-10" id="cart-page-view">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-zinc-900 pb-5 mb-10" id="cart-header">
          <h1 className="font-serif text-3xl font-bold tracking-wide">
            {currentLanguage === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            {currentLanguage === 'bn' 
              ? 'নিচের পণ্যগুলো আপনার শপিং কার্টে যুক্ত করা হয়েছে।' 
              : 'Review your selected luxury products before heading to secure checkout.'}
          </p>
        </div>

        {/* Multi-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" id="cart-layout">
          
          {/* Left Column: Cart Items list */}
          <div className="lg:col-span-2 space-y-4" id="cart-items-list">
            {cart.map((item, idx) => {
              const p = item.product;
              const name = p.nameTrans[currentLanguage] || p.name;
              const unitPrice = p.discountPrice || p.price;
              const totalItemPrice = unitPrice * item.quantity;

              return (
                <div
                  key={`${p.id}-${item.selectedSize || idx}`}
                  className="flex flex-col sm:flex-row gap-4 bg-zinc-950 border border-zinc-900 p-4 rounded-lg items-center relative shadow-md shadow-black"
                  id={`cart-item-row-${p.id}`}
                >
                  {/* Item Image */}
                  <div className="w-20 h-20 rounded bg-zinc-900 overflow-hidden shrink-0" id={`cart-item-image-${p.id}`}>
                    <img src={p.images[0]} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>

                  {/* Product Metadata */}
                  <div className="flex-1 min-w-0 text-center sm:text-left" id={`cart-item-details-${p.id}`}>
                    <h3 className="text-sm font-semibold text-white truncate hover:text-amber-500 transition-colors cursor-pointer" onClick={() => {
                      setCurrentPage('product-details');
                    }}>
                      {name}
                    </h3>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-1 text-xs" id={`cart-item-meta-${p.id}`}>
                      {item.selectedSize && (
                        <span className="text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 text-[10px] font-semibold font-mono">
                          {item.selectedSize}
                        </span>
                      )}
                      <span className="text-zinc-500 font-mono">
                        ৳{unitPrice.toLocaleString('bn-BD')} / {currentLanguage === 'bn' ? 'পিস' : 'pcs'}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded shrink-0" id={`cart-item-qty-${p.id}`}>
                    <button
                      onClick={() => handleQtyChange(p.id, item.quantity, 'dec', item.selectedSize)}
                      className="px-2.5 py-1 text-zinc-400 hover:text-amber-500 transition-colors"
                      id={`cart-qty-dec-${p.id}`}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-2.5 py-0.5 text-xs font-bold font-mono text-white min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQtyChange(p.id, item.quantity, 'inc', item.selectedSize)}
                      className="px-2.5 py-1 text-zinc-400 hover:text-amber-500 transition-colors"
                      id={`cart-qty-inc-${p.id}`}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Price Total Column */}
                  <div className="text-center sm:text-right shrink-0 min-w-[80px]" id={`cart-item-total-${p.id}`}>
                    <span className="text-amber-500 font-bold font-mono text-sm sm:text-base">
                      ৳{totalItemPrice.toLocaleString('bn-BD')}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(p.id, item.selectedSize)}
                    className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto p-2 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/5 rounded transition-all shrink-0"
                    title="Remove Item"
                    id={`cart-item-delete-${p.id}`}
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              );
            })}

            {/* Back to shop navigation */}
            <button
              onClick={() => setCurrentPage('shop')}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-500 transition-colors font-bold tracking-widest uppercase py-3"
              id="btn-back-to-shop-from-cart"
            >
              <ArrowLeft size={14} />
              {currentLanguage === 'bn' ? 'আরো পণ্য কিনুন' : 'Continue Shopping'}
            </button>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-lg space-y-5 shadow-lg shadow-black" id="cart-summary-card">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white pb-3 border-b border-zinc-900 flex items-center justify-between">
              <span>{currentLanguage === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'}</span>
              <span className="text-zinc-500 font-mono text-xs font-medium">
                {cart.length} {currentLanguage === 'bn' ? 'আইটেম' : 'items'}
              </span>
            </h3>

            {/* Price Calculations */}
            <div className="space-y-3.5 text-xs" id="summary-breakdown">
              <div className="flex justify-between items-center text-zinc-400">
                <span>{currentLanguage === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-mono text-white font-semibold">
                  ৳{subtotal.toLocaleString('bn-BD')}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>{currentLanguage === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
                <span className="text-amber-500 font-bold">
                  {currentLanguage === 'bn' ? 'চেকআউটে হিসাব করা হবে' : 'Calculated at checkout'}
                </span>
              </div>
              
              <div className="pt-4 border-t border-zinc-900 flex justify-between items-center" id="summary-total-row">
                <span className="text-white font-serif font-bold text-sm">
                  {currentLanguage === 'bn' ? 'সর্বমোট মূল্য' : 'Grand Total'}
                </span>
                <span className="text-amber-500 font-mono font-bold text-lg">
                  ৳{subtotal.toLocaleString('bn-BD')}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setCurrentPage('checkout')}
              className="group w-full py-4 bg-amber-500 hover:bg-amber-400 text-black rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-98 shadow-lg shadow-amber-500/10"
              id="btn-proceed-to-checkout"
            >
              {currentLanguage === 'bn' ? 'চেকআউট করুন' : 'Proceed to Checkout'}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Simple Delivery Trust Banner */}
            <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
              {currentLanguage === 'bn'
                ? '* ঢাকার ভেতরে ক্যাশ অন ডেলিভারি হোম সার্ভিস চার্জ ৳৮০, ঢাকার বাইরে ৳১৫০। কোনো হিডেন চার্জ নেই।'
                : '* Cash on Delivery inside Dhaka ৳80, outside Dhaka ৳150. No hidden charges.'}
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};
