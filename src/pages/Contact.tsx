import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const { currentLanguage } = useApp();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setName('');
      setPhone('');
      setMessage('');
    }, 400);
  };

  return (
    <div className="bg-black text-white min-h-screen py-16" id="contact-page-view">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center space-y-3 mb-16" id="contact-header">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide">
            {currentLanguage === 'bn' ? 'আমাদের সাথে যোগাযোগ' : 'Contact Us'}
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm max-w-md mx-auto">
            {currentLanguage === 'bn'
              ? 'যেকোনো মতামত, বাল্ক অর্ডার বা অনুসন্ধানের জন্য নির্দ্বিধায় আমাদের মেইল করুন অথবা কল করুন।'
              : 'Have a question or looking to make a bulk purchase? Drop us a message or ring our office directly.'}
          </p>
          <div className="w-12 h-0.5 bg-amber-500 mx-auto mt-4 rounded"></div>
        </div>

        {/* Contact info and Form grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12" id="contact-layout">
          
          {/* Left Column (2 cols): Contact info Cards */}
          <div className="lg:col-span-2 space-y-6" id="contact-info-cards">
            
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-lg space-y-6 shadow-lg shadow-black" id="info-card-container">
              <h3 className="font-serif text-lg font-bold text-amber-500 pb-3 border-b border-zinc-900">
                {currentLanguage === 'bn' ? 'সরাসরি যোগাযোগ করুন' : 'Contact Details'}
              </h3>

              <div className="space-y-4 text-xs sm:text-sm" id="info-list">
                
                <div className="flex gap-3.5 items-start" id="contact-address">
                  <div className="p-2 bg-amber-500/5 text-amber-500 rounded border border-amber-500/10 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-0.5">
                      {currentLanguage === 'bn' ? 'আমাদের ঠিকানা' : 'Our Address'}
                    </h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {currentLanguage === 'bn'
                        ? 'টঙ্গী বিসিক, গাজীপুর, বাংলাদেশ।'
                        : 'Tongi BSCIC, Gazipur, Bangladesh.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start" id="contact-phone">
                  <div className="p-2 bg-amber-500/5 text-amber-500 rounded border border-amber-500/10 shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-0.5">
                      {currentLanguage === 'bn' ? 'হটলাইন নম্বর' : 'Hotline Number'}
                    </h4>
                    <p className="text-zinc-400 text-xs font-mono">01316534171</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start" id="contact-email">
                  <div className="p-2 bg-amber-500/5 text-amber-500 rounded border border-amber-500/10 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-0.5">
                      {currentLanguage === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Official Email'}
                    </h4>
                    <p className="text-zinc-400 text-xs font-mono">info@albarakahpremium.com</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start" id="contact-hours">
                  <div className="p-2 bg-amber-500/5 text-amber-500 rounded border border-amber-500/10 shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-0.5">
                      {currentLanguage === 'bn' ? 'সাপ্তাহিক কর্মঘণ্টা' : 'Business Hours'}
                    </h4>
                    <p className="text-zinc-400 text-xs leading-normal">
                      {currentLanguage === 'bn'
                        ? 'শনিবার - বৃহস্পতিবার: সকাল ১০:০০ - রাত ৯:০০ (শুক্রবার বন্ধ)'
                        : 'Saturday - Thursday: 10:00 AM - 9:00 PM (Friday Closed)'}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Simple local map placeholder */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-center text-xs text-zinc-500 h-44 flex flex-col items-center justify-center relative overflow-hidden" id="map-placeholder">
              <div className="absolute inset-0 bg-zinc-900 opacity-20 filter grayscale hover:opacity-40 transition-opacity"></div>
              <MapPin className="text-amber-500/40 animate-pulse mb-2 z-10" size={32} />
              <p className="font-semibold text-zinc-400 z-10">
                {currentLanguage === 'bn' ? 'টঙ্গী বিসিক, গাজীপুর (গুগল ম্যাপ ভিউ)' : 'Tongi BSCIC, Gazipur (Google Map)'}
              </p>
              <p className="text-[10px] text-zinc-600 mt-1 z-10">
                {currentLanguage === 'bn' ? 'প্রধান কার্যালয় অবস্থান' : 'Headquarters Location'}
              </p>
            </div>

          </div>

          {/* Right Column (3 cols): Contact Form */}
          <div className="lg:col-span-3 bg-zinc-950 border border-zinc-900 p-8 rounded-lg shadow-lg shadow-black" id="contact-form-box">
            {submitted ? (
              <div className="py-12 text-center space-y-4" id="contact-success-state">
                <CheckCircle size={48} className="text-amber-500 mx-auto animate-bounce" />
                <h3 className="font-serif text-xl font-bold text-white">
                  {currentLanguage === 'bn' ? 'বার্তাটি সফলভাবে পাঠানো হয়েছে!' : 'Message Sent Successfully!'}
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  {currentLanguage === 'bn'
                    ? 'আপনার বার্তার জন্য ধন্যবাদ। আল বারাকাহ কাস্টমার কেয়ার টিম খুব দ্রুত আপনার সাথে যোগাযোগ করবে।'
                    : 'Thank you for reaching out. Our support agent will review your request and contact you shortly.'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-amber-500 border border-zinc-800 text-xs px-5 py-2 rounded font-semibold mt-4"
                  id="btn-send-another"
                >
                  {currentLanguage === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-5" id="contact-form-fields">
                <h3 className="font-serif text-lg font-bold text-white border-b border-zinc-900 pb-3">
                  {currentLanguage === 'bn' ? 'আমাদের বার্তা পাঠান' : 'Send Us a Message'}
                </h3>

                <div className="flex flex-col gap-1.5" id="field-name">
                  <label className="text-xs text-zinc-400 font-semibold">
                    {currentLanguage === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={currentLanguage === 'bn' ? 'যেমন: সাইদুল ইসলাম' : 'e.g. Sayedul Islam'}
                    className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/50 font-medium"
                    id="contact-name-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5" id="field-phone">
                  <label className="text-xs text-zinc-400 font-semibold">
                    {currentLanguage === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/50 font-mono"
                    id="contact-phone-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5" id="field-message">
                  <label className="text-xs text-zinc-400 font-semibold">
                    {currentLanguage === 'bn' ? 'আপনার বার্তা লিখুন *' : 'Your Message *'}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={currentLanguage === 'bn' ? 'আপনি কী জানতে চান তা এখানে বিস্তারিত লিখুন...' : 'Type your detailed enquiry here...'}
                    className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2 focus:outline-none focus:border-amber-500/50 leading-relaxed"
                    id="contact-message-textarea"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/10 active:scale-98"
                  id="btn-contact-submit"
                >
                  <Send size={14} />
                  {currentLanguage === 'bn' ? 'বার্তা পাঠান' : 'Submit Message'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
