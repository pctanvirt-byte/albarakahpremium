import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { IslamicLogo } from './IslamicPattern';
import { 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  Search, 
  Menu, 
  X, 
  Globe, 
  LogOut, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    currentLanguage,
    setLanguage,
    currentPage,
    setCurrentPage,
    cart,
    wishlist,
    currentUser,
    logoutUser,
    products,
    setSelectedProduct,
    adminLoggedIn
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Calculate cart count
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Close search results dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update live search results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = products.filter((p) => {
      const bnName = p.nameTrans.bn.toLowerCase();
      const enName = p.nameTrans.en.toLowerCase();
      const bnDesc = p.descriptionTrans.bn.toLowerCase();
      const enDesc = p.descriptionTrans.en.toLowerCase();
      return (
        bnName.includes(query) ||
        enName.includes(query) ||
        bnDesc.includes(query) ||
        enDesc.includes(query) ||
        p.category.includes(query) ||
        (p.notes && p.notes.toLowerCase().includes(query))
      );
    });
    setSearchResults(filtered);
  }, [searchQuery, products]);

  const handleSearchResultClick = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setSearchQuery('');
    setSearchFocused(false);
    setCurrentPage('product-details');
  };

  const navItems = [
    { id: 'home', label: { bn: 'হোম', en: 'Home' } },
    { id: 'shop', label: { bn: 'শপ / প্রোডাক্টস', en: 'Shop' } },
    { id: 'about', label: { bn: 'আমাদের সম্পর্কে', en: 'About Us' } },
    { id: 'contact', label: { bn: 'যোগাযোগ', en: 'Contact' } },
    { id: 'privacy', label: { bn: 'প্রাইভেসি পলিসি', en: 'Privacy Policy' } },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur-md border-b border-amber-500/20 shadow-lg shadow-black/80" id="main-header">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => setCurrentPage('home')}
            id="brand-logo-container"
          >
            <IslamicLogo size={42} />
            <div className="flex flex-col">
              <span className="text-white font-serif font-semibold text-lg sm:text-xl tracking-wider leading-none">
                AL BARAKAH
              </span>
              <span className="text-amber-500 font-serif text-xs sm:text-sm tracking-widest leading-none font-medium mt-1">
                P R E M I U M
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" id="desktop-navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors rounded ${
                  currentPage === item.id
                    ? 'text-amber-500 bg-zinc-900/40'
                    : 'text-zinc-300 hover:text-amber-400 hover:bg-zinc-900/20'
                }`}
                id={`nav-item-${item.id}`}
              >
                {item.label[currentLanguage]}
              </button>
            ))}
            {adminLoggedIn && (
              <button
                onClick={() => setCurrentPage('admin')}
                className={`px-4 py-2 text-sm font-semibold tracking-wide text-amber-500 flex items-center gap-1.5 transition-colors border border-amber-500/20 rounded bg-amber-500/5 hover:bg-amber-500/10 ${
                  currentPage === 'admin' ? 'bg-amber-500/20 border-amber-500' : ''
                }`}
                id="nav-item-admin-shortcut"
              >
                <ShieldAlert size={14} />
                {currentLanguage === 'bn' ? 'অ্যাডমিন' : 'Admin'}
              </button>
            )}
          </nav>

          {/* Search, Cart, User controls */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 lg:flex-initial justify-end" id="header-controls">
            
            {/* Live Search Input (Desktop) */}
            <div className="relative hidden md:block w-48 lg:w-64" ref={searchRef} id="desktop-search-container">
              <div className="relative">
                <input
                  type="text"
                  placeholder={currentLanguage === 'bn' ? 'পণ্য খুঁজুন...' : 'Search products...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 focus:border-amber-500/50 rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none transition-all duration-300 font-medium"
                  id="desktop-search-input"
                />
                <Search className="absolute left-3 top-2.5 text-zinc-500" size={14} />
              </div>

              {/* Live search dropdown results */}
              <AnimatePresence>
                {searchFocused && searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-72 max-h-96 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl p-2 z-50 divide-y divide-zinc-900"
                    id="search-dropdown-results"
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleSearchResultClick(p)}
                          className="flex items-center gap-3 p-2 hover:bg-zinc-900/60 rounded cursor-pointer transition-colors"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.nameTrans[currentLanguage]}
                            className="w-10 h-10 object-cover rounded"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white font-medium truncate">
                              {p.nameTrans[currentLanguage]}
                            </p>
                            <p className="text-[10px] text-amber-500 font-semibold font-mono">
                              ৳{(p.discountPrice || p.price).toLocaleString('bn-BD')}
                            </p>
                          </div>
                          <ChevronRight size={12} className="text-zinc-600" />
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-zinc-500">
                        {currentLanguage === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(currentLanguage === 'bn' ? 'en' : 'bn')}
              className="p-2 text-zinc-300 hover:text-amber-500 border border-zinc-800/60 hover:border-amber-500/30 rounded-full transition-colors flex items-center gap-1 text-xs font-semibold"
              title={currentLanguage === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
              id="btn-language-toggle"
            >
              <Globe size={14} className="text-amber-500" />
              <span className="font-mono uppercase">{currentLanguage === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setCurrentPage('user-dashboard')}
              className="relative p-2 text-zinc-300 hover:text-amber-500 transition-colors"
              title="Wishlist"
              id="btn-wishlist-indicator"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Bag */}
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 text-zinc-300 hover:text-amber-500 transition-colors"
              title="Cart"
              id="btn-cart-indicator"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Dashboard / Login */}
            {currentUser ? (
              <div className="flex items-center gap-2" id="header-user-info">
                <button
                  onClick={() => setCurrentPage('user-dashboard')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-medium text-white hover:border-amber-500/40 transition-colors"
                  id="btn-dashboard-link"
                >
                  <UserIcon size={12} className="text-amber-500" />
                  <span className="max-w-[80px] truncate">{currentUser.name}</span>
                </button>
                <button
                  onClick={logoutUser}
                  className="p-2 text-zinc-400 hover:text-rose-500 transition-colors rounded-full hover:bg-zinc-900"
                  title="Logout"
                  id="btn-logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('user-dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded transition-colors"
                id="btn-login-trigger"
              >
                <UserIcon size={12} />
                <span className="hidden sm:inline">{currentLanguage === 'bn' ? 'লগইন' : 'Login'}</span>
              </button>
            )}

            {/* Mobile Menu Toggle (Lg Screen Hidden) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-amber-500 lg:hidden"
              id="btn-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>

        {/* Mobile Search Input (Visible only on mobile screen) */}
        <div className="md:hidden pb-4 pt-1" id="mobile-search-bar-row">
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              placeholder={currentLanguage === 'bn' ? 'পণ্য খুঁজুন...' : 'Search products...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="w-full bg-zinc-900 text-white border border-zinc-800 focus:border-amber-500/50 rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none transition-all font-medium"
              id="mobile-search-input"
            />
            <Search className="absolute left-3 top-2.5 text-zinc-500" size={14} />

            {/* Mobile live search dropdown results */}
            <AnimatePresence>
              {searchFocused && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 left-0 top-full mt-2 max-h-72 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl p-2 z-50 divide-y divide-zinc-900"
                  id="mobile-search-results"
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSearchResultClick(p)}
                        className="flex items-center gap-3 p-2 hover:bg-zinc-900/60 rounded cursor-pointer"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.nameTrans[currentLanguage]}
                          className="w-8 h-8 object-cover rounded"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white font-medium truncate">
                            {p.nameTrans[currentLanguage]}
                          </p>
                          <p className="text-[10px] text-amber-500 font-semibold font-mono">
                            ৳{(p.discountPrice || p.price).toLocaleString('bn-BD')}
                          </p>
                        </div>
                        <ChevronRight size={12} className="text-zinc-600" />
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-xs text-zinc-500">
                      {currentLanguage === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-zinc-950 border-t border-zinc-900 overflow-hidden"
            id="mobile-menu-drawer"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded block ${
                    currentPage === item.id
                      ? 'text-amber-500 bg-zinc-900'
                      : 'text-zinc-300 hover:text-amber-400 hover:bg-zinc-900/40'
                  }`}
                  id={`mobile-nav-item-${item.id}`}
                >
                  {item.label[currentLanguage]}
                </button>
              ))}
              {adminLoggedIn && (
                <button
                  onClick={() => {
                    setCurrentPage('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-bold text-amber-500 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 rounded flex items-center gap-2"
                  id="mobile-nav-item-admin"
                >
                  <ShieldAlert size={14} />
                  {currentLanguage === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Dashboard'}
                </button>
              )}
              {currentUser && (
                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between px-4">
                  <span className="text-xs text-zinc-400 font-medium">
                    {currentLanguage === 'bn' ? 'লগইন আছেন:' : 'Logged in as:'}{' '}
                    <strong className="text-white">{currentUser.name}</strong>
                  </span>
                  <button
                    onClick={() => {
                      logoutUser();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-500 font-semibold hover:underline flex items-center gap-1"
                    id="mobile-btn-logout"
                  >
                    <LogOut size={12} />
                    {currentLanguage === 'bn' ? 'লগআউট' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
