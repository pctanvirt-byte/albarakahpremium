import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ArrowUpRight } from 'lucide-react';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Wishlist } from './pages/Wishlist';
import { AIScentStudio } from './pages/AIScentStudio';

// Page content switcher based on selected state
const AppContent: React.FC = () => {
  const { currentPage, adminLoggedIn, newOrderNotification, setNewOrderNotification, setCurrentPage, currentLanguage } = useApp();

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Auto dismiss real-time toast
  useEffect(() => {
    if (newOrderNotification) {
      const timer = setTimeout(() => {
        setNewOrderNotification(null);
      }, 12000); // 12 seconds auto-dismiss
      return () => clearTimeout(timer);
    }
  }, [newOrderNotification, setNewOrderNotification]);

  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'shop':
        return <Shop />;
      case 'ai-studio':
      case 'ai-scent-studio':
        return <AIScentStudio />;
      case 'product-details':
        return <ProductDetails />;
      case 'cart':
        return <Cart />;
      case 'wishlist':
        return <Wishlist />;
      case 'checkout':
        return <Checkout />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'privacy':
      case 'privacy-policy':
        return <PrivacyPolicy />;
      case 'user-dashboard':
        return <UserDashboard />;
      case 'admin':
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black">
      {/* Premium Header */}
      <Header />

      {/* Main Screen Layout Container */}
      <main className="flex-grow">
        {renderActivePage()}
      </main>

      {/* Premium Footer */}
      <Footer />

      {/* Real-time Order Placement Alert Toast */}
      <AnimatePresence>
        {adminLoggedIn && newOrderNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-zinc-950 border border-amber-500/35 rounded-xl shadow-2xl shadow-amber-500/10 overflow-hidden flex flex-col p-4 md:p-5"
            id="admin-realtime-toast"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold font-sans">
                  {currentLanguage === 'bn' ? 'নতুন অর্ডার!' : 'Real-Time Alert'}
                </span>
              </div>
              <button 
                onClick={() => setNewOrderNotification(null)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <ShoppingBag className="text-amber-500" size={18} />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <h4 className="text-sm font-bold text-zinc-100 font-serif">
                  {currentLanguage === 'bn' ? 'অর্ডার প্রাপ্তি নিশ্চিত!' : 'New Order Received!'}
                </h4>
                <p className="text-xs text-zinc-400">
                  <span className="font-semibold text-zinc-200">ID: {newOrderNotification.id}</span>
                </p>
                <p className="text-[11px] text-zinc-400 truncate font-sans">
                  {newOrderNotification.customerName} • {newOrderNotification.phone}
                </p>
                <p className="text-xs font-bold text-amber-500 mt-1 font-sans">
                  {currentLanguage === 'bn' ? `মোট: ৳${newOrderNotification.total}` : `Total: ${newOrderNotification.total} BDT`}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-end gap-2">
              <button
                onClick={() => setNewOrderNotification(null)}
                className="px-3 py-1.5 text-[11px] font-bold text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {currentLanguage === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
              </button>
              <button
                onClick={() => {
                  setCurrentPage('admin');
                  setNewOrderNotification(null);
                }}
                className="px-3 py-1.5 text-[11px] font-bold text-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded transition-all flex items-center gap-1 shadow-md shadow-amber-500/10"
              >
                <span>{currentLanguage === 'bn' ? 'প্যানেল দেখুন' : 'View Dashboard'}</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
            
            {/* Auto-dismiss progress bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-zinc-900 w-full">
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 12, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
