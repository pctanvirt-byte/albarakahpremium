import React from 'react';
import { useApp } from '../context/AppContext';
import { IslamicBorder, IslamicLogo } from './IslamicPattern';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentLanguage, setCurrentPage } = useApp();

  return (
    <footer className="bg-black border-t border-amber-500/20 text-zinc-400 font-sans" id="main-footer">
      {/* Dynamic Islamic Border Accent */}
      <IslamicBorder />

      {/* Trust Highlights Strip */}
      <div className="bg-zinc-950/80 border-b border-zinc-900/60 py-8" id="trust-highlights-strip">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-900">
            <div className="flex flex-col items-center p-4 md:p-0" id="trust-1">
              <ShieldCheck className="text-amber-500 mb-3" size={28} />
              <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-1">
                {currentLanguage === 'bn' ? '১০০% বিশুদ্ধ ও হালাল' : '100% Pure & Halal'}
              </h4>
              <p className="text-xs text-zinc-500 max-w-xs">
                {currentLanguage === 'bn' 
                  ? 'আমাদের সকল আতর সম্পূর্ণ অ্যালকোহল মুক্ত এবং বিশুদ্ধ উপাদান দ্বারা তৈরি।' 
                  : 'All our attars are completely alcohol-free and prepared from pure ingredients.'}
              </p>
            </div>
            
            <div className="flex flex-col items-center pt-6 md:pt-0" id="trust-2">
              <Truck className="text-amber-500 mb-3" size={28} />
              <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-1">
                {currentLanguage === 'bn' ? 'দ্রুত ডেলিভারি বাংলাদেশ' : 'Fast Delivery Bangladesh'}
              </h4>
              <p className="text-xs text-zinc-500 max-w-xs">
                {currentLanguage === 'bn'
                  ? 'ঢাকার ভেতরে ২৪-৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ৩-৫ দিনে হোম ডেলিভারি।'
                  : 'Home delivery in 24-48 hours inside Dhaka and 3-5 days across Bangladesh.'}
              </p>
            </div>

            <div className="flex flex-col items-center pt-6 md:pt-0" id="trust-3">
              <RefreshCw className="text-amber-500 mb-3" size={28} />
              <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-1">
                {currentLanguage === 'bn' ? 'সহজ রিটার্ন পলিসি' : 'Easy Return Policy'}
              </h4>
              <p className="text-xs text-zinc-500 max-w-xs">
                {currentLanguage === 'bn'
                  ? 'পছন্দ না হলে বা ত্রুটি থাকলে ৭ দিনের মধ্যে সহজে রিটার্ন করার সুবিধা।'
                  : 'Easy 7-day return if you are not satisfied or receive a defective product.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12" id="footer-links-grid">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Slogan Column */}
          <div className="flex flex-col gap-4" id="footer-col-brand">
            <div className="flex items-center gap-2">
              <IslamicLogo size={36} />
              <div className="flex flex-col">
                <span className="text-white font-serif font-bold tracking-wider leading-none">
                  AL BARAKAH
                </span>
                <span className="text-amber-500 font-serif text-xs tracking-widest leading-none font-medium mt-0.5">
                  PREMIUM
                </span>
              </div>
            </div>
            <p className="text-xs italic text-amber-500 font-serif mt-1">
              "বরকতের সাথে বিশুদ্ধতা" &bull; "Purity with Blessing"
            </p>
            <p className="text-xs leading-relaxed text-zinc-500">
              {currentLanguage === 'bn'
                ? 'আল বারাকাহ প্রিমিয়াম বাংলাদেশ ভিত্তিক একটি আভিজাত্যপূর্ণ ব্র্যান্ড। আমরা সর্বোচ্চ মানের অ্যালকোহল মুক্ত আতর, প্রিমিয়াম সানগ্লাস এবং ইসলামিক সামগ্রী সরবরাহ করি।'
                : 'Al Barakah Premium is a luxury Islamic brand based in Bangladesh, offering high-end alcohol-free attars, premium sunglasses, and authentic Islamic lifestyle products.'}
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-3" id="footer-col-quicklinks">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase border-l-2 border-amber-500 pl-2">
              {currentLanguage === 'bn' ? 'দ্রুত লিঙ্ক' : 'Quick Links'}
            </h4>
            <ul className="text-xs space-y-2.5">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-amber-500 transition-colors">
                  {currentLanguage === 'bn' ? 'হোম' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-amber-500 transition-colors">
                  {currentLanguage === 'bn' ? 'সব প্রোডাক্টস / শপ' : 'Shop All Products'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-amber-500 transition-colors">
                  {currentLanguage === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-amber-500 transition-colors">
                  {currentLanguage === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('privacy')} className="hover:text-amber-500 transition-colors">
                  {currentLanguage === 'bn' ? 'প্রাইভেসি ও রিটার্ন পলিসি' : 'Privacy & Return Policy'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="flex flex-col gap-3" id="footer-col-contact">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase border-l-2 border-amber-500 pl-2">
              {currentLanguage === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Info'}
            </h4>
            <ul className="text-xs space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <span>
                  {currentLanguage === 'bn'
                    ? 'টঙ্গী বিসিক, গাজীপুর, বাংলাদেশ'
                    : 'Tongi BSCIC, Gazipur, Bangladesh'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-amber-500 shrink-0" />
                <span className="font-mono">01316534171</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-amber-500 shrink-0" />
                <span className="font-mono">info@albarakahpremium.com</span>
              </li>
            </ul>
          </div>

          {/* Local Bangladesh Gateways Column */}
          <div className="flex flex-col gap-3" id="footer-col-payments">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase border-l-2 border-amber-500 pl-2">
              {currentLanguage === 'bn' ? 'পেমেন্ট গেটওয়ে' : 'Payment Gateways'}
            </h4>
            <p className="text-xs text-zinc-500">
              {currentLanguage === 'bn'
                ? 'আমরা বাংলাদেশে প্রচলিত সকল বিশ্বস্ত পেমেন্ট গেটওয়ে সমর্থন করি:'
                : 'We support all trusted local payment methods in Bangladesh:'}
            </p>
            
            {/* Visual labels representing local payment methods */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-center mt-1">
              <div className="bg-rose-950/40 border border-pink-500/20 px-2 py-1.5 rounded text-pink-400 font-semibold flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                bKash (বিকাশ)
              </div>
              <div className="bg-orange-950/40 border border-orange-500/20 px-2 py-1.5 rounded text-orange-400 font-semibold flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                Nagad (নগদ)
              </div>
              <div className="bg-violet-950/40 border border-violet-500/20 px-2 py-1.5 rounded text-violet-400 font-semibold flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                Rocket (রকেট)
              </div>
              <div className="bg-emerald-950/40 border border-emerald-500/20 px-2 py-1.5 rounded text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                COD / Bank
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Line */}
      <div className="bg-zinc-950 py-6 border-t border-zinc-900/40 text-center text-xs" id="footer-copyright-row">
        <p className="text-zinc-600 font-mono">
          &copy; {new Date().getFullYear()} Al Barakah Premium Bangladesh. All Rights Reserved.
        </p>
        <p className="text-[10px] text-amber-500/30 hover:text-amber-500/60 mt-1.5 transition-colors cursor-pointer" onClick={() => setCurrentPage('admin')}>
          Admin Portal Authentication Required &bull; AlBarakahpremium
        </p>
      </div>
    </footer>
  );
};
