import { Product } from '../types';

export const initialProducts: Product[] = [
  {
    id: 'attar-royal-amber',
    name: 'Al-Haramain Royal Amber',
    nameTrans: {
      bn: 'আল-হারামাইন রয়্যাল আম্বার',
      en: 'Al-Haramain Royal Amber'
    },
    description: 'A rich, deep, and long-lasting luxury sweet amber attar. Prepared with 100% alcohol-free concentration, featuring base notes of warm musk, sweet vanilla, and rich amber.',
    descriptionTrans: {
      bn: 'একটি সমৃদ্ধ, গভীর এবং দীর্ঘস্থায়ী বিলাসবহুল মিষ্টি আম্বার আতর। ১০০% অ্যালকোহল মুক্ত, যাতে রয়েছে উষ্ণ কস্তুরী (মুস্ক), মিষ্টি ভ্যানিলা এবং সমৃদ্ধ আম্বারের মন মাতানো সুবাস। এটি আপনাকে দেবে দিনভর রাজকীয় অনুভূতি।',
      en: 'A rich, deep, and long-lasting luxury sweet amber attar. Prepared with 100% alcohol-free concentration, featuring base notes of warm musk, sweet vanilla, and rich amber.'
    },
    price: 1850,
    discountPrice: 1550,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'attar',
    stock: 25,
    rating: 4.9,
    reviewsCount: 38,
    isBestSeller: true,
    discountBadge: '১৬% ছাড়',
    sizeOrVolume: ['৩ মিলি', '৬ মিলি', '১২ মিলি'],
    notes: 'Sweet Amber, Vanilla, Warm Musk'
  },
  {
    id: 'attar-kashmiri-oud',
    name: 'Kashmiri Oud Premium',
    nameTrans: {
      bn: 'কাশ্মীরি উদ প্রিমিয়াম',
      en: 'Kashmiri Oud Premium'
    },
    description: 'Pure, smoky and highly intense Kashmiri Oud. Prepared from selected dark wood chips. Gives a traditional and rich Arabic feel. 100% Alcohol-Free.',
    descriptionTrans: {
      bn: 'বিশুদ্ধ, ধোঁয়াটে এবং অত্যন্ত তীব্র কাশ্মীরি উদ আতর। নির্বাচিত গভীর ও খাঁটি কাঠের নির্যাস থেকে তৈরি। এটি আপনাকে দেবে ঐতিহ্যবাহী এবং অত্যন্ত রাজকীয় আরবীয় অনুভূতি। ১০০% অ্যালকোহল মুক্ত।',
      en: 'Pure, smoky and highly intense Kashmiri Oud. Prepared from selected dark wood chips. Gives a traditional and rich Arabic feel. 100% Alcohol-Free.'
    },
    price: 3200,
    discountPrice: 2800,
    images: [
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'attar',
    stock: 12,
    rating: 5.0,
    reviewsCount: 47,
    isBestSeller: true,
    discountBadge: 'সেরা অফার',
    sizeOrVolume: ['৩ মিলি', '৬ মিলি', '১২ মিলি'],
    notes: 'Deep Smoky Wood, Aged Agarwood, Dark Musk'
  },
  {
    id: 'attar-white-musk',
    name: 'White Musk Luxury',
    nameTrans: {
      bn: 'হোয়াইট মুস্ক লাক্সারি',
      en: 'White Musk Luxury'
    },
    description: 'Clean, powdery, soft, and fresh White Musk. Loved by all for daily wear and prayer. Extremely light and refreshing scent, perfect for humid Bangladeshi weather.',
    descriptionTrans: {
      bn: 'পরিচ্ছন্ন, পাউডারি, নরম এবং একদম ফ্রেশ হোয়াইট মুস্ক (সাদা কস্তুরী)। প্রতিদিন ব্যবহারের এবং সালাতের জন্য সবার প্রিয়। অত্যন্ত হালকা এবং সতেজ ঘ্রাণ, যা বাংলাদেশের আর্দ্র আবহাওয়ার জন্য চমৎকার উপযোগী।',
      en: 'Clean, powdery, soft, and fresh White Musk. Loved by all for daily wear and prayer. Extremely light and refreshing scent, perfect for humid Bangladeshi weather.'
    },
    price: 1200,
    discountPrice: 990,
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'attar',
    stock: 40,
    rating: 4.8,
    reviewsCount: 65,
    discountBadge: '১৮% ছাড়',
    sizeOrVolume: ['৩ মিলি', '৬ মিলি', '১২ মিলি'],
    notes: 'Clean Cotton, Light Powdery Musk, White Floral'
  },
  {
    id: 'glasses-dubai-gold',
    name: 'Dubai Gold Edition Sunglasses',
    nameTrans: {
      bn: 'দুবাই গোল্ড এডিশন সানগ্লাস',
      en: 'Dubai Gold Edition Sunglasses'
    },
    description: 'Exquisite gold-plated frame with high quality polarized lenses. Designed for an absolute premium aesthetic. Provides 100% UV400 protection.',
    descriptionTrans: {
      bn: 'চমৎকার স্বর্ণালি প্রলেপযুক্ত ফ্রেম এবং হাই-কোয়ালিটি পোলারাইজড লেন্সের মেলবন্ধন। এটি আপনাকে দেবে এক অতুলনীয় প্রিমিয়াম এবং আভিজাত্যপূর্ণ লুক। সাথে রয়েছে ১০০% ইউভি৪০০ রোদ সুরক্ষা।',
      en: 'Exquisite gold-plated frame with high quality polarized lenses. Designed for an absolute premium aesthetic. Provides 100% UV400 protection.'
    },
    price: 2450,
    discountPrice: 1950,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'sunglasses',
    stock: 15,
    rating: 4.9,
    reviewsCount: 29,
    isBestSeller: true,
    discountBadge: 'জনপ্রিয়',
    sizeOrVolume: ['Standard Fit'],
    notes: '24k Gold Plated Alloy Frame, Polarized Brown Lenses'
  },
  {
    id: 'glasses-midnight-aviator',
    name: 'Midnight Matte Black Sunglasses',
    nameTrans: {
      bn: 'মিডনাইট ম্যাট ব্ল্যাক সানগ্লাস',
      en: 'Midnight Matte Black Sunglasses'
    },
    description: 'Classic aviator design in elegant matte black frame with luxury gold-tinted accents. Ultra-premium durability with impact resistant lenses.',
    descriptionTrans: {
      bn: 'ক্ল্যাসিক এভিয়েটর ডিজাইনে তৈরি চমৎকার ম্যাট ব্ল্যাক ফ্রেম এবং লাক্সারি গোল্ড-টিন্টেড ডিটেইলিং। চমৎকার স্থায়িত্ব এবং ইমপ্যাক্ট-রেজিস্ট্যান্ট লেন্সের কারণে এটি ব্যবহারের জন্য সেরা।',
      en: 'Classic aviator design in elegant matte black frame with luxury gold-tinted accents. Ultra-premium durability with impact resistant lenses.'
    },
    price: 2200,
    discountPrice: 1750,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'sunglasses',
    stock: 18,
    rating: 4.7,
    reviewsCount: 22,
    discountBadge: 'সীমিত স্টক',
    sizeOrVolume: ['Standard Fit'],
    notes: 'Premium Matte Alloy, Polarized Dark G15 Lenses'
  },
  {
    id: 'islamic-royal-mat',
    name: 'Al-Barakah Royal Prayer Mat',
    nameTrans: {
      bn: 'আল-বারাকাহ রয়্যাল জায়নামাজ',
      en: 'Al-Barakah Royal Prayer Mat'
    },
    description: 'Double-cushioned premium prayer mat in velvet texture with gold embroidery. Keeps knees completely comfortable during Sajdah.',
    descriptionTrans: {
      bn: 'ডাবল কুশনযুক্ত এবং ঘন মখমল কাপড়ে তৈরি প্রিমিয়াম জায়নামাজ। এতে রয়েছে নিখুঁত এবং আকর্ষণীয় সোনালি কারুকাজ। সিজদার সময়ে হাঁটুতে চমৎকার আরাম দেবে এই রয়্যাল জায়নামাজ।',
      en: 'Double-cushioned premium prayer mat in velvet texture with gold embroidery. Keeps knees completely comfortable during Sajdah.'
    },
    price: 2900,
    discountPrice: 2400,
    images: [
      'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'islamic',
    stock: 10,
    rating: 5.0,
    reviewsCount: 51,
    isBestSeller: true,
    discountBadge: 'লাক্সারি কালেকশন',
    sizeOrVolume: ['110cm x 70cm'],
    notes: 'Premium Turkish Velvet, Memory Foam Orthopedic Inner'
  },
  {
    id: 'islamic-sandalwood-tasbih',
    name: 'Agate Wood Premium Tasbih (99)',
    nameTrans: {
      bn: 'আগেট উড প্রিমিয়াম তাসবিহ (৯৯ দানা)',
      en: 'Agate Wood Premium Tasbih (99)'
    },
    description: 'Handcrafted premium tasbih using high grade polished natural agate stones and sandalwood beads. Scented with gentle sandalwood aroma.',
    descriptionTrans: {
      bn: 'উচ্চমানের মসৃণ প্রাকৃতিক আগেট পাথর এবং চন্দন কাঠের নির্যাসযুক্ত দানা দিয়ে হাতে তৈরি প্রিমিয়াম তাসবিহ। মৃদু চন্দনের মন মাতানো সুবাসযুক্ত ৯৯ দানার এই তাসবিহ জিকিরের জন্য অত্যন্ত আরামদায়ক।',
      en: 'Handcrafted premium tasbih using high grade polished natural agate stones and sandalwood beads. Scented with gentle sandalwood aroma.'
    },
    price: 1100,
    discountPrice: 850,
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'islamic',
    stock: 35,
    rating: 4.9,
    reviewsCount: 31,
    discountBadge: 'হাতে তৈরি',
    sizeOrVolume: ['99 Beads (8mm)'],
    notes: 'Natural Agate Stone, Scented Mysore Sandalwood, Silk Tassel'
  },
  {
    id: 'accessories-bukhoor-burner',
    name: 'Royal Incense Bukhoor Burner Set',
    nameTrans: {
      bn: 'রয়্যাল বুকহুর ধূপদানি সেট',
      en: 'Royal Incense Bukhoor Burner Set'
    },
    description: 'Dubai style golden metal incense burner with a container of premium sweet amber bukhoor wood chips.',
    descriptionTrans: {
      bn: 'দুবাই স্টাইলের রাজকীয় সোনালি মেটাল ধূপদানি এবং সাথে এক কৌটা প্রিমিয়াম সুইট আম্বার বুকহুর কাঠের কুচি। এটি আপনার ঘরে তৈরি করবে পবিত্র, সুগন্ধী এবং প্রশান্তিময় এক আরবীয় পরিবেশ।',
      en: 'Dubai style golden metal incense burner with a container of premium sweet amber bukhoor wood chips.'
    },
    price: 3500,
    discountPrice: 2950,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'accessories',
    stock: 8,
    rating: 4.8,
    reviewsCount: 14,
    discountBadge: 'কম্বো অফার',
    sizeOrVolume: ['Standard Set'],
    notes: 'Heavy Brass Alloy Burner, 50g Premium Bukhoor Chips'
  },
  {
    id: 'womens-dubai-abaya',
    name: 'Premium Royal Dubai Abaya',
    nameTrans: {
      bn: 'প্রিমিয়াম রয়্যাল দুবাই আবায়া',
      en: 'Premium Royal Dubai Abaya'
    },
    description: 'Elegant Dubai premium silk georgette black abaya with gold embroidery. Exquisite craftsmanship with soft lightweight fabric.',
    descriptionTrans: {
      bn: 'মনোমুগ্ধকর ও আভিজাত্যপূর্ণ কালো জর্জেট কাপড়ে তৈরি সোনালি সুতার সূচিকর্মযুক্ত রয়্যাল দুবাই আবায়া (বোরকা)। অত্যন্ত আরামদায়ক ও প্রিমিয়াম ডিজাইনের এই আবায়া পরলে আপনাকে লাগবে অনন্য সাধারণ।',
      en: 'Elegant Dubai premium silk georgette black abaya with gold embroidery. Exquisite craftsmanship with soft lightweight fabric.'
    },
    price: 4500,
    discountPrice: 3800,
    images: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'womens',
    stock: 15,
    rating: 4.9,
    reviewsCount: 18,
    isBestSeller: true,
    discountBadge: '১৫% ছাড়',
    sizeOrVolume: ['52', '54', '56'],
    notes: 'Premium Cherry Georgette, Metallic Thread Embroidery'
  },
  {
    id: 'womens-chiffon-hijab',
    name: 'Premium Chiffon Georgette Hijab',
    nameTrans: {
      bn: 'প্রিমিয়াম শিফন জর্জেট হিজাব',
      en: 'Premium Chiffon Georgette Hijab'
    },
    description: 'Light, breathable, non-slipping premium quality georgette hijab. Perfect for any formal or daily event.',
    descriptionTrans: {
      bn: 'হালকা, বাতাস চলাচল করতে পারে এমন এবং পিছলে না যাওয়া প্রিমিয়াম কোয়ালিটির শিফন জর্জেট হিজাব। যেকোনো ফরমাল অনুষ্ঠান কিংবা প্রতিদিনের সালাত ও চলাফেরার জন্য একদম উপযুক্ত।',
      en: 'Light, breathable, non-slipping premium quality georgette hijab. Perfect for any formal or daily event.'
    },
    price: 650,
    discountPrice: 480,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'womens',
    stock: 50,
    rating: 4.8,
    reviewsCount: 42,
    discountBadge: 'বিশেষ ছাড়',
    sizeOrVolume: ['Standard Size (75" x 30")'],
    notes: 'Pure Breathable Georgette, Laser Cut Edges'
  },
  {
    id: 'baby-wooden-blocks',
    name: 'Premium Wooden Educational Blocks Set',
    nameTrans: {
      bn: 'বাচ্চাদের কাঠের এডুকেশনাল ব্লক সেট',
      en: 'Premium Wooden Educational Blocks Set'
    },
    description: 'Made of 100% natural organic solid wood, colored with non-toxic child-safe water paint. Inspires kids creativity, motor skills and hand-eye coordination.',
    descriptionTrans: {
      bn: '১০০% প্রাকৃতিকভাবে সংগৃহীত জৈব কাঠ দ্বারা তৈরি এবং সম্পূর্ণ বিষাক্ত উপাদানমুক্ত সোনামণিদের জন্য নিরাপদ ওয়াটার কালারে রঞ্জিত এডুকেশনাল ব্লক সেট। এটি বাচ্চাদের হাতের ও চোখের সমন্বয় বাড়াবে এবং সৃজনশীলতা বৃদ্ধি করবে।',
      en: 'Made of 100% natural organic solid wood, colored with non-toxic child-safe water paint. Inspires kids creativity, motor skills and hand-eye coordination.'
    },
    price: 1800,
    discountPrice: 1450,
    images: [
      'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'baby_toys',
    stock: 20,
    rating: 5.0,
    reviewsCount: 12,
    isBestSeller: true,
    discountBadge: 'স্মার্ট চয়েস',
    sizeOrVolume: ['50-Piece Set'],
    notes: 'Premium Organic Pine Wood, Safe Non-Toxic Paint'
  },
  {
    id: 'baby-arabic-pad',
    name: 'Interactive Arabic & Salat Learning Pad',
    nameTrans: {
      bn: 'ইন্টারেক্টিভ আরবিক ও সালাত লার্নিং প্যাড',
      en: 'Interactive Arabic & Salat Learning Pad'
    },
    description: 'Interactive early education tablet with sounds to teach children Arabic letters, Quranic surahs, daily duas and how to perform prayers step-by-step.',
    descriptionTrans: {
      bn: 'সোনামণিদের আনন্দের সাথে সালাতের নিয়মাবলী, আরবি হরফ, ছোট সূরা এবং দৈনন্দিন জীবনের দুআ শিখতে সাহায্য করার জন্য বিশেষ ইন্টারেক্টিভ লার্নিং সাউন্ড ট্যাবলেট প্যাড।',
      en: 'Interactive early education tablet with sounds to teach children Arabic letters, Quranic surahs, daily duas and how to perform prayers step-by-step.'
    },
    price: 1200,
    discountPrice: 950,
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'baby_toys',
    stock: 30,
    rating: 4.9,
    reviewsCount: 25,
    discountBadge: 'বেস্ট সেলার',
    sizeOrVolume: ['Battery Operated'],
    notes: 'Eco-friendly ABS Plastic, Clear Bengali & Arabic Voice Guideline'
  },
  {
    id: 'fruit-ajwa-dates',
    name: 'Premium Saudi Ajwa Dates',
    nameTrans: {
      bn: 'প্রিমিয়াম সৌদি আজওয়া খেজুর',
      en: 'Premium Saudi Ajwa Dates'
    },
    description: '100% organic, hand-picked premium quality Saudi Ajwa dates. Rich in iron, fiber, and natural sweetness. Packaged hygienically to keep nutrients intact.',
    descriptionTrans: {
      bn: '১০০% অর্গানিক এবং স্বাস্থ্যের জন্য অত্যন্ত উপকারী প্রিমিয়াম কোয়ালিটি সৌদি আজওয়া খেজুর। আয়রন, ফাইবার ও প্রাকৃতিক পুষ্টিগুণে ভরপুর। অত্যন্ত স্বাস্থ্যসম্মত উপায়ে প্যাকেটজাতকৃত।',
      en: '100% organic, hand-picked premium quality Saudi Ajwa dates. Rich in iron, fiber, and natural sweetness. Packaged hygienically to keep nutrients intact.'
    },
    price: 950,
    discountPrice: 850,
    images: [
      'https://images.unsplash.com/photo-1569870499705-504209102861?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'organic_fruits',
    stock: 50,
    rating: 4.9,
    reviewsCount: 34,
    isBestSeller: true,
    discountBadge: 'পুষ্টিগুণে ভরপুর',
    sizeOrVolume: ['৫০০ গ্রাম', '১ কেজি'],
    notes: '100% Organic, Imported from Madinah, Saudi Arabia'
  },
  {
    id: 'fruit-honey-nuts',
    name: 'Organic Honey Mixed Nuts',
    nameTrans: {
      bn: 'অর্গানিক হানি নাটস (মধু মিশ্রিত বাদাম)',
      en: 'Organic Honey Mixed Nuts'
    },
    description: 'A powerful blend of premium organic almonds, cashews, walnuts, pistachios, raisins, and pumpkin seeds soaked in 100% pure organic wild honey.',
    descriptionTrans: {
      bn: 'আল-বারাকাহ খাঁটি সুন্দরবনের মধু এবং প্রিমিয়াম কোয়ালিটির কাজুবাদাম, কাঠবাদাম, পেস্তাবাদাম, আখরোট, কিশমিশ এবং কুমড়ো বীজের এক অপূর্ব পুষ্টিকর মিশ্রণ। সম্পূর্ণ প্রাকৃতিক শক্তিদায়ক খাদ্য।',
      en: 'A powerful blend of premium organic almonds, cashews, walnuts, pistachios, raisins, and pumpkin seeds soaked in 100% pure organic wild honey.'
    },
    price: 1350,
    discountPrice: 1150,
    images: [
      'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'organic_fruits',
    stock: 45,
    rating: 4.8,
    reviewsCount: 29,
    discountBadge: 'এনার্জি বুস্টার',
    sizeOrVolume: ['৫০০ গ্রাম', '১ কেজি'],
    notes: 'Premium nuts infused in Raw Forest Honey'
  },
  {
    id: 'fruit-mango',
    name: 'Organic Rajshahi Himsagar Mango',
    nameTrans: {
      bn: 'অর্গানিক রাজশাহী হিমসাগর আম',
      en: 'Organic Rajshahi Himsagar Mango'
    },
    description: 'Fresh, sweet, and completely naturally ripened Himsagar mangoes from organic orchards in Rajshahi. Absolutely chemical and formalin-free.',
    descriptionTrans: {
      bn: 'রাজশাহীর নিজস্ব বাগান থেকে সরাসরি সংগৃহীত সম্পূর্ণ কেমিক্যাল ও ফরমালিন মুক্ত মিষ্টি ও সুস্বাদু হিমসাগর আম। প্রাকৃতিক উপায়ে পাকানো এবং ১০০% নিরাপদ।',
      en: 'Fresh, sweet, and completely naturally ripened Himsagar mangoes from organic orchards in Rajshahi. Absolutely chemical and formalin-free.'
    },
    price: 180,
    discountPrice: 140,
    images: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'organic_fruits',
    stock: 120,
    rating: 5.0,
    reviewsCount: 55,
    isBestSeller: true,
    discountBadge: 'তাজা ফল',
    sizeOrVolume: ['৫ কেজি ক্যারেট', '১০ কেজি ক্যারেট'],
    notes: 'Chemical-free, Freshly harvested from Rajshahi'
  },
  {
    id: 'med-black-seed-oil',
    name: 'Pure Cold Pressed Black Seed Oil',
    nameTrans: {
      bn: 'শতভাগ খাঁটি কোল্ড প্রেসড কালোজিরা তেল',
      en: 'Pure Cold Pressed Black Seed Oil'
    },
    description: '100% pure cold-pressed black seed (Kalonji) oil. Sourced from organic seeds, extremely beneficial for boosting immunity, hair health, skin care, and respiratory wellness.',
    descriptionTrans: {
      bn: '১০০% বিশুদ্ধ কোল্ড-প্রেসড কালোজিরা তেল। প্রাকৃতিক কালোজিরা বীজ থেকে তৈরি, যা রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি, চুলের যত্ন, ত্বকের উজ্জ্বলতা এবং শ্বাসকষ্টের উপশমে অত্যন্ত কার্যকরী।',
      en: '100% pure cold-pressed black seed (Kalonji) oil. Sourced from organic seeds, extremely beneficial for boosting immunity, hair health, skin care, and respiratory wellness.'
    },
    price: 450,
    discountPrice: 380,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'medicine',
    stock: 75,
    rating: 4.9,
    reviewsCount: 42,
    isBestSeller: true,
    discountBadge: 'সর্ব রোগের মহৌষধ',
    sizeOrVolume: ['১০০ মিলি', '২৫০ মিলি'],
    notes: '100% Pure & Solvent-Free Cold Pressed Extract'
  },
  {
    id: 'med-ginseng-honey',
    name: 'Premium Ginseng Infused Herbal Honey',
    nameTrans: {
      bn: 'প্রিমিয়াম জিনসেং ও ভেষজ মিশ্রিত মধু',
      en: 'Premium Ginseng Infused Herbal Honey'
    },
    description: 'Premium raw forest honey infused with top-grade red ginseng and organic herbal extracts. Boosts energy, stamina, physical strength, and mental performance naturally.',
    descriptionTrans: {
      bn: 'প্রাকৃতিক বনের খাঁটি মধুর সাথে প্রিমিয়াম কোয়ালিটি রেড জিনসেং ও ভেষজ নির্যাসের বৈজ্ঞানিক মিশ্রণ। এটি প্রাকৃতিকভাবে শরীরের ক্লান্তি দূর করে এনার্জি, স্ট্যামিনা ও কার্যক্ষমতা বাড়িয়ে তোলে।',
      en: 'Premium raw forest honey infused with top-grade red ginseng and organic herbal extracts. Boosts energy, stamina, physical strength, and mental performance naturally.'
    },
    price: 1650,
    discountPrice: 1450,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'medicine',
    stock: 30,
    rating: 4.8,
    reviewsCount: 19,
    discountBadge: 'এনার্জি ও স্ট্যামিনা',
    sizeOrVolume: ['৫০০ গ্রাম'],
    notes: 'Premium Siberian Red Ginseng in Raw Wild Honey'
  },
  {
    id: 'med-shilajit',
    name: 'Pure Himalayan Shilajit Resin',
    nameTrans: {
      bn: 'হিমালয়ান পিউর শিলাজিৎ রজন (প্রাকৃতিক সাপ্লিমেন্ট)',
      en: 'Pure Himalayan Shilajit Resin'
    },
    description: '100% natural, purified Himalayan Shilajit resin. Packed with fulvic acid and 84+ trace minerals. Promotes cellular energy, cognitive function, and male wellness.',
    descriptionTrans: {
      bn: 'হিমালয় পর্বতমালা থেকে সংগৃহীত ১০০% প্রাকৃতিক ও পরিশোধিত শিলাজিৎ রজন (রিসিন)। এতে রয়েছে ফুলভিক অ্যাসিড এবং ৮৪টিরও বেশি খনিজ উপাদান, যা বার্ধক্য রোধে ও হরমোন ব্যালেন্স করতে অত্যন্ত উপকারী।',
      en: '100% natural, purified Himalayan Shilajit resin. Packed with fulvic acid and 84+ trace minerals. Promotes cellular energy, cognitive function, and male wellness.'
    },
    price: 2200,
    discountPrice: 1850,
    images: [
      'https://images.unsplash.com/photo-1611070973770-b1a672610041?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'medicine',
    stock: 25,
    rating: 4.7,
    reviewsCount: 15,
    discountBadge: 'শতভাগ বিশুদ্ধ',
    sizeOrVolume: ['১৫ গ্রাম', '৩০ গ্রাম'],
    notes: 'Sourced from Altay Mountains at 16,000 ft altitude'
  },
  {
    id: 'watch-royal-gold',
    name: 'Al-Barakah Royal Gold Watch',
    nameTrans: {
      bn: 'আল-বারাকাহ রয়্যাল গোল্ড হাত ঘড়ি',
      en: 'Al-Barakah Royal Gold Watch'
    },
    description: 'Sophisticated gold-plated wrist watch designed for luxury and durability. Features an exquisite dial and automatic quartz movement.',
    descriptionTrans: {
      bn: 'অভিজাত সোনালি প্রলেপযুক্ত প্রিমিয়াম হাত ঘড়ি। আকর্ষণীয় ডায়াল এবং নিখুঁত জাপান কোয়ার্টজ মুভমেন্টের সমন্বয়ে তৈরি যা দীর্ঘস্থায়ী ও রাজকীয় আভিজাত্য প্রকাশ করে।',
      en: 'Sophisticated gold-plated wrist watch designed for luxury and durability. Features an exquisite dial and automatic quartz movement.'
    },
    price: 4500,
    discountPrice: 3800,
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'watches',
    stock: 12,
    rating: 5.0,
    reviewsCount: 24,
    isBestSeller: true,
    discountBadge: 'লাক্সারি কালেকশন',
    sizeOrVolume: ['Standard Adjustable'],
    notes: 'Premium Gold Finish, Japan Quartz Movement, Water Resistant'
  },
  {
    id: 'watch-luxury-leather',
    name: 'Kurren Luxury Leather Watch',
    nameTrans: {
      bn: 'কুরেন লাক্সারি লেদার হাত ঘড়ি',
      en: 'Kurren Luxury Leather Watch'
    },
    description: 'Classic genuine leather strap watch with a minimal design. Perfectly complements both formal and casual attire.',
    descriptionTrans: {
      bn: 'খাঁটি চামড়ার বেল্ট সমৃদ্ধ ক্লাসিক ও মিনিমাল ডিজাইনের হাত ঘড়ি। ফরমাল এবং ক্যাজুয়াল সব ধরনের পোশাকের সাথেই চমৎকার মানানসই ও ব্যবহারকারীকে দেয় স্মার্ট লুক।',
      en: 'Classic genuine leather strap watch with a minimal design. Perfectly complements both formal and casual attire.'
    },
    price: 2200,
    discountPrice: 1750,
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'watches',
    stock: 20,
    rating: 4.8,
    reviewsCount: 16,
    discountBadge: 'বিশেষ অফার',
    sizeOrVolume: ['Standard Fit'],
    notes: 'Genuine Leather Strap, Classic Dial, Scratch Resistant'
  },
  {
    id: 'watch-silver-chronograph',
    name: 'Royal Chronograph Silver Watch',
    nameTrans: {
      bn: 'রয়্যাল ক্রোনোগ্রাফ সিলভার হাত ঘড়ি',
      en: 'Royal Chronograph Silver Watch'
    },
    description: 'Premium silver stainless steel chronograph watch. Built with ultimate craftsmanship for an outstanding aesthetic.',
    descriptionTrans: {
      bn: 'স্টেইনলেস স্টিলের গর্জিয়াস ক্রোনোগ্রাফ সিলভার হাত ঘড়ি। আভিজাত্যপূর্ণ ডিজাইনের এই ঘড়িটি দৈনন্দিন ব্যবহারের জন্য চমৎকার এবং আভিজাত্য ফুটিয়ে তোলে।',
      en: 'Premium silver stainless steel chronograph watch. Built with ultimate craftsmanship for an outstanding aesthetic.'
    },
    price: 3500,
    discountPrice: 2950,
    images: [
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'watches',
    stock: 15,
    rating: 4.9,
    reviewsCount: 32,
    discountBadge: 'জনপ্রিয়',
    sizeOrVolume: ['Standard Adjustable'],
    notes: 'Stainless Steel Band, Chronograph Dial, Luminous Hands'
  }
];
