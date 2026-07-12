import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, LogIn, ShoppingBag, Heart, Trash2, MapPin, Phone, Mail, UserCheck, ShieldAlert } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { 
    currentLanguage, 
    currentUser, 
    loginOrRegister, 
    logoutUser, 
    orders, 
    wishlist, 
    toggleWishlist, 
    setCurrentPage, 
    setSelectedProduct 
  } = useApp();

  // Login form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loginError, setLoginError] = useState('');

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!phone.trim() || phone.length < 11) {
      setLoginError(currentLanguage === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন।' : 'Please enter a valid 11-digit mobile number.');
      return;
    }
    if (!name.trim()) {
      setLoginError(currentLanguage === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your name.');
      return;
    }

    loginOrRegister(name, phone, email || undefined, address || undefined);
  };

  // Find user's orders
  const userOrders = orders.filter(
    (o) => o.userId === currentUser?.id || o.phone === currentUser?.phone
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-950 text-amber-400 border border-amber-500/20';
      case 'processing': return 'bg-blue-950 text-blue-400 border border-blue-500/20';
      case 'shipped': return 'bg-indigo-950 text-indigo-400 border border-indigo-500/20';
      case 'delivered': return 'bg-emerald-950 text-emerald-400 border border-emerald-500/20';
      case 'cancelled': return 'bg-rose-950 text-rose-400 border border-rose-500/20';
      default: return 'bg-zinc-800 text-zinc-400';
    }
  };

  const getStatusLabel = (status: string) => {
    if (currentLanguage === 'bn') {
      if (status === 'pending') return 'অপেক্ষমাণ';
      if (status === 'processing') return 'প্রক্রিয়াধীন';
      if (status === 'shipped') return 'শিপড হয়েছে';
      if (status === 'delivered') return 'ডেলিভারি সম্পন্ন';
      if (status === 'cancelled') return 'বাতিল হয়েছে';
    }
    return status.toUpperCase();
  };

  // NOT LOGGED IN VIEW: Elegant Portal login
  if (!currentUser) {
    return (
      <div className="bg-black text-white min-h-screen py-16 px-4" id="portal-login-view">
        <div className="max-w-md mx-auto bg-zinc-950 border border-amber-500/20 rounded-lg p-8 shadow-2xl shadow-black relative overflow-hidden" id="login-container">
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
          
          <div className="text-center space-y-2 mb-8" id="login-header">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-3">
              <LogIn size={22} />
            </div>
            <h1 className="font-serif text-2xl font-bold">
              {currentLanguage === 'bn' ? 'গ্রাহক লগইন ও রেজিস্ট্রেশন' : 'Customer Login / Sign Up'}
            </h1>
            <p className="text-zinc-500 text-xs">
              {currentLanguage === 'bn' 
                ? 'সহজ লগইন করে আপনার অর্ডার ট্র্যাক করুন ও প্রোফাইল আপডেট করুন।' 
                : 'Fast login with phone number to track orders and save address.'}
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-950/40 border border-rose-500/20 text-rose-400 p-3 rounded text-xs mb-5 font-semibold flex items-center gap-2">
              <ShieldAlert size={14} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans" id="login-form">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-semibold">
                {currentLanguage === 'bn' ? 'মোবাইল নম্বর (১১ ডিজিট) *' : 'Mobile Number (11 digits) *'}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/50 font-mono"
                id="login-phone-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-semibold">
                {currentLanguage === 'bn' ? 'আপনার নাম *' : 'Your Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={currentLanguage === 'bn' ? 'যেমন: তানজিম আহমেদ' : 'e.g. Tanjim Ahmed'}
                className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/50 font-medium"
                id="login-name-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-semibold">
                {currentLanguage === 'bn' ? 'ইমেইল অ্যাড্রেস (অপশনাল)' : 'Email Address (Optional)'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/50"
                id="login-email-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-semibold">
                {currentLanguage === 'bn' ? 'ডেলিভারি ঠিকানা (অপশনাল)' : 'Delivery Address (Optional)'}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={currentLanguage === 'bn' ? 'বাসা নং, রোড নং, এলাকা...' : 'House, Road, Area...'}
                className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/50"
                id="login-address-input"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black rounded font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-amber-500/10 active:scale-98 mt-2"
              id="btn-login-submit"
            >
              {currentLanguage === 'bn' ? 'লগইন / রেজিস্টার করুন' : 'Login / Register'}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD VIEW
  return (
    <div className="bg-black text-white min-h-screen py-10" id="user-dashboard-view">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title / Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-5 mb-10 gap-4" id="dashboard-header">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-wide flex items-center gap-2">
              <UserCheck size={28} className="text-amber-500" />
              {currentLanguage === 'bn' ? 'গ্রাহক ড্যাশবোর্ড' : 'Customer Dashboard'}
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">
              {currentLanguage === 'bn' 
                ? `স্বাগতম, ${currentUser.name}! এখান থেকে আপনার অর্ডার হিস্টোরি ও প্রোফাইল তদারকি করুন।` 
                : `Welcome back, ${currentUser.name}! Track orders, manage profile details, or browse your wishlist.`}
            </p>
          </div>

          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:text-rose-500 hover:border-rose-500/30 text-xs font-semibold rounded transition-colors self-start sm:self-center"
            id="btn-dashboard-logout"
          >
            {currentLanguage === 'bn' ? 'লগআউট করুন' : 'Logout Account'}
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="dashboard-grid">
          
          {/* Left Column (1 col): Profile Info & Wishlist summary */}
          <div className="space-y-6" id="dashboard-left-sidebar">
            
            {/* Profile info card */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-lg space-y-4 shadow-lg shadow-black" id="profile-info-card">
              <h3 className="text-xs font-bold tracking-widest uppercase text-amber-500 border-b border-zinc-900 pb-3">
                {currentLanguage === 'bn' ? 'আপনার প্রোফাইল তথ্য' : 'Profile Details'}
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm" id="profile-meta">
                <div className="flex items-center gap-2.5">
                  <User size={14} className="text-zinc-500" />
                  <span><strong>{currentUser.name}</strong></span>
                </div>
                <div className="flex items-center gap-2.5 font-mono">
                  <Phone size={14} className="text-zinc-500" />
                  <span>{currentUser.phone}</span>
                </div>
                {currentUser.email && (
                  <div className="flex items-center gap-2.5">
                    <Mail size={14} className="text-zinc-500" />
                    <span>{currentUser.email}</span>
                  </div>
                )}
                {currentUser.address && (
                  <div className="flex items-start gap-2.5 border-t border-zinc-900 pt-3">
                    <MapPin size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                    <span className="text-zinc-400 text-xs leading-relaxed">{currentUser.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Wishlist quick items card */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-lg space-y-4 shadow-lg shadow-black" id="wishlist-summary-card">
              <h3 className="text-xs font-bold tracking-widest uppercase text-amber-500 border-b border-zinc-900 pb-3 flex items-center justify-between">
                <span>{currentLanguage === 'bn' ? 'পছন্দের তালিকা' : 'My Wishlist'}</span>
                <span className="text-zinc-500 font-mono text-[10px]">
                  {wishlist.length} {currentLanguage === 'bn' ? 'পণ্য' : 'items'}
                </span>
              </h3>

              {wishlist.length > 0 ? (
                <div className="divide-y divide-zinc-900 max-h-72 overflow-y-auto pr-1" id="wishlist-mini-list">
                  {wishlist.map((p) => {
                    const name = p.nameTrans[currentLanguage] || p.name;
                    return (
                      <div key={p.id} className="py-3 flex items-center gap-3 text-xs" id={`wish-mini-${p.id}`}>
                        <img src={p.images[0]} alt={name} className="w-10 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <p 
                            className="font-semibold text-white truncate hover:text-amber-500 cursor-pointer"
                            onClick={() => {
                              setSelectedProduct(p);
                              setCurrentPage('product-details');
                            }}
                          >
                            {name}
                          </p>
                          <p className="text-amber-500 font-bold font-mono mt-0.5">
                            ৳{(p.discountPrice || p.price).toLocaleString('bn-BD')}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleWishlist(p)}
                          className="p-1.5 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/5 rounded transition-all"
                          title="Remove from wishlist"
                          id={`btn-wish-mini-remove-${p.id}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-zinc-500" id="wishlist-empty-dashboard">
                  {currentLanguage === 'bn' ? 'কোনো পণ্য যুক্ত করা হয়নি।' : 'Your wishlist is empty.'}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (2 cols): Orders History list */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 p-6 rounded-lg shadow-lg shadow-black space-y-6" id="dashboard-orders-history">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white pb-3 border-b border-zinc-900">
              {currentLanguage === 'bn' ? 'আপনার অর্ডার হিস্টোরি' : 'Your Order History'}
            </h3>

            {userOrders.length > 0 ? (
              <div className="space-y-6" id="orders-list">
                {userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="border border-zinc-900 rounded-lg p-5 bg-zinc-900/10 space-y-4"
                    id={`order-record-${ord.id}`}
                  >
                    
                    {/* Order Metadata Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-3 gap-2 text-xs" id="order-record-meta">
                      <div className="space-y-1">
                        <p className="text-zinc-400">
                          {currentLanguage === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'}{' '}
                          <strong className="text-white font-mono text-sm">{ord.id}</strong>
                        </p>
                        <p className="text-zinc-500 font-mono text-[10px]">
                          {new Date(ord.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider ${getStatusBadgeClass(ord.status)}`}>
                        {getStatusLabel(ord.status)}
                      </span>
                    </div>

                    {/* Order Purchased items brief */}
                    <div className="space-y-2.5" id="order-record-items">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 text-xs items-center" id="order-record-item-row">
                          <img src={item.image} alt={item.productName} className="w-8 h-8 object-cover rounded" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{item.productName}</p>
                            <p className="text-zinc-500 text-[10px]">
                              {item.selectedSize ? `${item.selectedSize} | ` : ''}
                              {item.quantity} {currentLanguage === 'bn' ? 'পিস' : 'pcs'}
                            </p>
                          </div>
                          <span className="font-mono text-zinc-400 text-xs">
                            ৳{(item.price * item.quantity).toLocaleString('bn-BD')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order cost totals */}
                    <div className="flex justify-between items-center border-t border-zinc-900 pt-3 text-xs" id="order-record-totals">
                      <span className="text-zinc-500">
                        {currentLanguage === 'bn' ? 'পেমেন্ট পদ্ধতি:' : 'Payment:'}{' '}
                        <strong className="uppercase text-amber-500/75">{ord.paymentMethod}</strong>
                      </span>
                      <p className="font-serif text-white text-xs sm:text-sm">
                        {currentLanguage === 'bn' ? 'সর্বমোট প্রদেয় বিল:' : 'Total paid:'}{' '}
                        <strong className="text-amber-500 font-mono text-sm sm:text-base">৳{ord.total.toLocaleString('bn-BD')}</strong>
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-zinc-500 space-y-4" id="orders-empty-view">
                <ShoppingBag size={40} className="text-zinc-700 mx-auto" />
                <p className="text-xs">
                  {currentLanguage === 'bn'
                    ? 'আপনি এখনো কোনো অর্ডার করেননি।'
                    : 'You have not placed any orders yet.'}
                </p>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="bg-zinc-900 border border-zinc-800 text-amber-500 hover:bg-amber-500 hover:text-black transition-colors text-xs font-semibold px-5 py-2.5 rounded"
                  id="btn-orders-empty-shop"
                >
                  {currentLanguage === 'bn' ? 'সংগ্রহ দেখুন' : 'Explore Collections'}
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
