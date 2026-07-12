import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { IslamicBorder, IslamicGridOverlay, IslamicLogo } from '../components/IslamicPattern';
import { ArrowRight, Flame, Shield, Truck, Award, Star, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const { currentLanguage, setCurrentPage, products, setSelectedProduct } = useApp();

  // Filter best sellers
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  // Default featured products if no bestseller exists
  const displayProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);

  // Reviews data (Custom luxury reviews)
  const reviews = [
    {
      id: 1,
      name: 'আহমেদ তানভীর',
      nameEn: 'Ahmed Tanvir',
      location: 'মিরপুর, ঢাকা',
      locationEn: 'Mirpur, Dhaka',
      rating: 5,
      comment: 'আল-হারামাইন রয়্যাল আম্বার আতরটি আসলেই চমৎকার। এক ফোঁটা ব্যবহারের পর ঘ্রাণ প্রায় ২৪ ঘণ্টা থাকে। অ্যালকোহল মুক্ত হওয়ায় নামাজে নিশ্চিন্তে ব্যবহার করা যায়।',
      commentEn: 'Al-Haramain Royal Amber attar is absolutely wonderful. After using one drop, the scent lasts for almost 24 hours. Because it is alcohol-free, it can be used for prayers without any hesitation.'
    },
    {
      id: 2,
      name: 'ফারহান চৌধুরী',
      nameEn: 'Farhan Chowdhury',
      location: 'চট্টগ্রাম',
      locationEn: 'Chittagong',
      rating: 5,
      comment: 'দুবাই গোল্ড এডিশন সানগ্লাসটি হাতে পেয়ে চমকে গেছি। এর আভিজাত্যপূর্ণ ফিনিশিং এবং পোলারাইজড লেন্সের কার্যকারিতা সত্যিই প্রশংসনীয়। ডেলিভারিও খুব দ্রুত হয়েছে।',
      commentEn: 'I was amazed when I received the Dubai Gold Edition Sunglasses. Its premium finishing and polarized lenses are highly commendable. Fast delivery too.'
    },
    {
      id: 3,
      name: 'মাহমুদুল হাসান',
      nameEn: 'Mahmudul Hasan',
      location: 'সিলেট',
      locationEn: 'Sylhet',
      rating: 5,
      comment: 'কাশ্মীরি উদ প্রিমিয়াম আতরের ঘ্রাণটা এক কথায় স্বর্গীয়। ধোঁয়াটে কাঠের তীব্র সুবাস মনকে প্রশান্ত করে তোলে। সেলারের চমৎকার ব্যবহার ও দ্রুত রেসপন্স ভালো লেগেছে।',
      commentEn: 'The scent of Kashmiri Oud Premium is simply divine. The deep smoky agarwood aroma calms the soul. Highly satisfied with the customer service.'
    }
  ];

  const categories = [
    {
      id: 'attar',
      title: { bn: 'লাক্সারি আতর', en: 'Luxury Attar' },
      tagline: { bn: '১০০% অ্যালকোহল মুক্ত সুবাস', en: '100% Alcohol-Free' },
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'watches',
      title: { bn: 'প্রিমিয়াম হাত ঘড়ি', en: 'Premium Watches' },
      tagline: { bn: 'রয়্যাল আভিজাত্যপূর্ণ ও নিখুঁত ঘড়ি কালেকশন', en: 'Royal & Elegant Wrist Watches' },
      image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'womens',
      title: { bn: 'মহিলাদের কালেকশন', en: "Women Collection" },
      tagline: { bn: 'আবায়া, হিজাব ও মডেস্টি ফ্যাশন', en: 'Premium Dubai Abaya & Chiffon Hijabs' },
      image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'baby_toys',
      title: { bn: 'বাচ্চাদের খেলনা', en: 'Baby Toys' },
      tagline: { bn: 'মনোরম ও শিক্ষণীয় নিরাপদ খেলনা', en: 'Educational & Child-Safe Play Items' },
      image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'sunglasses',
      title: { bn: 'প্রিমিয়াম সানগ্লাস', en: 'Premium Sunglasses' },
      tagline: { bn: 'ইউভি৪০০ রোদ সুরক্ষা', en: 'UV400 Polarized Protection' },
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'accessories',
      title: { bn: 'রয়্যাল এক্সেসরিজ', en: 'Royal Accessories' },
      tagline: { bn: 'আভিজাত্য ও নান্দনিকতা', en: 'Aesthetic Royal Details' },
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'islamic',
      title: { bn: 'ইসলামিক সামগ্রী', en: 'Islamic Products' },
      tagline: { bn: 'আমদানি করা সেরা মানের জায়নামাজ', en: 'Imported Premium Mats' },
      image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'organic_fruits',
      title: { bn: 'অর্গানিক ফ্রুটস', en: 'Organic Fruits' },
      tagline: { bn: '১০০% পুষ্টিকর ও কেমিক্যাল মুক্ত ফল', en: '100% Nutritious & Chemical-Free Fruits' },
      image: 'https://images.unsplash.com/photo-1610832958506-ee5633619144?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'medicine',
      title: { bn: 'মেডিসিন ও হেলথ', en: 'Medicine & Health' },
      tagline: { bn: '১০০% পিউর অর্গানিক ও ভেষজ সাপ্লিমেন্ট', en: '100% Pure Organic & Herbal Wellness' },
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const handleCategoryClick = (catId: string) => {
    sessionStorage.setItem('shop_filter_category', catId);
    setCurrentPage('shop');
  };

  return (
    <div className="bg-black text-white overflow-hidden" id="home-page-view">
      
      {/* 🔷 HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-zinc-950 pt-10 pb-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/10" id="hero-section">
        {/* Decorative Grid Overlay & Light Accents */}
        <IslamicGridOverlay />
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent opacity-60"></div>
        
        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center" id="hero-content-wrapper">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
            id="hero-logo-box"
          >
            <IslamicLogo size={80} className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl font-bold tracking-wider text-white mb-4"
            id="hero-title"
          >
            AL BARAKAH PREMIUM
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-amber-500 font-serif text-xl sm:text-3xl tracking-widest font-medium mb-6"
            id="hero-tagline"
          >
            {currentLanguage === 'bn' ? 'বরকতের সাথে বিশুদ্ধতা' : 'Purity with Blessing'}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed mb-8"
            id="hero-description"
          >
            {currentLanguage === 'bn'
              ? 'প্রিমিয়াম কোয়ালিটি | মহিলাদের পণ্য ও বাচ্চাদের খেলনা | অ্যালকোহল মুক্ত আতর | সানগ্লাস ও ইসলামিক সামগ্রীর সবচেয়ে বিশ্বস্ত রাজকীয় গন্তব্যস্থল।'
              : 'Premium Quality | Modest Womenswear & Safe Baby Toys | Alcohol-Free Attar | Luxury Accessories Delivered Fast across Bangladesh.'}
          </motion.p>

          {/* Quick trust metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs text-amber-500/95 font-semibold uppercase tracking-widest mb-10"
            id="hero-features-list"
          >
            <span className="flex items-center gap-1.5 bg-zinc-900/60 border border-amber-500/10 px-4 py-2 rounded-full backdrop-blur">
              <Award size={14} /> {currentLanguage === 'bn' ? 'প্রিমিয়াম কোয়ালিটি' : 'Premium Quality'}
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/60 border border-amber-500/10 px-4 py-2 rounded-full backdrop-blur">
              <Shield size={14} /> {currentLanguage === 'bn' ? '১০০% বিশুদ্ধ' : '100% Halal & Pure'}
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/60 border border-amber-500/10 px-4 py-2 rounded-full backdrop-blur">
              <Truck size={14} /> {currentLanguage === 'bn' ? 'দ্রুত ডেলিভারি বাংলাদেশ' : 'Fast Delivery Bangladesh'}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            id="hero-cta-box"
          >
            <button
              onClick={() => setCurrentPage('shop')}
              className="group flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded font-bold text-sm tracking-widest uppercase shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 active:scale-95"
              id="hero-shop-now-btn"
            >
              {currentLanguage === 'bn' ? 'সংগ্রহ দেখুন' : 'Explore Collections'}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

        </div>
      </section>

      {/* Islamic Design Border Divider */}
      <IslamicBorder />

      {/* 🔷 FEATURED CATEGORIES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="featured-categories-section">
        <div className="text-center mb-12" id="categories-heading">
          <p className="text-amber-500 font-semibold text-xs tracking-widest uppercase font-mono mb-1">
            {currentLanguage === 'bn' ? 'ক্যাটাগরি' : 'Discover'}
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-bold tracking-wide">
            {currentLanguage === 'bn' ? 'আভিজাত্যপূর্ণ ক্যাটাগরিসমূহ' : 'Featured Categories'}
          </h2>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4 rounded"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8" id="categories-grid">
          {categories.map((cat, idx) => {
            const isIslamic = cat.id === 'islamic';
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => handleCategoryClick(cat.id)}
                className="group flex flex-col items-center cursor-pointer"
                id={`cat-card-${cat.id}`}
              >
                {/* Image Container styled like the soft-rounded luxury cards in the picture */}
                <div className={`w-full aspect-square rounded-[2rem] bg-zinc-900/60 border p-1 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-lg relative ${
                  isIslamic 
                    ? 'border-emerald-500/25 group-hover:border-emerald-500/55 group-hover:shadow-emerald-500/10 group-hover:bg-emerald-950/20' 
                    : 'border-zinc-800/80 group-hover:border-amber-500/35 group-hover:shadow-amber-500/5 group-hover:bg-zinc-900/90'
                }`}>
                  <img
                    src={cat.image}
                    alt={cat.title[currentLanguage]}
                    className="w-full h-full object-cover rounded-[1.85rem] transition-transform duration-500 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  {isIslamic && (
                    <span className="absolute top-3.5 right-3.5 bg-emerald-600/95 text-white text-[8px] font-bold tracking-widest px-2 py-0.5 rounded-full border border-emerald-400/40 z-10 shadow-lg shadow-black/80">
                      {currentLanguage === "bn" ? "পবিত্র" : "SACRED"}
                    </span>
                  )}
                </div>
                
                {/* Label underneath, matching the clean centered title/price styling */}
                <div className="mt-4 text-center px-1">
                  <h3 className={`font-serif font-bold text-sm sm:text-base transition-colors tracking-wide leading-tight ${
                    isIslamic 
                      ? 'text-emerald-400 group-hover:text-emerald-300' 
                      : 'text-zinc-100 group-hover:text-amber-500'
                  }`}>
                    {cat.title[currentLanguage]}
                  </h3>
                  <p className="text-zinc-500 text-[11px] mt-1 line-clamp-1 font-medium font-sans">
                    {cat.tagline[currentLanguage]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 🔷 SPECIAL DISCOUNT BANNER */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="combo-discount-banner">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-xl overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-black"
          id="discount-banner-container"
        >
          <IslamicGridOverlay />
          <div className="flex-1 text-center md:text-left z-10" id="discount-banner-text">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 text-xs font-bold tracking-widest px-3 py-1 rounded-full border border-amber-500/20 mb-4">
              <Flame size={12} />
              {currentLanguage === 'bn' ? 'স্পেশাল কম্বো অফার' : 'SPECIAL COMBO OFFER'}
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-white font-bold leading-tight mb-3">
              {currentLanguage === 'bn' 
                ? '২টি আতর কিনলে ফ্রি পাবেন রয়্যাল তাসবিহ!' 
                : 'Buy Any 2 Attars & Get a Premium Tasbih Free!'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              {currentLanguage === 'bn'
                ? 'আপনার পছন্দের যেকোনো দুইটি প্রিমিয়াম আতর অর্ডার করুন এবং সম্পূর্ণ ফ্রিতে পান ৮৫০ টাকা সমমূল্যের চন্দন কাঠের পবিত্র রয়্যাল তাসবিহ। অফারটি সীমিত সময়ের জন্য প্রযোজ্য।'
                : 'Order any two premium attars of your choice and get our handcrafted sandalwood Agate Royal Tasbih (worth ৳850) completely free. Limited time offer.'}
            </p>
          </div>
          
          <div className="z-10 shrink-0" id="discount-banner-cta">
            <button
              onClick={() => setCurrentPage('shop')}
              className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3.5 rounded font-bold text-xs tracking-widest uppercase shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              id="discount-btn"
            >
              {currentLanguage === 'bn' ? 'অফারটি লুফে নিন' : 'Claim Offer Now'}
            </button>
          </div>
        </motion.div>
      </section>

      {/* 🔷 BEST SELLING PRODUCTS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="bestseller-products-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4" id="bestseller-header">
          <div className="text-left" id="bestseller-title-box">
            <p className="text-amber-500 font-semibold text-xs tracking-widest uppercase font-mono mb-1">
              {currentLanguage === 'bn' ? 'সেরা কালেকশন' : 'Curated'}
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-bold tracking-wide">
              {currentLanguage === 'bn' ? 'সবচেয়ে জনপ্রিয় পণ্যসমূহ' : 'Best Selling Products'}
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('shop')}
            className="flex items-center gap-1.5 text-amber-500 hover:text-amber-400 text-xs sm:text-sm font-bold tracking-widest uppercase shrink-0 transition-colors"
            id="view-all-bestsellers-btn"
          >
            {currentLanguage === 'bn' ? 'সব প্রোডাক্ট দেখুন' : 'View Shop'} <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" id="bestsellers-grid">
          {displayProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 🔷 CUSTOMER REVIEWS */}
      <section className="py-20 bg-zinc-950 border-t border-b border-zinc-900 px-4 sm:px-6 lg:px-8" id="reviews-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" id="reviews-header">
            <p className="text-amber-500 font-semibold text-xs tracking-widest uppercase font-mono mb-1">
              {currentLanguage === 'bn' ? 'রিভিউ' : 'Testimonials'}
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-bold tracking-wide">
              {currentLanguage === 'bn' ? 'গ্রাহকদের সন্তুষ্টি ও মতামত' : 'What Our Customers Say'}
            </h2>
            <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="reviews-grid">
            {reviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-lg flex flex-col justify-between"
                id={`review-card-${rev.id}`}
              >
                <div>
                  <div className="flex gap-1 mb-4 text-amber-500" id={`review-stars-${rev.id}`}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed italic mb-6">
                    "{currentLanguage === 'bn' ? rev.comment : rev.commentEn}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-zinc-900 pt-4" id={`review-author-${rev.id}`}>
                  <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center font-serif text-sm font-bold">
                    {(currentLanguage === 'bn' ? rev.name : rev.nameEn).charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-semibold">
                      {currentLanguage === 'bn' ? rev.name : rev.nameEn}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      {currentLanguage === 'bn' ? rev.location : rev.locationEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
