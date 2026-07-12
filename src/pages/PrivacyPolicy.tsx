import React from 'react';
import { useApp } from '../context/AppContext';

export const PrivacyPolicy: React.FC = () => {
  const { currentLanguage } = useApp();

  return (
    <div className="bg-black text-white min-h-screen py-16" id="privacy-policy-view">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 bg-zinc-950 border border-zinc-900 rounded-lg p-8 sm:p-12 shadow-xl shadow-black">
        
        <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide border-b border-zinc-900 pb-5 mb-8">
          {currentLanguage === 'bn' ? 'প্রাইভেসি এবং রিটার্ন পলিসি' : 'Privacy & Return Policy'}
        </h1>

        <div className="space-y-6 text-zinc-400 text-xs sm:text-sm leading-relaxed" id="policy-content">
          <p className="font-semibold text-white">
            {currentLanguage === 'bn' 
              ? 'সর্বশেষ আপডেট: ১১ জুলাই, ২০২৬' 
              : 'Last Updated: July 11, 2026'}
          </p>

          <p>
            {currentLanguage === 'bn'
              ? 'আল বারাকাহ প্রিমিয়াম এ আপনাকে স্বাগত। আমরা আমাদের কাস্টমারদের সর্বোচ্চ সেবা এবং স্বচ্ছতা নিশ্চিত করতে গভীরভাবে প্রতিশ্রুতিবদ্ধ। আমাদের ওয়েবসাইট ব্যবহারের মাধ্যমে আপনি এই পলিসির শর্তাবলীর সাথে একমত পোষণ করছেন।'
              : 'Welcome to Al Barakah Premium. We are deeply committed to protecting your personal information and ensuring full transparency. By using our website and services, you consent to the terms outlined in this policy.'}
          </p>

          <div className="space-y-3" id="policy-section-1">
            <h3 className="font-serif text-base font-bold text-white uppercase">
              {currentLanguage === 'bn' ? '১. সংগৃহীত তথ্যাদি' : '1. Information We Collect'}
            </h3>
            <p>
              {currentLanguage === 'bn'
                ? 'অর্ডার সম্পন্ন করতে অথবা আমাদের ওয়েবসাইটে রেজিস্ট্রেশন করার সময়ে আমরা নিম্নোক্ত তথ্যসমূহ সংগ্রহ করে থাকি:'
                : 'To complete orders and provide a personalized experience, we collect:'}
            </p>
            <ul className="list-disc pl-5 space-y-1" id="info-list">
              <li>{currentLanguage === 'bn' ? 'নাম এবং যোগাযোগ নম্বর (মোবাইল)' : 'Your Name & Contact Number'}</li>
              <li>{currentLanguage === 'bn' ? 'ডেলিভারি ঠিকানা ও শিপিং এরিয়া' : 'Detailed Shipping Address'}</li>
              <li>{currentLanguage === 'bn' ? 'ইমেইল অ্যাড্রেস এবং ট্রানজেকশন তথ্য (প্রযোজ্য ক্ষেত্রে)' : 'Email address & Payment transaction details (if online method is used)'}</li>
            </ul>
          </div>

          <div className="space-y-3" id="policy-section-2">
            <h3 className="font-serif text-base font-bold text-white uppercase">
              {currentLanguage === 'bn' ? '২. তথ্যের ব্যবহার' : '2. How We Use Your Information'}
            </h3>
            <p>
              {currentLanguage === 'bn'
                ? 'সংগৃহীত তথ্যসমূহ নিম্নোক্ত উদ্দেশ্যে ব্যবহৃত হয়:'
                : 'Your gathered information is strictly utilized to:'}
            </p>
            <ul className="list-disc pl-5 space-y-1" id="usage-list">
              <li>{currentLanguage === 'bn' ? 'আপনার অর্ডার প্রক্রিয়াকরণ এবং হোম ডেলিভারি নিশ্চিত করতে।' : 'Process and fulfill your orders.'}</li>
              <li>{currentLanguage === 'bn' ? 'প্রয়োজনে কল বা এসএসএম এর মাধ্যমে যোগাযোগ করতে।' : 'Communicate and contact you for order verification.'}</li>
              <li>{currentLanguage === 'bn' ? 'আমাদের সেবার মান উন্নত করতে এবং নতুন কোনো অফার শেয়ার করতে।' : 'Enhance our system layouts or provide dynamic discount updates.'}</li>
            </ul>
          </div>

          <div className="space-y-3" id="policy-section-3">
            <h3 className="font-serif text-base font-bold text-white uppercase">
              {currentLanguage === 'bn' ? '৩. তথ্য গোপনীয়তা ও নিরাপত্তা' : '3. Security and Third-party sharing'}
            </h3>
            <p>
              {currentLanguage === 'bn'
                ? 'আল বারাকাহ প্রিমিয়াম আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রয় বা হস্তান্তর করে না। আপনার তথ্য আমাদের সিস্টেমে সম্পূর্ণ সুরক্ষিত থাকে এবং শুধুমাত্র ডেলিভারি কুরিয়ার সহযোগীদের সাথে ডেলিভারি সম্পন্ন করার জন্য প্রয়োজনীয় ঠিকানা শেয়ার করা হয়।'
                : 'Al Barakah Premium enforces a strict zero-sharing protocol. We do not sell or trade your data. Customer information is accessible only to authorized personnel and shipping courier partners solely to carry out delivery.'}
            </p>
          </div>

          <div className="space-y-3 border-t border-zinc-900 pt-6" id="policy-section-4">
            <h3 className="font-serif text-base font-bold text-amber-500 uppercase">
              {currentLanguage === 'bn' ? '৪. পণ্য রিটার্ন ও এক্সচেঞ্জ পলিসি' : '4. Return & Exchange Policy'}
            </h3>
            <div className="bg-amber-950/10 border border-amber-500/20 rounded p-4 text-zinc-300">
              <p className="font-semibold text-white mb-2">
                {currentLanguage === 'bn' 
                  ? 'ডেলিভারি চার্জ সম্পর্কিত গুরুত্বপূর্ণ নোটিশ:' 
                  : 'Important Notice Regarding Delivery Charges:'}
              </p>
              <p className="text-xs sm:text-sm">
                {currentLanguage === 'bn'
                  ? 'যেকোনো অর্ডার বাতিল বা পণ্য রিটার্ন (Return) করতে চাইলে, কাস্টমারকে অবশ্যই ডেলিভারি চার্জ (ঢাকা বা ঢাকার বাইরে যেটাই প্রযোজ্য) পরিশোধ করতে হবে।'
                  : 'If you wish to return or cancel an order at the time of delivery, the customer must pay the applicable delivery charge (inside or outside Dhaka).'}
              </p>
            </div>
          </div>

          <p className="border-t border-zinc-900 pt-6 text-[11px] text-zinc-500 text-center">
            {currentLanguage === 'bn'
              ? 'এই পলিসি সংক্রান্ত কোনো প্রশ্ন থাকলে অনুগ্রহ করে মেইল করুন: info@albarakahpremium.com'
              : 'For further queries regarding your personal records, please email: info@albarakahpremium.com'}
          </p>

        </div>

      </div>
    </div>
  );
};
