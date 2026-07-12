import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ShoppingBag, ArrowLeft, ShieldAlert, CreditCard, HelpCircle } from 'lucide-react';
import { Order } from '../types';

export const Checkout: React.FC = () => {
  const { 
    currentLanguage, 
    cart, 
    placeOrder, 
    currentUser, 
    setCurrentPage 
  } = useApp();

  // Checkout inputs
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [area, setArea] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('cod');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Form states
  const [formError, setFormError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Math helper
  const subtotal = cart.reduce((total, item) => {
    const actualPrice = item.product.discountPrice || item.product.price;
    return total + actualPrice * item.quantity;
  }, 0);

  const deliveryCharge = area === 'inside_dhaka' ? 80 : 150;
  const grandTotal = subtotal + deliveryCharge;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!customerName.trim()) {
      setFormError(currentLanguage === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your name.');
      return;
    }
    if (!phone.trim() || phone.length < 11) {
      setFormError(currentLanguage === 'bn' ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন।' : 'Please enter a valid 11-digit phone number.');
      return;
    }
    if (!address.trim()) {
      setFormError(currentLanguage === 'bn' ? 'অনুগ্রহ করে ডেলিভারি ঠিকানা লিখুন।' : 'Please enter your shipping address.');
      return;
    }

    // Payment validation (if online)
    if (paymentMethod !== 'cod') {
      if (!paymentNumber.trim()) {
        setFormError(currentLanguage === 'bn' ? 'অনুগ্রহ করে পেমেন্ট প্রেরক নম্বরটি লিখুন।' : 'Please enter the payment sender number.');
        return;
      }
      if (!transactionId.trim()) {
        setFormError(currentLanguage === 'bn' ? 'অনুগ্রহ করে ট্রানজেকশন আইডি (TrxID) লিখুন।' : 'Please enter the Transaction ID (TrxID).');
        return;
      }
    }

    // Place the order
    try {
      const order = placeOrder({
        customerName,
        phone,
        email: email || undefined,
        address,
        area,
        paymentMethod,
        paymentNumber: paymentMethod !== 'cod' ? paymentNumber : undefined,
        transactionId: paymentMethod !== 'cod' ? transactionId : undefined
      });
      setPlacedOrder(order);
    } catch (err) {
      setFormError(currentLanguage === 'bn' ? 'অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে।' : 'An error occurred while placing your order.');
    }
  };

  // SUCCESS STATE VIEW
  if (placedOrder) {
    return (
      <div className="bg-black text-white min-h-screen py-16 px-4" id="checkout-success-view">
        <div className="max-w-2xl mx-auto bg-zinc-950 border border-amber-500/30 rounded-xl p-8 text-center space-y-6 shadow-2xl shadow-black">
          
          <div className="flex justify-center" id="success-icon">
            <CheckCircle2 size={64} className="text-amber-500 animate-bounce" />
          </div>

          <div id="success-message">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              {currentLanguage === 'bn' ? 'শুকরান! অর্ডারটি সফল হয়েছে' : 'Shukran! Order Placed Successfully'}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm">
              {currentLanguage === 'bn'
                ? 'আল বারাকাহ প্রিমিয়াম থেকে পণ্য ক্রয়ের জন্য আপনাকে ধন্যবাদ।'
                : 'Thank you for shopping with Al Barakah Premium.'}
            </p>
          </div>

          {/* Order Details card */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg text-left space-y-4" id="success-order-card">
            <div className="flex justify-between border-b border-zinc-800 pb-3 text-xs sm:text-sm font-semibold text-zinc-300" id="success-meta">
              <span>
                {currentLanguage === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'}{' '}
                <strong className="text-amber-500 font-mono">{placedOrder.id}</strong>
              </span>
              <span>
                {currentLanguage === 'bn' ? 'তারিখ:' : 'Date:'}{' '}
                <span className="font-mono">{new Date(placedOrder.createdAt).toLocaleDateString()}</span>
              </span>
            </div>

            {/* Purchased list */}
            <div className="space-y-2.5 text-xs" id="success-items-list">
              {placedOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-zinc-400">
                  <span className="truncate max-w-[250px]">
                    {item.productName}{' '}
                    {item.selectedSize && <span className="text-[10px] text-amber-500 font-mono">({item.selectedSize})</span>}{' '}
                    <strong className="text-white font-mono">x{item.quantity}</strong>
                  </span>
                  <span className="font-mono text-zinc-300">৳{(item.price * item.quantity).toLocaleString('bn-BD')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-3 space-y-2 text-xs text-zinc-400" id="success-breakdown">
              <div className="flex justify-between items-center">
                <span>{currentLanguage === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-mono">৳{placedOrder.subtotal.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{currentLanguage === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
                <span className="font-mono">৳{placedOrder.deliveryCharge.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-800 pt-2.5 text-sm font-semibold text-white">
                <span className="text-amber-500 font-serif">
                  {currentLanguage === 'bn' ? 'পরিশোধিত মূল্য' : 'Grand Total'}
                </span>
                <span className="text-amber-500 font-mono">৳{placedOrder.total.toLocaleString('bn-BD')}</span>
              </div>
            </div>

            <div className="bg-zinc-950 p-3 rounded text-[11px] text-zinc-500 space-y-1" id="success-billing">
              <p><strong>{currentLanguage === 'bn' ? 'প্রাপক:' : 'Shipping To:'}</strong> {placedOrder.customerName} ({placedOrder.phone})</p>
              <p><strong>{currentLanguage === 'bn' ? 'ঠিকানা:' : 'Address:'}</strong> {placedOrder.address}</p>
              <p>
                <strong>{currentLanguage === 'bn' ? 'পেমেন্ট পদ্ধতি:' : 'Payment Method:'}</strong>{' '}
                <span className="uppercase text-amber-500/80 font-semibold">{placedOrder.paymentMethod}</span>
              </p>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded text-xs text-zinc-300 leading-relaxed text-left" id="success-next-steps">
            <p>
              {currentLanguage === 'bn'
                ? '📣 পরবর্তী ধাপ: আমাদের প্রতিনিধি আগামী ২৪ ঘণ্টার মধ্যে আপনার মোবাইলে কল করে অর্ডারটি নিশ্চিত (Confirm) করবেন। কোনো তথ্য পরিবর্তনের প্রয়োজন হলে আমাদের হেল্পলাইনে যোগাযোগ করুন।'
                : '📣 Next Step: Our support representative will call you within 24 hours to confirm your order. If you need any corrections, please call our support hotline.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4" id="success-actions">
            <button
              onClick={() => setCurrentPage('shop')}
              className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-amber-500 font-bold text-xs uppercase tracking-wider rounded border border-zinc-800"
              id="btn-success-shop"
            >
              {currentLanguage === 'bn' ? 'আরো কেনাকাটা করুন' : 'Continue Shopping'}
            </button>
            <button
              onClick={() => setCurrentPage('user-dashboard')}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded shadow-md shadow-amber-500/10"
              id="btn-success-history"
            >
              {currentLanguage === 'bn' ? 'অর্ডার হিস্টোরি দেখুন' : 'View Order History'}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // EMPTY CHECKOUT REDIRECT
  if (cart.length === 0) {
    return (
      <div className="bg-black text-white min-h-[70vh] flex flex-col items-center justify-center p-6" id="empty-checkout">
        <ShieldAlert size={48} className="text-amber-500 mb-4" />
        <p className="text-sm text-zinc-400 mb-6 text-center">
          {currentLanguage === 'bn' 
            ? 'আপনার শপিং কার্ট খালি থাকায় চেকআউট করা সম্ভব নয়।' 
            : 'Your cart is empty. You cannot proceed to checkout.'}
        </p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-amber-500 text-black px-6 py-2.5 rounded font-bold text-xs uppercase tracking-widest"
          id="btn-empty-checkout-shop"
        >
          {currentLanguage === 'bn' ? 'পণ্য পছন্দ করুন' : 'Explore Shop'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen py-10" id="checkout-page-view">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back link */}
        <button
          onClick={() => setCurrentPage('cart')}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-500 transition-colors text-xs font-bold tracking-widest uppercase mb-8"
          id="btn-back-to-cart"
        >
          <ArrowLeft size={16} />
          {currentLanguage === 'bn' ? 'কার্টে ফিরে যান' : 'Back to Cart'}
        </button>

        <h1 className="font-serif text-3xl font-bold tracking-wide border-b border-zinc-900 pb-5 mb-10">
          {currentLanguage === 'bn' ? 'অর্ডার চেকআউট' : 'Checkout Order'}
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-5 gap-10" id="checkout-form">
          
          {/* Left Columns (3 cols): Shipping Info & Payment */}
          <div className="lg:col-span-3 space-y-8" id="checkout-left-sections">
            
            {/* Delivery address card */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-lg space-y-4" id="shipping-address-card">
              <h3 className="text-sm font-bold tracking-widest uppercase text-amber-500 border-b border-zinc-900 pb-3 flex items-center gap-2">
                <ShoppingBag size={14} />
                {currentLanguage === 'bn' ? '১. ডেলিভারি ও শিপিং তথ্য' : '1. Shipping & Delivery Address'}
              </h3>

              {formError && (
                <div className="bg-rose-950/40 border border-rose-500/20 text-rose-400 p-3 rounded text-xs font-medium flex items-center gap-2">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="billing-inputs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-semibold">
                    {currentLanguage === 'bn' ? 'আপনার নাম *' : 'Your Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={currentLanguage === 'bn' ? 'যেমন: আহমেদ ফারহান' : 'e.g. Ahmed Farhan'}
                    className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/50 font-medium"
                    id="checkout-name-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-semibold">
                    {currentLanguage === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={currentLanguage === 'bn' ? '১১ ডিজিটের সচল নম্বর' : 'e.g. 01700000000'}
                    className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/50 font-mono"
                    id="checkout-phone-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs text-zinc-400 font-semibold">
                    {currentLanguage === 'bn' ? 'ইমেইল অ্যাড্রেস (অপশনাল)' : 'Email Address (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/50"
                    id="checkout-email-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs text-zinc-400 font-semibold">
                    {currentLanguage === 'bn' ? 'সম্পূর্ণ ডেলিভারি ঠিকানা *' : 'Detailed Delivery Address *'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={currentLanguage === 'bn' ? 'গ্রাম/মহল্লা, হাউজ নম্বর, রোড নম্বর, থানা, জেলা...' : 'House, Road, Area, Thana, District...'}
                    className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2 focus:outline-none focus:border-amber-500/50 leading-relaxed"
                    id="checkout-address-textarea"
                  />
                </div>

                {/* Delivery Area Select */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs text-zinc-400 font-semibold">
                    {currentLanguage === 'bn' ? 'ডেলিভারি এরিয়া নির্বাচন করুন' : 'Select Delivery Region'}
                  </label>
                  <div className="grid grid-cols-2 gap-4" id="area-toggles">
                    <button
                      type="button"
                      onClick={() => setArea('inside_dhaka')}
                      className={`px-4 py-3 text-xs font-semibold rounded border text-center transition-all ${
                        area === 'inside_dhaka'
                          ? 'bg-amber-500 text-black border-amber-500 font-bold'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                      id="btn-area-inside"
                    >
                      {currentLanguage === 'bn' ? 'ঢাকার ভেতরে (৳৮০)' : 'Inside Dhaka (৳80)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setArea('outside_dhaka')}
                      className={`px-4 py-3 text-xs font-semibold rounded border text-center transition-all ${
                        area === 'outside_dhaka'
                          ? 'bg-amber-500 text-black border-amber-500 font-bold'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                      id="btn-area-outside"
                    >
                      {currentLanguage === 'bn' ? 'ঢাকার বাইরে (৳১৫০)' : 'Outside Dhaka (৳150)'}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-lg space-y-5" id="payment-method-card">
              <h3 className="text-sm font-bold tracking-widest uppercase text-amber-500 border-b border-zinc-900 pb-3 flex items-center gap-2">
                <CreditCard size={14} />
                {currentLanguage === 'bn' ? '২. পেমেন্ট পদ্ধতি নির্বাচন' : '2. Select Payment Method'}
              </h3>

              {/* Payment Select Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" id="payment-grid-options">
                {[
                  { id: 'cod', label: { bn: 'ক্যাশ অন ডেলিভারি', en: 'Cash on Delivery' }, color: 'border-zinc-800' },
                  { id: 'bkash', label: { bn: 'বিকাশ (bKash)', en: 'bKash' }, color: 'border-pink-500/20 text-pink-400' },
                  { id: 'nagad', label: { bn: 'নগদ (Nagad)', en: 'Nagad' }, color: 'border-orange-500/20 text-orange-400' },
                  { id: 'rocket', label: { bn: 'রকেট (Rocket)', en: 'Rocket' }, color: 'border-violet-500/20 text-violet-400' },
                  { id: 'bank', label: { bn: 'ব্যাংক ট্রান্সফার', en: 'Bank Transfer' }, color: 'border-emerald-500/20 text-emerald-400' }
                ].map((pay) => (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => setPaymentMethod(pay.id as any)}
                    className={`px-3 py-3 text-xs font-semibold rounded border transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                      paymentMethod === pay.id
                        ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-md'
                        : `bg-zinc-900 ${pay.color} hover:border-zinc-600`
                    }`}
                    id={`pay-method-btn-${pay.id}`}
                  >
                    <span className="text-[11px] font-bold">{pay.label[currentLanguage]}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic instruction panel depending on selected payment method */}
              {paymentMethod !== 'cod' && (
                <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-md space-y-4" id="payment-instructions">
                  
                  <div className="flex gap-2 text-xs text-amber-500 font-medium items-start" id="instruction-title-row">
                    <HelpCircle size={15} className="shrink-0 mt-0.5" />
                    <span>
                      {paymentMethod === 'bank' ? (
                        currentLanguage === 'bn' 
                          ? 'ব্যাংক পেমেন্ট নির্দেশাবলী:' 
                          : 'Bank Payment Instructions:'
                      ) : (
                        currentLanguage === 'bn'
                          ? `আমাদের মার্চেন্ট একাউন্টে পেমেন্ট করার নির্দেশাবলী:`
                          : `Merchant Payment Instructions:`
                      )}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-400 leading-relaxed space-y-2" id="instruction-body">
                    {paymentMethod === 'bank' ? (
                      <>
                        <p><strong>{currentLanguage === 'bn' ? 'ব্যাংক নাম:' : 'Bank Name:'}</strong> City Bank PLC</p>
                        <p><strong>{currentLanguage === 'bn' ? 'হিসাব নাম:' : 'Account Name:'}</strong> Al Barakah Premium Ltd.</p>
                        <p><strong>{currentLanguage === 'bn' ? 'হিসাব নম্বর:' : 'Account Number:'}</strong> 1202345678001</p>
                        <p><strong>{currentLanguage === 'bn' ? 'শাখা ও রাউটিং:' : 'Branch & Routing:'}</strong> Tongi Branch, Routing: 225261114</p>
                      </>
                    ) : (
                      <>
                        <p>
                          {currentLanguage === 'bn' ? '১. আপনার ' : '1. Open your '}
                          <strong className="text-white uppercase font-mono">{paymentMethod}</strong>
                          {currentLanguage === 'bn' ? ' অ্যাপে যান অথবা ডায়াল করুন।' : ' app or dial USSD.'}
                        </p>
                        <p>
                          {currentLanguage === 'bn' ? '২. মার্চেন্ট নম্বর ' : '2. Choose "Make Payment" to Merchant number '}
                          <strong className="text-white font-mono">01316534171</strong>
                          {currentLanguage === 'bn' ? ' এ সর্বমোট টাকা পরিশোধ করুন।' : ' and pay the total bill.'}
                        </p>
                        <p>
                          {currentLanguage === 'bn' 
                            ? '৩. সফলভাবে পেমেন্ট করার পর নিচের দুটি ফিল্ডে আপনার প্রেরক নম্বর এবং ট্রানজেকশন আইডি প্রদান করুন।'
                            : '3. After successful payment, provide your sender phone number and the Transaction ID (TrxID) below.'}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Payment validation input fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2" id="payment-verification-inputs">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-zinc-400 font-semibold">
                        {currentLanguage === 'bn' 
                          ? `${paymentMethod === 'bank' ? 'হিসাব নম্বর / প্রেরক নাম *' : 'প্রেরক মোবাইল নম্বর *'}` 
                          : `${paymentMethod === 'bank' ? 'Your Account No. / Name *' : 'Sender Phone No. *'}`}
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentNumber}
                        onChange={(e) => setPaymentNumber(e.target.value)}
                        placeholder="01xxxxxxxxx"
                        className="bg-zinc-950 text-xs text-white border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/40 font-mono"
                        id="checkout-pay-number-input"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-zinc-400 font-semibold">
                        {currentLanguage === 'bn' 
                          ? `${paymentMethod === 'bank' ? 'ডিপোজিট স্লিপ নং / রেফারেন্স *' : 'ট্রানজেকশন আইডি (TrxID) *'}` 
                          : `${paymentMethod === 'bank' ? 'Deposit Slip Ref / Ref No *' : 'Transaction ID (TrxID) *'}`}
                      </label>
                      <input
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="8X7Y9Z3W"
                        className="bg-zinc-950 text-xs text-white border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/40 font-mono"
                        id="checkout-pay-trx-input"
                      />
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>

          {/* Right Column (2 cols): Order Summary & Button */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 p-6 rounded-lg h-fit space-y-5 shadow-lg shadow-black" id="checkout-right-sections">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white pb-3 border-b border-zinc-900">
              {currentLanguage === 'bn' ? 'আপনার অর্ডার সামারি' : 'Your Order Summary'}
            </h3>

            {/* List items briefly */}
            <div className="max-h-60 overflow-y-auto divide-y divide-zinc-900 pr-1" id="checkout-summary-items">
              {cart.map((item, idx) => {
                const p = item.product;
                const name = p.nameTrans[currentLanguage] || p.name;
                const price = p.discountPrice || p.price;
                return (
                  <div key={`${p.id}-${idx}`} className="py-3 flex items-center gap-3 text-xs" id={`summary-item-${p.id}`}>
                    <img src={p.images[0]} alt={name} className="w-9 h-9 object-cover rounded" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{name}</p>
                      <p className="text-zinc-500 text-[10px]">
                        {item.selectedSize ? `${item.selectedSize} | ` : ''}
                        {item.quantity} {currentLanguage === 'bn' ? 'পিস' : 'pcs'}
                      </p>
                    </div>
                    <span className="font-mono text-zinc-300">
                      ৳{(price * item.quantity).toLocaleString('bn-BD')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Breakdown costs */}
            <div className="space-y-3 pt-4 border-t border-zinc-900 text-xs" id="checkout-summary-breakdown">
              <div className="flex justify-between text-zinc-400">
                <span>{currentLanguage === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-mono text-white">৳{subtotal.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>{currentLanguage === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
                <span className="font-mono text-white">৳{deliveryCharge.toLocaleString('bn-BD')}</span>
              </div>
              
              <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-sm font-bold" id="checkout-summary-total">
                <span className="text-white font-serif">{currentLanguage === 'bn' ? 'সর্বমোট প্রদেয় বিল' : 'Grand Total'}</span>
                <span className="text-amber-500 font-mono text-base sm:text-lg">৳{grandTotal.toLocaleString('bn-BD')}</span>
              </div>
            </div>

            {/* Trust disclaimer / CTA */}
            <div className="bg-zinc-900/40 p-3 rounded text-[10px] text-zinc-500 leading-normal" id="checkout-security-disclaimer">
              {currentLanguage === 'bn'
                ? '🔒 আল বারাকাহ সিকিউর গেটওয়ে। আপনার তথ্যসমূহ সম্পূর্ণ এনক্রিপ্টেড এবং সুরক্ষিত।'
                : '🔒 Secured by Al Barakah Premium encryption. Your personal details are protected.'}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black rounded font-bold text-xs uppercase tracking-widest transition-all duration-300 active:scale-98 shadow-lg shadow-amber-500/10"
              id="btn-submit-order"
            >
              {currentLanguage === 'bn' ? 'অর্ডার সম্পন্ন করুন' : 'Complete My Order'}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};
