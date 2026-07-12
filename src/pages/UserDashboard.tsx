import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  LogIn, 
  ShoppingBag, 
  Heart, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail, 
  UserCheck, 
  ShieldAlert,
  Search,
  Package,
  Truck,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';

// Steps definition for Order status timeline
const trackingSteps = [
  { key: 'pending', labelEn: 'Order Placed', labelBn: 'অর্ডার সম্পন্ন', descEn: 'We have received your order.', descBn: 'আমরা আপনার অর্ডারটি পেয়েছি।' },
  { key: 'processing', labelEn: 'Processing', labelBn: 'প্রক্রিয়াধীন', descEn: 'Your order is being packed & prepared.', descBn: 'আপনার পণ্য প্যাকেজিং ও প্রস্তুত করা হচ্ছে।' },
  { key: 'shipped', labelEn: 'Shipped', labelBn: 'শিপড হয়েছে', descEn: 'On its way to your destination.', descBn: 'ডেলিভারির জন্য পাঠানো হয়েছে।' },
  { key: 'delivered', labelEn: 'Delivered', labelBn: 'ডেলিভারি সম্পন্ন', descEn: 'Delivered successfully!', descBn: 'সফলভাবে ডেলিভারি করা হয়েছে!' }
];

const getStatusStepIndex = (status: string) => {
  switch (status) {
    case 'pending': return 0;
    case 'processing': return 1;
    case 'shipped': return 2;
    case 'delivered': return 3;
    default: return -1;
  }
};

export const UserDashboard: React.FC = () => {
  const { 
    currentLanguage, 
    currentUser, 
    loginOrRegister, 
    loginWithGoogleAuth,
    logoutUser, 
    orders, 
    wishlist, 
    toggleWishlist, 
    setCurrentPage, 
    setSelectedProduct 
  } = useApp();

  // Active Tab for Portal View: 'login' | 'track'
  const [activeTab, setActiveTab] = useState<'login' | 'track'>('login');

  // Login form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loginError, setLoginError] = useState('');

  // Order tracking fields
  const [trackingId, setTrackingId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

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

  // Handle order tracking search
  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const idToSearch = trackingId.trim().toUpperCase();
    const found = orders.find((o) => o.id.toUpperCase() === idToSearch);
    setTrackedOrder(found || null);
  };

  const handleClearTrack = () => {
    setTrackingId('');
    setTrackedOrder(null);
    setHasSearched(false);
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
        <div className={`mx-auto bg-zinc-950 border border-zinc-900 rounded-lg p-6 sm:p-8 shadow-2xl shadow-black relative overflow-hidden transition-all duration-300 ${
          activeTab === 'track' && trackedOrder ? 'max-w-2xl' : 'max-w-md'
        }`} id="login-container">
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>

          {/* TAB SELECTOR */}
          <div className="flex border-b border-zinc-900 mb-6" id="dashboard-portal-tabs">
            <button
              onClick={() => {
                setActiveTab('login');
                handleClearTrack();
              }}
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 text-center ${
                activeTab === 'login'
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
              id="tab-btn-login"
            >
              {currentLanguage === 'bn' ? 'লগইন / রেজিস্টার' : 'Login / Register'}
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'track'
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
              id="tab-btn-track"
            >
              <Search size={14} />
              {currentLanguage === 'bn' ? 'অর্ডার ট্র্যাক' : 'Track Order'}
            </button>
          </div>
          
          {/* ACTIVE TAB: LOGIN / REGISTER */}
          {activeTab === 'login' && (
            <div className="space-y-6">
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

          <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans text-left" id="login-form">
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
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black rounded font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-amber-500/10 active:scale-98 mt-2 cursor-pointer"
              id="btn-login-submit"
            >
              {currentLanguage === 'bn' ? 'লগইন / রেজিস্টার করুন' : 'Login / Register'}
            </button>

            {/* Google Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-900"></div>
              </div>
              <span className="relative bg-zinc-950 px-3 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                {currentLanguage === 'bn' ? 'অথবা' : 'OR'}
              </span>
            </div>

            {/* Google login button */}
            <button
              type="button"
              onClick={loginWithGoogleAuth}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
              id="btn-google-login"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {currentLanguage === 'bn' ? 'গুগল দিয়ে লগইন করুন' : 'Sign in with Google'}
            </button>
          </form>
        </div>
      )}

      {/* ACTIVE TAB: ORDER TRACKING */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          {!trackedOrder ? (
            <div className="space-y-4">
              <div className="text-center space-y-2 mb-2" id="track-header">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-3">
                  <Search size={22} />
                </div>
                <h1 className="font-serif text-2xl font-bold text-center">
                  {currentLanguage === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Order Tracking'}
                </h1>
                <p className="text-zinc-500 text-xs text-center">
                  {currentLanguage === 'bn' 
                    ? 'আপনার অর্ডার আইডি (যেমন: AB-123456) লিখে রিয়েল-টাইম স্ট্যাটাস ট্র্যাক করুন।' 
                    : 'Enter your unique Order ID to track its real-time processing and delivery status.'}
                </p>
              </div>

              <form onSubmit={handleTrackSearch} className="space-y-4 font-sans text-left" id="track-form">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-semibold">
                    {currentLanguage === 'bn' ? 'অর্ডার আইডি *' : 'Order ID *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="AB-123456"
                    className="bg-zinc-900 text-sm text-white border border-zinc-800 rounded px-3 py-3 focus:outline-none focus:border-amber-500/50 uppercase font-mono tracking-widest text-center font-bold"
                    id="track-id-input"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black rounded font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-amber-500/10 active:scale-98 mt-2 cursor-pointer flex items-center justify-center gap-2"
                  id="btn-track-submit"
                >
                  <Search size={14} />
                  <span>{currentLanguage === 'bn' ? 'স্ট্যাটাস দেখুন' : 'Track Order'}</span>
                </button>
              </form>

              {hasSearched && !trackedOrder && (
                <div className="bg-rose-950/30 border border-rose-500/15 p-4 rounded-lg flex items-start gap-2.5 text-rose-400 text-xs text-left animate-fadeIn">
                  <ShieldAlert size={16} className="shrink-0 text-rose-500 mt-0.5" />
                  <div>
                    <p className="font-bold">{currentLanguage === 'bn' ? 'অর্ডারটি পাওয়া যায়নি' : 'Order Not Found'}</p>
                    <p className="text-zinc-500 text-[11px] leading-relaxed mt-0.5">
                      {currentLanguage === 'bn'
                        ? 'অনুগ্রহ করে সঠিক অর্ডার আইডিটি আবার চেক করুন। আইডিটি সাধারণত "AB-" দিয়ে শুরু হয়।'
                        : 'Please check your Order ID spelling and try again. Order IDs typically start with "AB-".'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Tracked Order Details Screen!
            <div className="space-y-6 text-center animate-fadeIn" id="track-results-view">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4" id="track-results-header">
                <button
                  onClick={handleClearTrack}
                  className="text-xs text-zinc-500 hover:text-amber-500 transition-colors flex items-center gap-1 font-semibold cursor-pointer font-sans"
                  id="btn-track-back"
                >
                  <ArrowLeft size={14} />
                  <span>{currentLanguage === 'bn' ? 'পেছনে ফিরুন' : 'Back to Search'}</span>
                </button>
                <span className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono px-3 py-1 rounded font-bold">
                  ID: {trackedOrder.id}
                </span>
              </div>

              {/* Cancelled Banner */}
              {trackedOrder.status === 'cancelled' ? (
                <div className="bg-rose-950/25 border border-rose-500/20 p-5 rounded-lg flex items-start gap-3.5 text-rose-400 text-xs text-left">
                  <XCircle size={20} className="shrink-0 text-rose-500 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">
                      {currentLanguage === 'bn' ? 'অর্ডারটি বাতিল করা হয়েছে' : 'Order Cancelled'}
                    </p>
                    <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                      {currentLanguage === 'bn' 
                        ? 'দুঃখিত, এই অর্ডারটি বাতিল করা হয়েছে। বিস্তারিত তথ্য বা পুনরায় অর্ডার করতে অনুগ্রহ করে আমাদের গ্রাহক সেবায় যোগাযোগ করুন।' 
                        : 'This order has been cancelled. Please contact our support team if you have any questions or require assistance.'}
                    </p>
                  </div>
                </div>
              ) : (
                // PROGRESS TIMELINE
                <div className="space-y-6 text-left">
                  <div>
                    <h3 className="text-xs font-bold tracking-widest text-amber-500 uppercase">
                      {currentLanguage === 'bn' ? 'অর্ডারের সর্বশেষ আপডেট' : 'Live Order Progress'}
                    </h3>
                    <p className="text-zinc-500 text-[10px] font-mono mt-0.5">
                      {currentLanguage === 'bn' ? 'অর্ডার দেওয়ার সময়:' : 'Placed on:'} {new Date(trackedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Timeline List */}
                  <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-zinc-800 pb-4">
                    {trackingSteps.map((step, idx) => {
                      const stepIdx = getStatusStepIndex(trackedOrder.status);
                      const isCompleted = stepIdx >= idx;
                      const isActive = stepIdx === idx;

                      return (
                        <div key={step.key} className="relative pl-10 flex gap-4 text-left animate-fadeIn">
                          {/* Bullet */}
                          <div className={`absolute left-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold shadow-lg shadow-emerald-500/5' 
                              : isActive
                              ? 'bg-amber-500/15 border-amber-500 text-amber-500 font-bold animate-pulse'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                          }`}>
                            {isCompleted ? (
                              <Check size={14} className="stroke-[3]" />
                            ) : step.key === 'pending' ? (
                              <Clock size={14} />
                            ) : step.key === 'processing' ? (
                              <Package size={14} />
                            ) : step.key === 'shipped' ? (
                              <Truck size={14} />
                            ) : (
                              <CheckCircle2 size={14} />
                            )}
                          </div>

                          {/* Text content */}
                          <div className="space-y-0.5">
                            <h4 className={`text-xs font-bold uppercase tracking-wider ${
                              isCompleted ? 'text-emerald-400' : isActive ? 'text-amber-500' : 'text-zinc-500'
                            }`}>
                              {currentLanguage === 'bn' ? step.labelBn : step.labelEn}
                            </h4>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                              {currentLanguage === 'bn' ? step.descBn : step.descEn}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Courier Tracking Status Box */}
              {trackedOrder.courier && (
                <div className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-900 text-left text-xs space-y-2 animate-fadeIn font-sans" id={`courier-track-card-${trackedOrder.id}`}>
                  <div className="flex items-center gap-2">
                    <Truck className="text-amber-500 shrink-0 animate-pulse" size={16} />
                    <span className="text-zinc-400 font-bold uppercase text-[10px]">
                      {currentLanguage === 'bn' ? 'কুরিয়ার শিপমেন্ট বিবরণ' : 'Courier Shipment Details'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-zinc-900/80 pt-2 text-zinc-300">
                    <div>
                      <p className="text-[11px] text-zinc-500 font-semibold">{currentLanguage === 'bn' ? 'শিপিং পার্টনার:' : 'Courier Partner:'}</p>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider inline-block mt-1 ${
                        trackedOrder.courier === 'pathao' 
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {trackedOrder.courier === 'pathao' ? 'Pathao Delivery' : 'Steadfast Courier'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-500 font-semibold">{currentLanguage === 'bn' ? 'ট্র্যাকিং আইডি (Tracking ID):' : 'Tracking Consignment ID:'}</p>
                      <p className="font-mono text-xs text-white font-bold tracking-wide select-all bg-zinc-950 px-2 py-1 border border-zinc-900 mt-1 rounded inline-block">
                        {trackedOrder.courierTrackingId}
                      </p>
                    </div>
                  </div>
                  <div className="bg-zinc-950/50 p-2.5 rounded border border-zinc-900 text-[11px] text-zinc-400 leading-relaxed font-sans">
                    <span className="text-zinc-500 font-semibold">{currentLanguage === 'bn' ? 'বর্তমান স্ট্যাটাস:' : 'Latest Hub Update:'}</span>{' '}
                    <strong className="text-amber-500">{trackedOrder.courierStatus}</strong>
                  </div>
                </div>
              )}

              {/* Customer Information summary */}
              <div className="grid grid-cols-2 gap-4 bg-zinc-900/30 p-4 rounded-lg border border-zinc-900 text-[11px] text-left text-zinc-400 font-sans font-medium">
                <div>
                  <span className="block text-[10px] text-zinc-500 font-bold uppercase">{currentLanguage === 'bn' ? 'গ্রাহকের নাম' : 'Customer'}</span>
                  <span className="font-semibold text-white">{trackedOrder.customerName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 font-bold uppercase">{currentLanguage === 'bn' ? 'মোবাইল নম্বর' : 'Phone'}</span>
                  <span className="font-semibold text-white font-mono">{trackedOrder.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] text-zinc-500 font-bold uppercase">{currentLanguage === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Shipping Address'}</span>
                  <span className="text-zinc-300 leading-relaxed">{trackedOrder.address}</span>
                </div>
              </div>

              {/* Purchased Items summary */}
              <div className="border-t border-zinc-900 pt-5 text-left">
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-3">
                  {currentLanguage === 'bn' ? 'অर्डरকৃত পণ্যসমূহ' : 'Ordered Items'}
                </h4>
                <div className="divide-y divide-zinc-900/60 max-h-44 overflow-y-auto pr-1 text-left">
                  {trackedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex items-center gap-3 text-xs border-b border-zinc-900/20">
                      <img src={item.image} alt={item.productName} className="w-8 h-8 object-cover rounded bg-zinc-900" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{item.productName}</p>
                        <p className="text-zinc-500 text-[10px]">
                          {item.selectedSize ? `${item.selectedSize} | ` : ''}
                          {item.quantity} {currentLanguage === 'bn' ? 'পিস' : 'pcs'}
                        </p>
                      </div>
                      <span className="font-mono text-zinc-400">
                        ৳{(item.price * item.quantity).toLocaleString('bn-BD')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paid total summary */}
              <div className="border-t border-zinc-900 pt-4 flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-semibold uppercase tracking-wider">{currentLanguage === 'bn' ? 'পদ্ধতি:' : 'Payment:'} <strong className="text-zinc-300 font-mono">{trackedOrder.paymentMethod.toUpperCase()}</strong></span>
                <p className="font-bold text-white text-sm font-sans">
                  {currentLanguage === 'bn' ? 'সর্বমোট বিল:' : 'Total Amount:'}{' '}
                  <span className="text-amber-500 font-mono text-base font-bold">৳{trackedOrder.total.toLocaleString('bn-BD')}</span>
                </p>
              </div>

              <button
                onClick={handleClearTrack}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-amber-500 border border-zinc-800 rounded font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer font-sans"
                id="btn-track-reset"
              >
                {currentLanguage === 'bn' ? 'অন্যান্য অর্ডার চেক করুন' : 'Track Another Order'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Admin Login Portal Shortcut (Only show when not showing tracking details) */}
      {(!trackedOrder || activeTab === 'login') && (
        <div className="mt-6 pt-5 border-t border-zinc-900 flex flex-col items-center gap-2.5 text-center" id="admin-shortcut-box">
          <span className="text-zinc-500 text-[11px] font-medium">
            {currentLanguage === 'bn' ? 'আপনি কি স্টোর অ্যাডমিনিস্ট্রেটর?' : 'Are you a Store Administrator?'}
          </span>
          <button
            onClick={() => setCurrentPage('admin')}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-500 hover:text-amber-400 rounded border border-zinc-800 hover:border-amber-500/25 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            id="btn-goto-admin-login"
          >
            <ShieldAlert size={13} />
            <span>
              {currentLanguage === 'bn' ? 'অ্যাডমিন প্যানেল লগইন' : 'Access Admin Portal'}
            </span>
          </button>
        </div>
      )}

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

                    {/* Courier Tracking Status Box */}
                    {ord.courier && (
                      <div className="bg-zinc-900/50 p-3.5 rounded-lg border border-zinc-900 text-xs space-y-2 text-left font-sans" id={`user-order-courier-${ord.id}`}>
                        <div className="flex items-center gap-2">
                          <Truck className="text-amber-500 shrink-0" size={14} />
                          <span className="text-zinc-400 font-bold uppercase text-[9px]">
                            {currentLanguage === 'bn' ? 'কুরিয়ার ডেলিভারি আপডেট' : 'Courier Dispatch Status'}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-zinc-900/80 pt-2 text-zinc-300">
                          <div>
                            <span className="text-[10px] text-zinc-500 font-semibold">{currentLanguage === 'bn' ? 'কুরিয়ার কোম্পানি:' : 'Courier Service:'}</span>
                            <span className={`ml-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              ord.courier === 'pathao' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                            }`}>
                              {ord.courier === 'pathao' ? 'Pathao' : 'Steadfast'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 font-semibold">{currentLanguage === 'bn' ? 'ট্র্যাকিং আইডি:' : 'Tracking Consignment:'}</span>
                            <strong className="ml-2 font-mono text-[11px] text-zinc-100 select-all font-semibold bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900">{ord.courierTrackingId}</strong>
                          </div>
                        </div>
                        <div className="bg-zinc-950/40 p-2 rounded text-[11px] text-zinc-400 leading-normal">
                          <span className="text-zinc-500 font-semibold">{currentLanguage === 'bn' ? 'সর্বশেষ আপডেট:' : 'Status Detail:'}</span>{' '}
                          <strong className="text-amber-500">{ord.courierStatus}</strong>
                        </div>
                      </div>
                    )}

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
