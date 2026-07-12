import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Wand2, 
  Search, 
  Brain, 
  Volume2, 
  Upload, 
  FileImage, 
  Cpu, 
  Compass, 
  Trash2, 
  ArrowRight, 
  Play, 
  Pause,
  Loader2,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const AIScentStudio: React.FC = () => {
  const { currentLanguage, products, setSelectedProduct, setCurrentPage } = useApp();
  const [activeTab, setActiveTab] = useState<"chat" | "vision" | "art" | "motion">("chat");

  // -----------------------------
  // TAB 1: CHATBOT STATE
  // -----------------------------
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string; audioUrl?: string; isPlaying?: boolean }>>([
    {
      role: "assistant",
      content: currentLanguage === "bn" 
        ? "আসসালামু আলাইকুম! আমি আল বারাকাহ লাক্সারি এআই অ্যাডভাইজার। আমি আপনাকে সেরা সুগন্ধি তেল (আতর), রাজকীয় সানগ্লাস বা প্রিমিয়াম কালেকশন বেছে নিতে সাহায্য করতে পারি। আপনার কি কোনো সুনির্দিষ্ট ঘ্রাণ পছন্দ আছে (যেমন: মিষ্টি, ধোঁয়াটে উড, কাশ্মীরি বা জাফরান)?"
        : "As-salamu alaykum! I am your Al Barakah Luxury AI Advisor. I can assist you in discovering the finest alcohol-free attars, royal sunglasses, or premium modesty collections. Do you have a preferred notes profile (e.g., sweet amber, smoky oud, Kashmiri rose)?"
    }
  ]);
  const [useSearch, setUseSearch] = useState(true);
  const [enableThinking, setEnableThinking] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Audio playback refs
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: chatHistory.slice(1), // Exclude the greeting from raw logs context
          useSearch,
          enableThinking
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setChatHistory(prev => [...prev, { role: "assistant", content: data.text }]);
      } else {
        throw new Error(data.error || "Failed to fetch response");
      }
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [...prev, {
        role: "assistant",
        content: currentLanguage === "bn"
          ? `দুঃখিত, কোনো ত্রুটি হয়েছে: ${err.message}`
          : `Sorry, an error occurred: ${err.message}`
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const speakText = async (text: string, index: number) => {
    if (playingIndex === index && currentAudio) {
      currentAudio.pause();
      setPlayingIndex(null);
      setCurrentAudio(null);
      return;
    }

    // Stop current audio if any
    if (currentAudio) {
      currentAudio.pause();
    }

    setPlayingIndex(index);

    try {
      // Check if audio is already generated for this response
      if (chatHistory[index].audioUrl) {
        const audio = new Audio(chatHistory[index].audioUrl);
        audio.onended = () => setPlayingIndex(null);
        setCurrentAudio(audio);
        audio.play();
        return;
      }

      // Synthesize audio
      const res = await fetch("/api/gemini/speech-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceName: "Kore" })
      });

      const data = await res.json();
      if (res.ok && data.base64Audio) {
        const audioUrl = `data:audio/mp3;base64,${data.base64Audio}`;
        // Save back to history so we don't fetch again
        setChatHistory(prev => prev.map((item, i) => i === index ? { ...item, audioUrl } : item));

        const audio = new Audio(audioUrl);
        audio.onended = () => setPlayingIndex(null);
        setCurrentAudio(audio);
        audio.play();
      } else {
        throw new Error("Failed to synthesize speech");
      }
    } catch (err) {
      console.error("Speech Synthesis failed:", err);
      setPlayingIndex(null);
    }
  };

  // -----------------------------
  // TAB 2: VISION STATE
  // -----------------------------
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const [visionMime, setVisionMime] = useState("");
  const [visionPrompt, setVisionPrompt] = useState("");
  const [visionResult, setVisionResult] = useState("");
  const [isVisionLoading, setIsVisionLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVisionMime(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVisionImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!visionImage || isVisionLoading) return;

    setIsVisionLoading(true);
    setVisionResult("");

    try {
      const response = await fetch("/api/gemini/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: visionPrompt || undefined,
          base64Image: visionImage,
          mimeType: visionMime
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setVisionResult(data.text);
      } else {
        throw new Error(data.error || "Vision analysis failed.");
      }
    } catch (err: any) {
      setVisionResult(`Error: ${err.message}`);
    } finally {
      setIsVisionLoading(false);
    }
  };

  // -----------------------------
  // TAB 3: IMAGE GENERATION STATE
  // -----------------------------
  const [artPrompt, setArtPrompt] = useState("");
  const [artSize, setArtSize] = useState<"1K" | "2K" | "4K">("1K");
  const [artAspectRatio, setArtAspectRatio] = useState("1:1");
  const [artResult, setArtResult] = useState("");
  const [isArtLoading, setIsArtLoading] = useState(false);

  const handleGenerateArt = async () => {
    if (!artPrompt.trim() || isArtLoading) return;

    setIsArtLoading(true);
    setArtResult("");

    try {
      const response = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: artPrompt,
          size: artSize,
          aspectRatio: artAspectRatio
        })
      });

      const data = await response.json();
      if (response.ok && data.imageUrl) {
        setArtResult(data.imageUrl);
      } else {
        throw new Error(data.error || "Image generation failed.");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error generating image: ${err.message}`);
    } finally {
      setIsArtLoading(false);
    }
  };

  // -----------------------------
  // TAB 4: VIDEO GENERATION STATE
  // -----------------------------
  const [motionPrompt, setMotionPrompt] = useState("");
  const [motionImage, setMotionImage] = useState<string | null>(null);
  const [motionMime, setMotionMime] = useState("");
  const [motionAspectRatio, setArtVideoRatio] = useState<"16:9" | "9:16">("16:9");
  const [motionResultUrl, setMotionResultUrl] = useState("");
  const [isMotionLoading, setIsMotionLoading] = useState(false);
  const [motionStatus, setMotionStatus] = useState("");
  const motionFileInputRef = useRef<HTMLInputElement>(null);

  const handleMotionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMotionMime(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMotionImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!motionPrompt.trim() || isMotionLoading) return;

    setIsMotionLoading(true);
    setMotionResultUrl("");
    setMotionStatus(currentLanguage === "bn" ? "ভিডিও তৈরি শুরু হচ্ছে..." : "Starting video generation...");

    try {
      // Start operation
      const response = await fetch("/api/gemini/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: motionPrompt,
          base64Image: motionImage || undefined,
          mimeType: motionMime || undefined,
          aspectRatio: motionAspectRatio
        })
      });

      const data = await response.json();
      if (!response.ok || !data.operationName) {
        throw new Error(data.error || "Failed to launch video generation.");
      }

      const opName = data.operationName;
      pollVideoStatus(opName);
    } catch (err: any) {
      setMotionStatus(`Error: ${err.message}`);
      setIsMotionLoading(false);
    }
  };

  const reassuringMessages = [
    { bn: "সেন্ট মোশন অ্যালগরিদম লোড হচ্ছে...", en: "Loading scent motion algorithms..." },
    { bn: "ভিজুয়াল কণা সংমিশ্রণ করা হচ্ছে...", en: "Synthesizing dynamic fragrance droplets..." },
    { bn: "প্রোমোশনাল লাইটিং রেন্ডার হচ্ছে...", en: "Rendering royal atmospheric lighting..." },
    { bn: "ভিডিওর প্রতিটি ফ্রেম নিখুঁত করা হচ্ছে...", en: "Finishing final video frame polishing..." }
  ];

  const pollVideoStatus = async (opName: string) => {
    let msgIndex = 0;
    
    const interval = setInterval(async () => {
      // Update reassurance message
      const currentMsg = reassuringMessages[msgIndex % reassuringMessages.length];
      setMotionStatus(currentLanguage === "bn" ? currentMsg.bn : currentMsg.en);
      msgIndex++;

      try {
        const res = await fetch("/api/gemini/video-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName: opName })
        });

        const data = await res.json();
        if (res.ok) {
          if (data.done) {
            clearInterval(interval);
            downloadAndStreamVideo(opName);
          } else if (data.error) {
            clearInterval(interval);
            throw new Error(data.error.message || "Veo model processing failed.");
          }
        }
      } catch (err: any) {
        clearInterval(interval);
        setMotionStatus(`Generation failed: ${err.message}`);
        setIsMotionLoading(false);
      }
    }, 5000);
  };

  const downloadAndStreamVideo = async (opName: string) => {
    setMotionStatus(currentLanguage === "bn" ? "ভিডিও ডাউনলোড ও প্রস্তুত হচ্ছে..." : "Downloading and finalizing promotional clip...");
    try {
      const res = await fetch("/api/gemini/video-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationName: opName })
      });

      if (res.ok) {
        const blob = await res.blob();
        const videoUrl = URL.createObjectURL(blob);
        setMotionResultUrl(videoUrl);
        setMotionStatus("");
      } else {
        throw new Error("Failed to stream video file.");
      }
    } catch (err: any) {
      setMotionStatus(`Download Error: ${err.message}`);
    } finally {
      setIsMotionLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans" id="ai-scent-studio-container">
      {/* Background decorations */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="text-center space-y-3" id="studio-headline-block">
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-amber-500/40"></span>
            <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles size={12} className="animate-pulse" />
              {currentLanguage === "bn" ? "এআই আর্ট ও ফ্র্যাগ্রেন্স হাব" : "AI Scent & Modesty Laboratory"}
            </div>
            <span className="h-[1px] w-8 bg-amber-500/40"></span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            AL BARAKAH <span className="text-amber-500">AI STUDIO</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed">
            {currentLanguage === "bn" 
              ? "আল বারাকাহ-এর অত্যাধুনিক কৃত্রিম বুদ্ধিমত্তা সমৃদ্ধ স্টুডিও। এখানে আপনার পছন্দের সুগন্ধি খুঁজুন, ছবির ঘ্রাণ প্রোফাইল বিশ্লেষণ করুন এবং শৈল্পিক প্রচারণামূলক কন্টেন্ট তৈরি করুন।"
              : "Discover scent advisory, analyze photos for fragrance suggestions, generate high-definition bottle arts, and create cinematic promotional videos powered by Gemini."}
          </p>
        </div>

        {/* Tab Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-zinc-900 pb-2" id="studio-tab-selector">
          {[
            { id: "chat", icon: MessageSquare, label: { bn: "এআই সুগন্ধি গাইড", en: "Scent Advisory" } },
            { id: "vision", icon: Compass, label: { bn: "আতর ভিশন", en: "Attar Vision" } },
            { id: "art", icon: ImageIcon, label: { bn: "সেন্ট আর্ট ল্যাব", en: "Perfume Scent-Art" } },
            { id: "motion", icon: Video, label: { bn: "সেন্ট মোশন", en: "Scent Motion" } }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 rounded-lg border text-xs font-bold uppercase tracking-wider flex flex-col sm:flex-row items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/10"
                  : "bg-zinc-950/40 text-zinc-400 border-zinc-900 hover:text-white hover:border-zinc-800"
              }`}
            >
              <tab.icon size={16} className="shrink-0" />
              <span>{tab.label[currentLanguage]}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: SCENT ADVISORY (CHATBOT) */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="chat-tab-panel">
            {/* Control Panel / Sidebar */}
            <div className="bg-zinc-950/60 p-5 rounded-lg border border-zinc-900 space-y-6 text-left h-fit lg:col-span-1">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
                <Cpu className="text-amber-500" size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {currentLanguage === "bn" ? "অ্যাডভাইজার সেটিংস" : "Advisor Settings"}
                </h3>
              </div>

              {/* Toggle Search Grounding */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Search size={12} className="text-blue-400" />
                    {currentLanguage === "bn" ? "গুগল সার্চ গ্রাউন্ডিং" : "Google Search"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={useSearch} 
                      onChange={(e) => setUseSearch(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-zinc-400 after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-amber-500 peer-checked:after:bg-black"></div>
                  </label>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  {currentLanguage === "bn" 
                    ? "আতর, নোটস ও ট্রেন্ডস সম্পর্কে গুগলের রিয়েল-টাইম সার্চ রেজাল্ট যুক্ত করুন।" 
                    : "Grants access to Google Search to pull verified information in real-time."}
                </p>
              </div>

              {/* Toggle Deep Thinking Mode */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Brain size={12} className="text-purple-400 animate-pulse" />
                    {currentLanguage === "bn" ? "ডিপ থিংকিং মোড" : "Deep Thinking"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enableThinking} 
                      onChange={(e) => setEnableThinking(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-zinc-400 after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-amber-500 peer-checked:after:bg-black"></div>
                  </label>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  {currentLanguage === "bn" 
                    ? "জটিল সুগন্ধি রাসায়নিক ও বৈশিষ্ট্য বিশ্লেষণের জন্য থিংকিং মডেল (HIGH) সক্রিয় করুন।" 
                    : "Enables Gemini high-thinking mode to perform logical scent profiling."}
                </p>
              </div>

              {/* Sample prompts */}
              <div className="space-y-3 pt-4 border-t border-zinc-900">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  {currentLanguage === "bn" ? "জিজ্ঞাসা করুন" : "Recommended Queries"}
                </h4>
                {[
                  { bn: "আমার জন্য একটি মিষ্টি ও দীর্ঘস্থায়ী আতর সাজেস্ট করুন।", en: "Suggest a sweet and long-lasting attar for prayer." },
                  { bn: "উড (Oud) সুগন্ধির বৈশিষ্ট্য ও প্রকারভেদ কী কী?", en: "What are the characteristics of different Oud oils?" },
                  { bn: "গরমের দিনে ব্যবহারের জন্য সেরা হালকা সুগন্ধি তেল কোনটি?", en: "Which light perfume oil is best for hot summer days?" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setChatInput(currentLanguage === "bn" ? item.bn : item.en)}
                    className="w-full text-left p-2 bg-zinc-900/30 hover:bg-zinc-900/70 border border-zinc-900/80 rounded text-[11px] text-zinc-400 hover:text-white transition-all leading-normal"
                  >
                    {currentLanguage === "bn" ? item.bn : item.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 flex flex-col h-[520px] bg-zinc-950/40 border border-zinc-900 rounded-lg overflow-hidden">
              {/* Chat Header */}
              <div className="bg-zinc-950/80 px-4 py-3 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                    {currentLanguage === "bn" ? "আল বারাকাহ লাক্সারি এআই অ্যাডভাইজার" : "Al Barakah Fragrance Companion"}
                  </span>
                </div>
                <button 
                  onClick={() => setChatHistory([{
                    role: "assistant",
                    content: currentLanguage === "bn" 
                      ? "আসসালামু আলাইকুম! কথোপকথনটি রিসেট করা হয়েছে। কীভাবে সাহায্য করতে পারি?"
                      : "As-salamu alaykum! Conversation history has been cleared. How can I assist you?"
                  }])}
                  className="p-1.5 hover:bg-zinc-900 rounded text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Clear history"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-grow p-4 overflow-y-auto space-y-4 text-left custom-scrollbar">
                {chatHistory.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex gap-3 max-w-[85%] ${item.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-[11px] font-bold ${
                      item.role === "user" 
                        ? "bg-zinc-900 border-zinc-800 text-amber-500" 
                        : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                    }`}>
                      {item.role === "user" ? "ME" : "AB"}
                    </div>

                    <div className="space-y-1.5">
                      <div className={`p-3.5 rounded-lg text-xs leading-relaxed ${
                        item.role === "user"
                          ? "bg-zinc-900 text-white font-medium border border-zinc-900 rounded-tr-none"
                          : "bg-zinc-900/30 text-zinc-300 border border-zinc-900/80 rounded-tl-none"
                      }`}>
                        <p className="whitespace-pre-line">{item.content}</p>
                      </div>

                      {/* TTS affordance for advisor responses */}
                      {item.role === "assistant" && (
                        <button
                          onClick={() => speakText(item.content, index)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-colors border ${
                            playingIndex === index
                              ? "bg-amber-500/15 border-amber-500/30 text-amber-500"
                              : "bg-zinc-950/50 border-zinc-900 text-zinc-500 hover:text-amber-500 hover:border-amber-500/20"
                          }`}
                        >
                          <Volume2 size={10} className={playingIndex === index ? "animate-bounce" : ""} />
                          <span>{playingIndex === index ? (currentLanguage === "bn" ? "থামুন" : "Stop") : (currentLanguage === "bn" ? "শুনুন" : "Listen")}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex gap-3 max-w-[85%] mr-auto items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border bg-amber-500/10 border-amber-500/20 text-amber-500 text-[11px] font-bold">
                      AB
                    </div>
                    <div className="bg-zinc-900/20 border border-zinc-900/80 p-3 rounded-lg rounded-tl-none flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin text-amber-500" />
                      <span className="text-[11px] text-zinc-500 font-medium">
                        {enableThinking 
                          ? (currentLanguage === "bn" ? "গভীর চিন্তাভাবনা করা হচ্ছে..." : "Processing deep scent characteristics...") 
                          : (currentLanguage === "bn" ? "উত্তর প্রস্তুত করা হচ্ছে..." : "Drafting expert fragrance advice...")}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="bg-zinc-950 p-3 border-t border-zinc-900 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={currentLanguage === "bn" ? "সুগন্ধি তেল, আতর বা সানগ্লাস সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন..." : "Inquire about premium fragrance layers, notes, or products..."}
                  className="flex-grow bg-zinc-900/60 border border-zinc-800 px-3.5 py-3 rounded text-xs text-white focus:outline-none focus:border-amber-500/40"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-3 rounded text-xs font-bold uppercase tracking-widest transition-all shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <span>{currentLanguage === "bn" ? "পাঠান" : "Send"}</span>
                  <ArrowRight size={13} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: ATTAR VISION (IMAGE UNDERSTANDING) */}
        {activeTab === "vision" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="vision-tab-panel">
            {/* Input card */}
            <div className="bg-zinc-950/40 p-6 rounded-lg border border-zinc-900 text-left space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-zinc-900">
                  <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Compass size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-white">
                      {currentLanguage === "bn" ? "ছবি আপলোড করুন" : "Upload Scent Mood Profile"}
                    </h3>
                    <p className="text-[10px] text-zinc-500">
                      {currentLanguage === "bn" ? "ফুলের পাপড়ি, আভিজাত্যপূর্ণ পোশাক বা সানগ্লাসের ছবি দিন।" : "Upload raw ingredients, lifestyle references, or clothing items."}
                    </p>
                  </div>
                </div>

                {/* Upload Zone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-900 hover:border-amber-500/20 bg-zinc-950/80 p-8 rounded-lg text-center cursor-pointer transition-all space-y-3 flex flex-col items-center justify-center min-h-[180px]"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden"
                  />
                  {visionImage ? (
                    <div className="relative group w-full max-h-[160px] flex justify-center overflow-hidden rounded">
                      <img src={visionImage} alt="Vision reference" className="object-contain max-h-[150px] rounded" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-amber-500">
                        {currentLanguage === "bn" ? "ছবি পরিবর্তন করুন" : "Change Image"}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500">
                        <Upload size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-300 font-bold">{currentLanguage === "bn" ? "ড্র্যাগ করুন বা ব্রাউজ করুন" : "Drag or Browse Image"}</p>
                        <p className="text-[10px] text-zinc-500 mt-1">JPEG, PNG files are supported.</p>
                      </div>
                    </>
                  )}
                </div>

                {/* User specific instructions */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                    {currentLanguage === "bn" ? "বিশেষ নির্দেশনা (অপশনাল)" : "Specific Scent Directive (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={visionPrompt}
                    onChange={(e) => setVisionPrompt(e.target.value)}
                    placeholder={currentLanguage === "bn" ? "যেমন: এই ছবির ফুলের মিষ্টি নোটসের সাথে কোন আতর মিলবে?" : "e.g. Recommend an attar that coordinates with this gold watch."}
                    className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/40"
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyzeImage}
                disabled={!visionImage || isVisionLoading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 mt-4"
              >
                {isVisionLoading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>{currentLanguage === "bn" ? "ছবি বিশ্লেষণ করা হচ্ছে..." : "Analyzing Image..."}</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={13} />
                    <span>{currentLanguage === "bn" ? "ঘ্রাণ ও স্টাইল বিশ্লেষণ করুন" : "Analyze Scent & Style Matching"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Analysis Result display */}
            <div className="bg-zinc-950/40 p-6 rounded-lg border border-zinc-900 text-left flex flex-col justify-between min-h-[360px]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-900">
                  <Cpu className="text-amber-500" size={15} />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {currentLanguage === "bn" ? "অ্যাডভাইজার সাজেশন ও রিপোর্ট" : "AI Vision Report"}
                  </span>
                </div>

                {visionResult ? (
                  <div className="text-xs text-zinc-300 leading-relaxed font-sans space-y-4">
                    <p className="whitespace-pre-line bg-zinc-900/30 p-4 rounded border border-zinc-900/50">{visionResult}</p>
                    <div className="bg-amber-500/5 border border-amber-500/10 p-3.5 rounded flex gap-2">
                      <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-[10px] text-zinc-400">
                        <strong className="text-zinc-200 block mb-1">{currentLanguage === "bn" ? "আতর ব্যবহারের টিপস:" : "Luxury Attar Wear Tip:"}</strong>
                        {currentLanguage === "bn"
                          ? "সেরা প্রজেকশন পেতে কব্জির পালস পয়েন্ট এবং কানের পেছনে সুগন্ধি তেল ব্যবহার করুন। সুগন্ধিটি ঘষবেন না।"
                          : "Apply premium oil to pulse points on your wrist and behind ears. Do not rub the fragrance as it breaks notes."}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 text-zinc-600 text-xs">
                    {isVisionLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 size={24} className="animate-spin text-amber-500" />
                        <span>{currentLanguage === "bn" ? "এআই ছবি বিশ্লেষণ করে লাক্সারি ম্যাচ খুঁজছে..." : "AI is identifying coordinate patterns..."}</span>
                      </div>
                    ) : (
                      <span>{currentLanguage === "bn" ? "বাম পাশে ছবি আপলোড করে স্টার্ট বাটনে ক্লিক করুন।" : "Please upload a photo and click analyze to generate your custom report."}</span>
                    )}
                  </div>
                )}
              </div>

              {visionResult && (
                <button
                  onClick={() => setCurrentPage("shop")}
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-4"
                >
                  <span>{currentLanguage === "bn" ? "শপ কালেকশন দেখুন" : "Explore Shop Collections"}</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SCENT ART LAB (IMAGE GENERATION) */}
        {activeTab === "art" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="art-tab-panel">
            {/* Scent Art Prompter */}
            <div className="bg-zinc-950/40 p-6 rounded-lg border border-zinc-900 text-left space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-zinc-900">
                  <Wand2 size={16} className="text-amber-500" />
                  <div>
                    <h3 className="text-sm font-serif font-bold text-white">
                      {currentLanguage === "bn" ? "আর্ট মডেল ইনপুট" : "Scent-Art Specifier"}
                    </h3>
                    <p className="text-[10px] text-zinc-500">
                      {currentLanguage === "bn" ? "আপনার কল্পনার রাজকীয় সুগন্ধি বোতল বা প্যাকেট ডিজাইনের বিবরণ লিখুন।" : "Describe your dream royal fragrance visual or packaging."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                    {currentLanguage === "bn" ? "ডিজাইন প্রম্পট (Prompt) *" : "Design Prompt *"}
                  </label>
                  <textarea
                    rows={4}
                    value={artPrompt}
                    onChange={(e) => setArtPrompt(e.target.value)}
                    placeholder={currentLanguage === "bn" 
                      ? "যেমন: সোনার ঢাকনাযুক্ত ক্রিস্টাল আতর বোতল, পাশে লাল গোলাপ পাপড়ি এবং আরব্য মরুভূমির সূর্যাস্ত, রাজকীয় সুবাস বিজ্ঞাপন।" 
                      : "e.g. Luxurious gold-capped crystal perfume bottle filled with amber liquid, resting on silk cushions with incense smoke, 8k resolution hyper-detailed."}
                    className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/40 font-medium leading-relaxed"
                  />
                </div>

                {/* Configurations */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                      {currentLanguage === "bn" ? "রেজোলিউশন (Resolution) *" : "Resolution *"}
                    </label>
                    <select
                      value={artSize}
                      onChange={(e) => setArtSize(e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/40 font-semibold"
                    >
                      <option value="1K">1K (Standard HD)</option>
                      <option value="2K">2K (UHD Premium)</option>
                      <option value="4K">4K (Super Ultra HD)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                      {currentLanguage === "bn" ? "অ্যাসপেক্ট রেশিও" : "Aspect Ratio"}
                    </label>
                    <select
                      value={artAspectRatio}
                      onChange={(e) => setArtAspectRatio(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/40 font-semibold"
                    >
                      <option value="1:1">1:1 Square</option>
                      <option value="16:9">16:9 Landscape</option>
                      <option value="9:16">9:16 Portrait</option>
                      <option value="4:3">4:3 Classic</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateArt}
                disabled={!artPrompt.trim() || isArtLoading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 mt-4"
              >
                {isArtLoading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>{currentLanguage === "bn" ? "এআই আর্ট রেন্ডার করা হচ্ছে..." : "Rendering AI Scent-Art..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>{currentLanguage === "bn" ? "আর্ট জেনারেট করুন" : "Generate Custom Art"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Scent Art Result display */}
            <div className="bg-zinc-950/40 p-6 rounded-lg border border-zinc-900 text-left flex flex-col justify-between min-h-[400px]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-900">
                  <ImageIcon className="text-amber-500" size={15} />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {currentLanguage === "bn" ? "রেন্ডারড সুগন্ধি আর্টওয়ার্ক" : "Rendered Scent-Art Display"}
                  </span>
                </div>

                {artResult ? (
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="border border-zinc-900 rounded overflow-hidden shadow-2xl shadow-black max-h-[280px] flex items-center justify-center bg-black">
                      <img src={artResult} alt="Generated Scent Artwork" className="object-contain max-h-[270px]" />
                    </div>
                    <div className="text-center w-full">
                      <p className="text-[10px] text-zinc-500 italic mt-2">{artPrompt}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-24 text-zinc-600 text-xs">
                    {isArtLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 size={24} className="animate-spin text-amber-500" />
                        <span>{currentLanguage === "bn" ? "ডিপ ক্যানভাস ব্রাশ স্ট্রোক সাজানো হচ্ছে..." : "Applying deep neural canvas structures..."}</span>
                      </div>
                    ) : (
                      <span>{currentLanguage === "bn" ? "আপনার প্রম্পট লিখে জেনারেট বাটনে ক্লিক করুন।" : "Provide a creative prompt and click generate to visualize your masterpiece."}</span>
                    )}
                  </div>
                )}
              </div>

              {artResult && (
                <div className="flex gap-2 mt-4">
                  <a
                    href={artResult}
                    download="al_barakah_scent_art.png"
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded text-center transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                  >
                    {currentLanguage === "bn" ? "ডাউনলোড আর্ট" : "Download Artwork"}
                  </a>
                  <button
                    onClick={() => {
                      setMotionImage(artResult);
                      setMotionMime("image/png");
                      setActiveTab("motion");
                    }}
                    className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>{currentLanguage === "bn" ? "এটি দিয়ে ভিডিও তৈরি" : "Animate to Video"}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SCENT MOTION (VEO VIDEO GENERATION) */}
        {activeTab === "motion" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="motion-tab-panel">
            {/* Veo configurer */}
            <div className="bg-zinc-950/40 p-6 rounded-lg border border-zinc-900 text-left space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-zinc-900">
                  <Video size={16} className="text-amber-500" />
                  <div>
                    <h3 className="text-sm font-serif font-bold text-white">
                      {currentLanguage === "bn" ? "সেন্ট মোশন (Veo এনিমেশন)" : "Scent Motion (Veo Generator)"}
                    </h3>
                    <p className="text-[10px] text-zinc-500">
                      {currentLanguage === "bn" ? "ছবি আপলোড করুন এবং প্রম্পট দিয়ে প্রমোশনাল সিনেমার মত ভিডিও তৈরি করুন।" : "Upload a starting frame and direct a promotional cinematic clip with Veo."}
                    </p>
                  </div>
                </div>

                {/* Starting Frame Upload Zone */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                    {currentLanguage === "bn" ? "স্টার্ট ফ্রেম ছবি (ঐচ্ছিক)" : "Starting Frame Image (Optional)"}
                  </label>
                  <div 
                    onClick={() => motionFileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-900 hover:border-amber-500/20 bg-zinc-950/80 p-5 rounded-lg text-center cursor-pointer transition-all space-y-2 flex flex-col items-center justify-center"
                  >
                    <input 
                      type="file" 
                      ref={motionFileInputRef} 
                      onChange={handleMotionImageUpload} 
                      accept="image/*" 
                      className="hidden"
                    />
                    {motionImage ? (
                      <div className="relative group w-full max-h-[100px] flex justify-center overflow-hidden rounded">
                        <img src={motionImage} alt="Video start frame" className="object-contain max-h-[90px] rounded" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-semibold text-amber-500">
                          {currentLanguage === "bn" ? "ছবি পরিবর্তন" : "Change Frame"}
                        </div>
                      </div>
                    ) : (
                      <>
                        <FileImage size={20} className="text-zinc-600" />
                        <span className="text-[11px] text-zinc-400 font-bold">{currentLanguage === "bn" ? "স্টার্ট ইমেজ আপলোড করুন" : "Upload Start Frame"}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                    {currentLanguage === "bn" ? "ভিডিও নির্দেশাবলী (Director's Prompt) *" : "Director's Motion Prompt *"}
                  </label>
                  <textarea
                    rows={3}
                    value={motionPrompt}
                    onChange={(e) => setMotionPrompt(e.target.value)}
                    placeholder={currentLanguage === "bn" 
                      ? "যেমন: গোল্ডেন পারফিউম কণা বাতাসে ভাসছে, রোমান্টিক রাজকীয় গোল্ডেন লাইটিং, স্লো-মোশন ধোঁয়া এবং আভিজাত্য।" 
                      : "e.g. Luxurious golden fragrance liquid drops dispersing in ultra slow-motion, soft steam rising, sparkling bokeh and atmospheric macro lighting, 16:9."}
                    className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/40 font-medium leading-relaxed"
                  />
                </div>

                {/* Aspect Ratio */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                    {currentLanguage === "bn" ? "ভিডিও অ্যাসপেক্ট রেশিও" : "Video Aspect Ratio"}
                  </label>
                  <select
                    value={motionAspectRatio}
                    onChange={(e) => setArtVideoRatio(e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/40 font-semibold"
                  >
                    <option value="16:9">16:9 Cinematic Landscape (Youtube, Screen)</option>
                    <option value="9:16">9:16 Royal Portrait (Instagram, Reels, Shorts)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateVideo}
                disabled={!motionPrompt.trim() || isMotionLoading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 mt-4"
              >
                {isMotionLoading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>{currentLanguage === "bn" ? "সিনেমেটিক ভিডিও তৈরি হচ্ছে..." : "Directing Veo Fast-Gen..."}</span>
                  </>
                ) : (
                  <>
                    <Video size={13} />
                    <span>{currentLanguage === "bn" ? "প্রোমোশনাল ভিডিও তৈরি করুন" : "Generate Promotional Video"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Veo video result display */}
            <div className="bg-zinc-950/40 p-6 rounded-lg border border-zinc-900 text-left flex flex-col justify-between min-h-[400px]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-900">
                  <Video className="text-amber-500" size={15} />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {currentLanguage === "bn" ? "রেন্ডারড প্রমোশনাল ভিডিও" : "Rendered Cinematic Preview"}
                  </span>
                </div>

                {motionResultUrl ? (
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="border border-zinc-900 rounded overflow-hidden shadow-2xl shadow-black w-full max-h-[280px] bg-black flex items-center justify-center">
                      <video 
                        src={motionResultUrl} 
                        controls 
                        autoPlay 
                        loop 
                        className="object-contain w-full max-h-[270px]"
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500 italic text-center">{motionPrompt}</p>
                  </div>
                ) : (
                  <div className="text-center py-24 text-zinc-600 text-xs">
                    {isMotionLoading ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 size={24} className="animate-spin text-amber-500" />
                        <span className="font-semibold text-zinc-300 animate-pulse text-center max-w-[250px]">{motionStatus}</span>
                      </div>
                    ) : (
                      <span>{currentLanguage === "bn" ? "বাম পাশে ডিরেকশন প্রম্পট দিয়ে জেনারেট বাটনে ক্লিক করুন।" : "Provide direction specs and click generate to visualize your clip."}</span>
                    )}
                  </div>
                )}
              </div>

              {motionResultUrl && (
                <a
                  href={motionResultUrl}
                  download="al_barakah_scent_promotion.mp4"
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded text-center transition-all cursor-pointer shadow-lg shadow-amber-500/10 mt-4 inline-block"
                >
                  {currentLanguage === "bn" ? "ডাউনলোড ভিডিও ফাইল" : "Download Promotion Video"}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
