import React, { useState, useEffect } from 'react';
import { 
  googleSignIn, 
  initAuth, 
  logoutGmail, 
  listMessages, 
  getMessageDetails, 
  sendEmail, 
  trashMessage, 
  GmailMessage, 
  listLabels,
  GmailLabel 
} from '../lib/gmailService';
import { 
  Mail, 
  Send, 
  Trash2, 
  RefreshCw, 
  Search as SearchIcon, 
  Plus, 
  ArrowLeft, 
  Loader, 
  User, 
  LogOut, 
  Check, 
  Sparkles, 
  Inbox, 
  Star, 
  FileText, 
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const GmailCenter: React.FC = () => {
  const { currentLanguage } = useApp();
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Gmail Data State
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [labels, setLabels] = useState<GmailLabel[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>('INBOX');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  
  // Loading & Operations State
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // View state: 'list' | 'compose' | 'detail'
  const [view, setView] = useState<'list' | 'compose' | 'detail'>('list');

  // Compose Form State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // Auto-authentication state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setNeedsAuth(true);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Fetch messages and labels whenever token or selected folder or search query changes
  useEffect(() => {
    if (token) {
      fetchLabels();
      fetchInboxMessages();
    }
  }, [token, selectedLabel, appliedQuery]);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.message || '';
      const errCode = err?.code || '';
      const isPopupClosed = 
        errCode === 'auth/popup-closed-by-user' || 
        errMsg.includes('popup-closed-by-user') || 
        errMsg.includes('closed-by-user') ||
        errMsg.includes('closed by the user');

      if (isPopupClosed) {
        setAuthError(
          currentLanguage === 'bn' 
            ? 'পপআপ বন্ধ হয়ে গেছে বা ব্রাউজার দ্বারা ব্লক হয়েছে। আইফ্রেম (Iframe) প্রিভিউতে থাকার কারণে এটি ঘটে থাকে। সমাধান করতে নিচের "নতুন ট্যাবে খুলুন" বাটনে ক্লিক করে নতুন ট্যাবে চেষ্টা করুন।' 
            : 'Login popup was closed or blocked. This is a common issue inside preview iframes. Please click the "Open in Standalone Tab" button below to open the app in a new tab and complete the sign-in.'
        );
      } else {
        setAuthError(
          currentLanguage === 'bn' 
            ? 'গুগল সাইন-ইন করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' 
            : 'Google sign-in failed. Please try again.'
        );
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutGmail();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setMessages([]);
      setSelectedMessage(null);
      setView('list');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLabels = async () => {
    if (!token) return;
    const labelList = await listLabels(token);
    // Filter useful system labels or user labels
    const filtered = labelList.filter(l => 
      ['INBOX', 'SENT', 'DRAFT', 'STARRED', 'SPAM', 'TRASH', 'IMPORTANT', 'UNREAD'].includes(l.id) || 
      l.type === 'user'
    );
    setLabels(filtered);
  };

  const fetchInboxMessages = async () => {
    if (!token) return;
    setIsLoadingMessages(true);
    setMessages([]);
    try {
      // Build search query based on standard filters
      let q = appliedQuery;
      const labelIds: string[] = [];
      
      if (selectedLabel === 'STARRED') {
        q = q ? `${q} is:starred` : 'is:starred';
      } else if (selectedLabel === 'UNREAD') {
        q = q ? `${q} is:unread` : 'is:unread';
      } else {
        labelIds.push(selectedLabel);
      }

      const listResult = await listMessages(token, {
        maxResults: 12,
        q,
        labelIds: labelIds.length > 0 ? labelIds : undefined
      });

      if (listResult.messages && listResult.messages.length > 0) {
        // Fetch detailed content for each message concurrently
        const detailPromises = listResult.messages.map(msg => getMessageDetails(token, msg.id));
        const detailedResults = await Promise.all(detailPromises);
        const validMessages = detailedResults.filter((m): m is GmailMessage => m !== null);
        setMessages(validMessages);
      }
    } catch (err) {
      console.error('Error fetching messages details:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleMessageSelect = async (msgId: string) => {
    if (!token) return;
    setIsDetailLoading(true);
    setView('detail');
    try {
      const details = await getMessageDetails(token, msgId);
      if (details) {
        setSelectedMessage(details);
      }
    } catch (err) {
      console.error('Error getting details:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedQuery(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setAppliedQuery('');
  };

  // Pre-configured Al Barakah Premium Customer templates
  const applyTemplate = (type: 'confirmation' | 'shipment' | 'newsletter') => {
    if (type === 'confirmation') {
      setComposeSubject(currentLanguage === 'bn' ? 'অর্ডার কনফার্মেশন - আল বারাকাহ প্রিমিয়াম' : 'Order Confirmation - Al Barakah Premium');
      setComposeBody(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d4af37; border-radius: 8px; background-color: #0b0b0b; color: #ffffff;">
          <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 15px; margin-bottom: 20px;">
            <h1 style="color: #d4af37; margin: 0; font-family: 'Georgia', serif; font-size: 24px; letter-spacing: 2px;">AL BARAKAH PREMIUM</h1>
            <p style="color: #a1a1aa; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 4px;">P R E M I U M</p>
          </div>
          <p style="color: #f4f4f5; font-size: 15px;">আসসালামু আলাইকুম,</p>
          <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">আল বারাকাহ প্রিমিয়াম এ অর্ডার করার জন্য আপনাকে আন্তরিক ধন্যবাদ। আপনার অর্ডারটি সফলভাবে কনফার্ম করা হয়েছে। নিচে আপনার অর্ডারের সংক্ষিপ্ত বিবরণী দেওয়া হলো:</p>
          
          <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #a1a1aa;">অর্ডার নম্বর: <strong>#ABP-${Math.floor(1000 + Math.random() * 9000)}</strong></p>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #a1a1aa;">তারিখ: <strong>${new Date().toLocaleDateString('bn-BD')}</strong></p>
            <p style="margin: 0; font-size: 13px; color: #a1a1aa;">ডেলিভারি মাধ্যম: <strong>ক্যাশ অন ডেলিভারি (COD)</strong></p>
          </div>
          
          <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">খুব শীঘ্রই আমাদের একজন প্রতিনিধি আপনার মোবাইল নাম্বারে যোগাযোগ করে বিস্তারিত নিশ্চিত করবেন এবং পার্সেলটি পাঠিয়ে দেওয়া হবে।</p>
          
          <div style="background-color: #eab308; color: #000000; padding: 10px; border-radius: 4px; text-align: center; font-weight: bold; font-size: 12px; margin: 20px 0;">
            * রিটার্ন পলিসি সতর্কবার্তা: ডেলিভারির সময় পার্সেল রিটার্ন করতে চাইলে অবশ্যই ডেলিভারি চার্জ পরিশোধ করতে হবে।
          </div>

          <div style="border-t: 1px solid #27272a; padding-top: 15px; margin-top: 25px; text-align: center; font-size: 12px; color: #71717a;">
            <p style="margin: 0 0 5px 0;">যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন: +৮৮০ ১৭xxxxxxxx</p>
            <p style="margin: 0;">© আল বারাকাহ প্রিমিয়াম - সর্বস্বত্ব সংরক্ষিত</p>
          </div>
        </div>
      `);
    } else if (type === 'shipment') {
      setComposeSubject(currentLanguage === 'bn' ? 'পার্সেলটি শিপমেন্টের জন্য পাঠানো হয়েছে - আল বারাকাহ প্রিমিয়াম' : 'Parcel Handed Over to Courier - Al Barakah Premium');
      setComposeBody(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d4af37; border-radius: 8px; background-color: #0b0b0b; color: #ffffff;">
          <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 15px; margin-bottom: 20px;">
            <h1 style="color: #d4af37; margin: 0; font-family: 'Georgia', serif; font-size: 24px; letter-spacing: 2px;">AL BARAKAH PREMIUM</h1>
          </div>
          <p style="color: #f4f4f5; font-size: 15px;">আসসালামু আলাইকুম,</p>
          <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">খুশির খবর! আপনার আল বারাকাহ প্রিমিয়াম এর কাঙ্ক্ষিত পার্সেলটি কুরিয়ার সার্ভিসে হ্যান্ডওভার করা হয়েছে। আগামী ২-৩ কার্যদিবসের মধ্যে কুরিয়ার প্রতিনিধি আপনার সাথে যোগাযোগ করে পণ্যটি ডেলিভারি করবেন।</p>
          
          <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #a1a1aa;">ডেলিভারি ঠিকানা: <strong>আপনার নিবন্ধিত ঠিকানা</strong></p>
            <p style="margin: 0; font-size: 13px; color: #a1a1aa;">কুরিয়ার সার্ভিস: <strong>STEADFAST / REDX</strong></p>
          </div>

          <p style="color: #eab308; font-size: 13px; line-height: 1.5; font-weight: 500;">* বিশেষ অনুরোধ: ডেলিভারি রাইডারকে পার্সেলটি খুলে চেক করার পূর্বে পুরো টাকা পেমেন্ট করতে হবে। পণ্য অপছন্দ বা রিটার্ন করতে চাইলে কুরিয়ার চার্জটি পরিশোধ সাপেক্ষে রাইডারের কাছে রিটার্ন করতে পারবেন।</p>
          
          <div style="border-t: 1px solid #27272a; padding-top: 15px; margin-top: 25px; text-align: center; font-size: 12px; color: #71717a;">
            <p style="margin: 0;">© আল বারাকাহ প্রিমিয়াম - প্রিমিয়াম ও অর্গানিক লাইফস্টাইল ব্র্যান্ড</p>
          </div>
        </div>
      `);
    } else if (type === 'newsletter') {
      setComposeSubject(currentLanguage === 'bn' ? 'বিশেষ অফার! প্রিমিয়াম অর্গানিক আইটেমে দারুণ ডিসকাউন্ট' : 'Special Offer! Mega Discount on Premium Organic Products');
      setComposeBody(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d4af37; border-radius: 8px; background-color: #0b0b0b; color: #ffffff;">
          <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 15px; margin-bottom: 20px;">
            <h1 style="color: #d4af37; margin: 0; font-family: 'Georgia', serif; font-size: 24px; letter-spacing: 2px;">AL BARAKAH PREMIUM</h1>
          </div>
          <p style="color: #eab308; font-size: 18px; font-weight: bold; text-align: center; margin-top: 10px;">মেগা ফ্ল্যাশ সেল! সীমিত সময়ের অফার</p>
          <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6; text-align: center;">আল বারাকাহ প্রিমিয়াম এর জনপ্রিয় অর্গানিক মধু মিশ্রিত বাদাম, আজওয়া খেজুর এবং খাঁটি কালোজিরা তেলের উপর পাচ্ছেন আকর্ষণীয় ছাড়!</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://albarakahpremium.com" style="background-color: #d4af37; color: #000000; text-decoration: none; padding: 12px 25px; font-weight: bold; border-radius: 30px; font-size: 14px; box-shadow: 0 4px 10px rgba(212,175,55,0.3);">শপ ভিজিট করুন</a>
          </div>

          <p style="color: #71717a; font-size: 12px; text-align: center;">* অফারটি স্টক থাকা সাপেক্ষে প্রযোজ্য। যেকোনো রিটার্নের ক্ষেত্রে কাস্টমারকে ডেলিভারি চার্জ বহন করতে হবে।</p>
        </div>
      `);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!composeTo || !composeSubject || !composeBody) {
      setSendError(currentLanguage === 'bn' ? 'দয়া করে সব ফিল্ড পূরণ করুন।' : 'Please fill in all fields.');
      return;
    }

    setIsSending(true);
    setSendSuccess(false);
    setSendError(null);

    try {
      const ok = await sendEmail(token, {
        to: composeTo,
        subject: composeSubject,
        body: composeBody
      });

      if (ok) {
        setSendSuccess(true);
        setComposeTo('');
        setComposeSubject('');
        setComposeBody('');
        setTimeout(() => {
          setSendSuccess(false);
          setView('list');
          fetchInboxMessages();
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      setSendError(currentLanguage === 'bn' ? 'ইমেইলটি পাঠানো যায়নি। পুনরায় চেষ্টা করুন।' : 'Failed to send email. Try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleTrashMessage = async (msgId: string) => {
    if (!token) return;

    // MANDATORY USER CONFIRMATION FOR DESTRUCTIVE ACTION
    const messageDetailsStr = selectedMessage ? `"${selectedMessage.subject}"` : 'this email';
    const confirmQuestion = currentLanguage === 'bn'
      ? `আপনি কি নিশ্চিত যে আপনি ${messageDetailsStr} ইমেইলটি ট্র্যাশে পাঠাতে চান? এটি ইনবক্স থেকে মুছে ফেলা হবে।`
      : `Are you sure you want to move ${messageDetailsStr} to the trash? This action will remove it from your inbox.`;
    
    const userConfirmed = window.confirm(confirmQuestion);
    
    if (!userConfirmed) {
      return; // Aborted
    }

    setIsDetailLoading(true);
    try {
      const success = await trashMessage(token, msgId);
      if (success) {
        // Clear message selection and return to inbox list
        setSelectedMessage(null);
        setView('list');
        fetchInboxMessages();
      } else {
        alert(currentLanguage === 'bn' ? 'মুছে ফেলতে ব্যর্থ হয়েছে।' : 'Failed to delete email.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleReplyMessage = () => {
    if (!selectedMessage) return;
    setComposeTo(selectedMessage.from || '');
    setComposeSubject(`Re: ${selectedMessage.subject}`);
    setComposeBody(`<br/><br/>On ${selectedMessage.date}, ${selectedMessage.from} wrote:<br/><blockquote>${selectedMessage.body}</blockquote>`);
    setView('compose');
  };

  // RENDER SECURITY GATED INTERFACE
  if (needsAuth) {
    const inIframe = typeof window !== 'undefined' && window.self !== window.top;

    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8" id="gmail-gate-container">
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-8 sm:p-12 text-center shadow-2xl shadow-black relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"></div>
          
          <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
            <Mail className="text-amber-500" size={32} />
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-wide text-white mb-3">
            {currentLanguage === 'bn' ? 'আল বারাকাহ জিমেইল সেন্টার' : 'Al Barakah Gmail Center'}
          </h1>
          
          <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            {currentLanguage === 'bn' 
              ? 'গুগল অথেনটিকেশন ব্যবহার করে আপনার জিমেইল অ্যাকাউন্টটি নিরাপদে কানেক্ট করুন। এখান থেকে আপনি কাস্টমারদের দ্রুত রিপ্লাই দিতে পারবেন, অর্ডার কনফার্মেশন মেইল পাঠাতে পারবেন এবং ইনবক্স ম্যানেজ করতে পারবেন।' 
              : 'Securely connect your Gmail account using Google Authentication. Manage customer responses, compose professional shipping/order updates, and browse emails directly.'}
          </p>

          {/* PROACTIVE IFRAME DETECTION NOTICE */}
          {inIframe && (
            <div className="mb-6 bg-amber-950/20 border border-amber-500/20 rounded-md p-4 text-xs text-amber-400 text-left max-w-lg mx-auto space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle size={15} className="text-amber-500 shrink-0" />
                <span>{currentLanguage === 'bn' ? 'আইফ্রেম প্রিভিউ মোড সনাক্ত হয়েছে' : 'Iframe Preview Detected'}</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                {currentLanguage === 'bn'
                  ? 'গুগল সাইন-ইন পপআপ সাধারণত আইফ্রেমের ভিতরে ব্রাউজার নিরাপত্তা নিয়মের কারণে ব্লক বা বন্ধ হয়ে যায়। নিরবচ্ছিন্ন লগইনের জন্য অনুগ্রহ করে নিচের বাটনে ক্লিক করে অ্যাপটি একটি নতুন standalone ট্যাবে খুলুন এবং লগইন সম্পন্ন করুন।'
                  : 'Google Sign-In popups are often blocked or fail to communicate inside sandboxed preview iframes. For a seamless experience, please click the button below to open the application in a new standalone tab.'}
              </p>
              <div className="pt-1">
                <button
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                  id="btn-open-standalone-tab-proactive"
                >
                  <ExternalLink size={11} />
                  {currentLanguage === 'bn' ? 'নতুন ট্যাবে খুলুন' : 'Open in Standalone Tab'}
                </button>
              </div>
            </div>
          )}

          {authError && (
            <div className="mb-6 bg-rose-950/20 border border-rose-900 rounded-md p-4 text-xs text-rose-400 text-left max-w-lg mx-auto space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle size={14} className="shrink-0 text-rose-500" />
                <span>{currentLanguage === 'bn' ? 'অথেনটিকেশন ত্রুটি' : 'Authentication Error'}</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {authError}
              </p>
              <div className="pt-1">
                <button
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="inline-flex items-center gap-1.5 bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/20 px-3 py-1.5 rounded font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                  id="btn-open-standalone-tab-error"
                >
                  <ExternalLink size={11} />
                  {currentLanguage === 'bn' ? 'নতুন ট্যাবে পুনরায় চেষ্টা করুন' : 'Try in Standalone Tab'}
                </button>
              </div>
            </div>
          )}

          {/* GOOGLE MATERIAL BUTTON - STANDARD DESIGN ACCORDING TO WORKSPACE INSTRUCTIONS */}
          <div className="flex justify-center gap-3 flex-wrap">
            <button 
              onClick={handleLogin}
              disabled={isAuthenticating}
              className="gsi-material-button bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 shadow-sm rounded-lg px-6 py-3 font-semibold text-sm cursor-pointer transition-all flex items-center gap-3 disabled:opacity-50"
              id="google-signin-btn"
            >
              {isAuthenticating ? (
                <Loader className="animate-spin text-amber-500" size={18} />
              ) : (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '18px', height: '18px' }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              )}
              <span className="text-zinc-800 font-medium">
                {currentLanguage === 'bn' ? 'গুগল দিয়ে সাইন ইন করুন' : 'Sign in with Google'}
              </span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-900/60 text-[11px] text-zinc-500 flex items-center justify-center gap-1.5 font-mono">
            <span>SECURED WITH GOOGLE OAUTH 2.0</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="gmail-center-dashboard">
      
      {/* HEADER SECTION: User Details & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-900 rounded-lg p-5 mb-6 shadow-md shadow-black">
        <div className="flex items-center gap-3">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'Gmail User'} 
              className="w-12 h-12 rounded-full border border-amber-500/20 shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
              <User className="text-zinc-400" size={20} />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-semibold text-lg text-white leading-none">
                {user?.displayName || 'Al Barakah Member'}
              </h2>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" title="Connected"></span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-zinc-900 pt-3 md:pt-0">
          <div className="text-xs text-amber-500 font-medium flex items-center gap-1 bg-amber-500/5 px-2.5 py-1 rounded border border-amber-500/10">
            <Sparkles size={12} />
            <span>{currentLanguage === 'bn' ? 'অফিসিয়াল মেইলার সক্রিয়' : 'Official Mailer Enabled'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:text-white bg-rose-500/5 hover:bg-rose-500 border border-rose-500/10 rounded transition-all cursor-pointer"
            id="gmail-logout-btn"
          >
            <LogOut size={12} />
            <span>{currentLanguage === 'bn' ? 'ডিসকানেক্ট' : 'Disconnect'}</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* SIDEBAR NAVIGATION COLUMN */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* COMPOSE BUTTON */}
          <button
            onClick={() => {
              setComposeTo('');
              setComposeSubject('');
              setComposeBody('');
              setView('compose');
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-sm tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
            id="gmail-compose-btn"
          >
            <Plus size={16} />
            <span>{currentLanguage === 'bn' ? 'নতুন মেইল লিখুন' : 'Compose Email'}</span>
          </button>

          {/* GMAIL FOLDERS */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 shadow-md">
            <h3 className="text-[11px] text-zinc-500 uppercase font-mono tracking-wider mb-2 px-2">
              {currentLanguage === 'bn' ? 'ফোল্ডার ও ক্যাটাগরি' : 'Folders & Labels'}
            </h3>
            
            <nav className="space-y-1">
              {[
                { id: 'INBOX', label: { bn: 'ইনবক্স (Inbox)', en: 'Inbox' }, icon: Inbox },
                { id: 'STARRED', label: { bn: 'তারকাচিহ্নিত (Starred)', en: 'Starred' }, icon: Star },
                { id: 'SENT', label: { bn: 'পাঠানো ইমেইল (Sent)', en: 'Sent' }, icon: Send },
                { id: 'UNREAD', label: { bn: 'অপঠিত (Unread)', en: 'Unread' }, icon: Clock },
                { id: 'TRASH', label: { bn: 'ট্র্যাশ (Trash)', en: 'Trash / Bin' }, icon: Trash2 },
              ].map((folder) => {
                const FolderIcon = folder.icon;
                return (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setSelectedLabel(folder.id);
                      setView('list');
                      setSelectedMessage(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded flex items-center justify-between transition-colors ${
                      selectedLabel === folder.id && view === 'list'
                        ? 'text-amber-500 bg-amber-500/5 border-l-2 border-amber-500'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FolderIcon size={14} className={selectedLabel === folder.id ? 'text-amber-500' : 'text-zinc-500'} />
                      <span>{folder.label[currentLanguage]}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* AL BARAKAH PREMIUM TEMPLATES PICKER */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-4 shadow-md">
            <h3 className="text-xs text-amber-500 font-serif font-bold mb-3 flex items-center gap-1">
              <Sparkles size={12} />
              <span>{currentLanguage === 'bn' ? 'অফিসিয়াল মেইল টেমপ্লেট' : 'Quick Merchant Templates'}</span>
            </h3>
            <p className="text-[10px] text-zinc-500 mb-4 leading-normal">
              {currentLanguage === 'bn' 
                ? 'গ্রাহকদের দ্রুত এবং প্রফেশনাল মেইল রেসপন্স পাঠানোর জন্য নিচের যেকোনো একটি টেমপ্লেট নির্বাচন করুন।' 
                : 'Instantly fill the editor with professional customer-oriented HTML templates.'}
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  setView('compose');
                  applyTemplate('confirmation');
                }}
                className="w-full text-left p-2.5 bg-zinc-900 hover:bg-zinc-900/50 border border-zinc-800 rounded text-[11px] font-semibold text-zinc-300 transition-colors flex items-center justify-between group"
              >
                <span>{currentLanguage === 'bn' ? 'অর্ডার কনফার্মেশন মেইল' : 'Order Confirmation'}</span>
                <ChevronRight size={12} className="text-zinc-600 group-hover:text-amber-500" />
              </button>

              <button
                onClick={() => {
                  setView('compose');
                  applyTemplate('shipment');
                }}
                className="w-full text-left p-2.5 bg-zinc-900 hover:bg-zinc-900/50 border border-zinc-800 rounded text-[11px] font-semibold text-zinc-300 transition-colors flex items-center justify-between group"
              >
                <span>{currentLanguage === 'bn' ? 'শিপমেন্ট / কুরিয়ার মেইল' : 'Courier Handover Update'}</span>
                <ChevronRight size={12} className="text-zinc-600 group-hover:text-amber-500" />
              </button>

              <button
                onClick={() => {
                  setView('compose');
                  applyTemplate('newsletter');
                }}
                className="w-full text-left p-2.5 bg-zinc-900 hover:bg-zinc-900/50 border border-zinc-800 rounded text-[11px] font-semibold text-zinc-300 transition-colors flex items-center justify-between group"
              >
                <span>{currentLanguage === 'bn' ? 'ডিসকাউন্ট ও ফ্ল্যাশ সেল অফার' : 'Discount Flash Sale Promo'}</span>
                <ChevronRight size={12} className="text-zinc-600 group-hover:text-amber-500" />
              </button>
            </div>
          </div>
        </div>

        {/* MAIN MAIL WORKSPACE */}
        <div className="lg:col-span-3">
          
          <AnimatePresence mode="wait">
            {/* VIEW 1: EMAIL LIST VIEW */}
            {view === 'list' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 shadow-lg min-h-[480px] flex flex-col"
                id="gmail-list-container"
              >
                {/* Search Bar & Refresh Bar */}
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3 mb-5 border-b border-zinc-900 pb-4">
                  <div className="relative flex-grow w-full">
                    <input
                      type="text"
                      placeholder={currentLanguage === 'bn' ? 'ইমেইল খুঁজুন (উদা: from:Support, order confirmation)...' : 'Search emails (e.g. from:Paypal, confirmation)...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-900 text-white border border-zinc-800 focus:border-amber-500/50 rounded pl-9 pr-8 py-2 text-xs focus:outline-none font-medium"
                    />
                    <SearchIcon className="absolute left-3 top-3 text-zinc-500" size={14} />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-2.5 text-zinc-500 hover:text-white text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-amber-500 rounded transition-all w-full sm:w-auto"
                    >
                      {currentLanguage === 'bn' ? 'সার্চ' : 'Search'}
                    </button>
                    <button
                      type="button"
                      onClick={fetchInboxMessages}
                      disabled={isLoadingMessages}
                      className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-400 hover:text-white transition-all disabled:opacity-40"
                      title="Refresh inbox"
                    >
                      <RefreshCw size={14} className={isLoadingMessages ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </form>

                {/* Email Items Container */}
                {isLoadingMessages ? (
                  <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
                    <Loader className="animate-spin text-amber-500 mb-3" size={28} />
                    <p className="text-zinc-500 text-xs">
                      {currentLanguage === 'bn' ? 'জিমেইল সার্ভার থেকে ইমেইল লোড হচ্ছে...' : 'Loading secure emails from Gmail servers...'}
                    </p>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="divide-y divide-zinc-900 flex-grow">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => handleMessageSelect(msg.id)}
                        className="py-3 px-2 hover:bg-zinc-900/40 rounded transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-900/40 group"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-amber-500 truncate max-w-[150px] sm:max-w-[200px]">
                              {msg.from?.split('<')[0].trim() || 'Unknown'}
                            </span>
                            {msg.labels.includes('UNREAD') && (
                              <span className="bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase scale-90">
                                NEW
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-medium text-white truncate mb-0.5 group-hover:text-amber-400 transition-colors">
                            {msg.subject}
                          </h4>
                          <p className="text-[11px] text-zinc-500 truncate">
                            {msg.snippet}
                          </p>
                        </div>
                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1.5 shrink-0 text-right">
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {msg.date ? new Date(msg.date).toLocaleDateString(currentLanguage === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' }) : ''}
                          </span>
                          <span className="text-[9px] text-zinc-600 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5">
                            {selectedLabel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center py-20 text-center text-zinc-500">
                    <Inbox size={48} className="text-zinc-700 mb-3" />
                    <p className="text-xs font-medium">
                      {currentLanguage === 'bn' ? 'কোনো ইমেইল পাওয়া যায়নি।' : 'No emails found in this folder.'}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-1 max-w-xs mx-auto">
                      {currentLanguage === 'bn' ? 'সার্চ ফিল্টার রিসেট করতে ক্লিয়ার বাটনে চাপুন।' : 'Try checking another label or refresh to check for new messages.'}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW 2: EMAIL DETAIL PREVIEW */}
            {view === 'detail' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 shadow-lg min-h-[480px] flex flex-col"
                id="gmail-detail-container"
              >
                {/* Detail Action Bar */}
                <div className="flex items-center justify-between gap-3 border-b border-zinc-900 pb-4 mb-5">
                  <button
                    onClick={() => {
                      setView('list');
                      setSelectedMessage(null);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>{currentLanguage === 'bn' ? 'ইনবক্সে ফিরুন' : 'Back to Inbox'}</span>
                  </button>

                  {!isDetailLoading && selectedMessage && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleReplyMessage}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-amber-500 rounded transition-all"
                      >
                        {currentLanguage === 'bn' ? 'উত্তর দিন (Reply)' : 'Reply'}
                      </button>
                      
                      {/* TRASH DISCARD BUTTON - DESTROY CRITICAL PERMISSION MUST INCLUDE CONFIRM DIALOG */}
                      <button
                        onClick={() => handleTrashMessage(selectedMessage.id)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-rose-500 rounded transition-all"
                        title="Move email to trash"
                        id="gmail-trash-detail-btn"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {isDetailLoading || !selectedMessage ? (
                  <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
                    <Loader className="animate-spin text-amber-500 mb-3" size={28} />
                    <p className="text-zinc-500 text-xs">
                      {currentLanguage === 'bn' ? 'ইমেইলের বিস্তারিত লোড হচ্ছে...' : 'Fetching message contents...'}
                    </p>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col">
                    {/* Header info */}
                    <div className="mb-6">
                      <h3 className="text-sm sm:text-base font-serif font-bold text-white mb-3 tracking-wide">
                        {selectedMessage.subject}
                      </h3>
                      
                      <div className="bg-zinc-900/40 border border-zinc-900 p-3.5 rounded-lg space-y-2 text-xs text-zinc-400">
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <div>
                            <span className="text-zinc-500 font-medium">From:</span>{' '}
                            <strong className="text-zinc-200">{selectedMessage.from}</strong>
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            {selectedMessage.date}
                          </div>
                        </div>
                        <div>
                          <span className="text-zinc-500 font-medium">To:</span>{' '}
                          <span className="text-zinc-300">{selectedMessage.to}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {selectedMessage.labels.map((l, idx) => (
                            <span key={idx} className="bg-zinc-900 border border-zinc-800 text-zinc-500 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Email Content Rendering */}
                    <div className="flex-grow bg-zinc-950/20 border border-zinc-900 rounded-lg p-4 min-h-[250px] overflow-auto text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {/* Detect if body has HTML markup or if we should display cleanly */}
                      {selectedMessage.body?.includes('<div') || selectedMessage.body?.includes('<p') || selectedMessage.body?.includes('<html') ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: selectedMessage.body }} 
                          className="gmail-html-content bg-zinc-950 p-4 rounded text-zinc-100 border border-zinc-900"
                        />
                      ) : (
                        <p>{selectedMessage.body}</p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW 3: EMAIL COMPOSE VIEW */}
            {view === 'compose' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 shadow-lg min-h-[480px] flex flex-col"
                id="gmail-compose-container"
              >
                {/* Header title */}
                <div className="flex items-center justify-between gap-3 border-b border-zinc-900 pb-4 mb-5">
                  <h3 className="font-serif text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                    <Send className="text-amber-500" size={14} />
                    <span>{currentLanguage === 'bn' ? 'নতুন ইমেইল বার্তা লিখুন' : 'Compose Message'}</span>
                  </h3>
                  <button
                    onClick={() => setView('list')}
                    className="text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    {currentLanguage === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                </div>

                {/* Compose Form */}
                <form onSubmit={handleSendEmail} className="space-y-4 flex-grow flex flex-col">
                  {sendSuccess && (
                    <div className="bg-emerald-950/20 border border-emerald-900 rounded-md p-3.5 text-xs text-emerald-400 flex items-center gap-2">
                      <Check size={14} className="bg-emerald-500 text-black rounded-full p-0.5" />
                      <span>{currentLanguage === 'bn' ? 'ইমেইল সফলভাবে পাঠানো হয়েছে!' : 'Email sent successfully!'}</span>
                    </div>
                  )}

                  {sendError && (
                    <div className="bg-rose-950/20 border border-rose-900 rounded-md p-3.5 text-xs text-rose-400 flex items-center gap-2">
                      <AlertCircle size={14} />
                      <span>{sendError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase font-mono mb-1.5">
                        {currentLanguage === 'bn' ? 'কার কাছে (To):' : 'Recipient Email (To):'}
                      </label>
                      <input
                        type="email"
                        required
                        value={composeTo}
                        onChange={(e) => setComposeTo(e.target.value)}
                        placeholder="customer@example.com"
                        className="w-full bg-zinc-900 text-white border border-zinc-800 focus:border-amber-500/50 rounded p-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase font-mono mb-1.5">
                        {currentLanguage === 'bn' ? 'বিষয় (Subject):' : 'Subject:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        placeholder={currentLanguage === 'bn' ? 'অর্ডারের বিবরণ...' : 'Order confirmation details...'}
                        className="w-full bg-zinc-900 text-white border border-zinc-800 focus:border-amber-500/50 rounded p-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col">
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase font-mono mb-1.5">
                      {currentLanguage === 'bn' ? 'বার্তা লিখুন (Body - HTML/Text):' : 'Message Body (Supports HTML formatting):'}
                    </label>
                    <textarea
                      required
                      value={composeBody}
                      onChange={(e) => setComposeBody(e.target.value)}
                      placeholder={currentLanguage === 'bn' ? 'এখানে আপনার বার্তা লিখুন বা বাম দিক থেকে টেমপ্লেট নির্বাচন করুন...' : 'Write your email here, or apply a professional template from the sidebar...'}
                      className="w-full bg-zinc-900 text-white border border-zinc-800 focus:border-amber-500/50 rounded p-3 text-xs focus:outline-none flex-grow min-h-[180px] font-mono leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-zinc-900">
                    <button
                      type="button"
                      onClick={() => setView('list')}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-xs font-semibold text-zinc-400 hover:text-white transition-all"
                    >
                      {currentLanguage === 'bn' ? 'বাতিল' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSending}
                      className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs font-bold rounded flex items-center gap-1.5 disabled:opacity-40"
                    >
                      {isSending ? (
                        <>
                          <Loader className="animate-spin" size={12} />
                          <span>{currentLanguage === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...'}</span>
                        </>
                      ) : (
                        <>
                          <Send size={12} />
                          <span>{currentLanguage === 'bn' ? 'ইমেইল পাঠান' : 'Send Email'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
