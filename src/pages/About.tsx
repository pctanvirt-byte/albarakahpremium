import React from 'react';
import { useApp } from '../context/AppContext';
import { IslamicGridOverlay, IslamicLogo, IslamicBorder } from '../components/IslamicPattern';
import { Award, Shield, Heart, HelpCircle } from 'lucide-react';

export const About: React.FC = () => {
  const { currentLanguage } = useApp();

  return (
    <div className="bg-black text-white min-h-screen py-16 relative" id="about-page-view">
      <IslamicGridOverlay />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Intro */}
        <div className="text-center space-y-4" id="about-intro">
          <IslamicLogo size={64} className="mx-auto text-amber-500" />
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide mt-3">
            {currentLanguage === 'bn' ? 'আমাদের গল্প ও ঐতিহ্য' : 'Our Story & Heritage'}
          </h1>
          <p className="text-amber-500 font-serif text-base sm:text-lg italic">
            "বরকতের সাথে বিশুদ্ধতা" &bull; "Purity with Blessing"
          </p>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4 rounded"></div>
        </div>

        {/* Narrative / Rich storytelling block */}
        <div className="bg-zinc-950/80 border border-zinc-900 p-8 rounded-lg space-y-6 leading-relaxed text-sm sm:text-base text-zinc-300" id="about-narrative">
          <p>
            {currentLanguage === 'bn'
              ? 'আস-সালামু আলাইকুম। "আল বারাকাহ প্রিমিয়াম" বাংলাদেশের একটি স্বনামধন্য এবং আভিজাত্যপূর্ণ ব্র্যান্ড, যা সুন্নতি জীবনধারা এবং আধুনিক রুচিবোধের এক অপূর্ব মেলবন্ধন ঘটায়। বরকতময় এবং খাঁটি উপাদান দ্বারা প্রস্তুতকৃত পণ্য আমাদের গ্রাহকদের দ্বারে পৌঁছে দেয়াই আমাদের একমাত্র লক্ষ্য।'
              : 'As-Salamu Alaykum. "Al Barakah Premium" is a luxury lifestyle brand based in Bangladesh. We weave traditional Islamic values with modern elegance, delivering premium quality alcohol-free attars, custom polarized sunglasses, and elegant prayer essentials straight to your home.'}
          </p>
          <p>
            {currentLanguage === 'bn'
              ? 'আমাদের আতর কালেকশন সম্পূর্ণভাবে অ্যালকোহল মুক্ত এবং দুবাই ও সৌদি আরবের নামকরা সুগন্ধি ঘরানা দ্বারা অনুপ্রাণিত। আমাদের দক্ষ কারিগররা প্রতিটি ফোঁটায় বজায় রাখেন বিশুদ্ধতা এবং রাজকীয় ঘ্রাণ, যা আপনার মনকে প্রশান্ত করবে এবং আপনার চারপাশকে সুবাসিত রাখবে।'
              : 'Our master attar collection is completely alcohol-free, inspired by legendary fragrance houses of Dubai and Saudi Arabia. Each drop is carefully extracted to preserve pristine purity and royal longevity, offering a scent that calms the soul and enchants those around you.'}
          </p>
          <p>
            {currentLanguage === 'bn'
              ? 'শুধু সুগন্ধিই নয়, আমাদের কাস্টম ডিজাইন্ড গোল্ড প্লেটেড সানগ্লাস ও রয়্যাল জায়নামাজ আপনার আভিজাত্যকে চমৎকারভাবে ফুটিয়ে তুলবে। আমরা বিশ্বাস করি গুণগত মানই একটি ব্র্যান্ডের প্রকৃত সম্পদ, আর তাই প্রতিটি পণ্যের উৎপাদনে আমরা কোনো আপোষ করি না।'
              : 'Beyond exquisite fragrances, our gold-plated sunglasses and plush embroidered Turkish prayer mats elevate your comfort and personal style. We firmly believe that authentic quality is a brand\'s truest asset, which is why we enforce strict standards at every phase of production.'}
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="about-pillars">
          <div className="bg-zinc-900/40 border border-zinc-850 p-6 rounded text-center space-y-3" id="pillar-1">
            <Award className="text-amber-500 mx-auto" size={32} />
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase">
              {currentLanguage === 'bn' ? 'আভিজাত্য' : 'Royal Quality'}
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {currentLanguage === 'bn'
                ? 'আমরা প্রতিটি পণ্যের ফিনিশিং এবং উপাদানের আভিজাত্য শতভাগ নিশ্চিত করি।'
                : 'We ensure unmatched finishing and absolute premium material grade for every piece.'}
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-850 p-6 rounded text-center space-y-3" id="pillar-2">
            <Shield className="text-amber-500 mx-auto" size={32} />
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase">
              {currentLanguage === 'bn' ? 'বিশুদ্ধতা' : 'Pristine Purity'}
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {currentLanguage === 'bn'
                ? '১০০% অ্যালকোহল মুক্ত আতর এবং ক্ষতিকারক রাসায়নিক মুক্ত খাঁটি উপাদান।'
                : '100% alcohol-free concentrates and completely natural, skin-safe blends.'}
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-850 p-6 rounded text-center space-y-3" id="pillar-3">
            <Heart className="text-amber-500 mx-auto" size={32} />
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase">
              {currentLanguage === 'bn' ? 'সন্তুষ্টি' : 'Customer Devotion'}
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {currentLanguage === 'bn'
                ? 'গ্রাহকের সন্তুষ্টিই আমাদের সর্বোচ্চ প্রেরণা। দ্রুত সেবা ও সাহায্য সবসময় প্রস্তুত।'
                : 'Your happiness is our passion. Dedicated after-sales and swift support.'}
            </p>
          </div>
        </div>

        {/* Divider */}
        <IslamicBorder />

      </div>
    </div>
  );
};
