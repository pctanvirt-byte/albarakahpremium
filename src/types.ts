export interface TranslatedText {
  bn: string;
  en: string;
}

export interface Product {
  id: string;
  name: string; // fallback
  nameTrans: TranslatedText;
  description: string; // fallback
  descriptionTrans: TranslatedText;
  price: number;
  discountPrice?: number;
  images: string[];
  category: 'attar' | 'sunglasses' | 'accessories' | 'islamic' | 'womens' | 'baby_toys' | 'organic_fruits' | 'medicine';
  stock: number;
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  discountBadge?: string;
  sizeOrVolume?: string[]; // e.g. ["3ml", "6ml", "12ml"] or ["M", "L"]
  notes?: string; // Scent profile for attar, frame/lens details for sunglasses
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  image: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  area: 'inside_dhaka' | 'outside_dhaka';
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'bank' | 'cod';
  paymentNumber?: string; // sender number for bKash/Nagad/Rocket
  transactionId?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  courier?: 'pathao' | 'steadfast';
  courierTrackingId?: string;
  courierStatus?: string;
  createdAt: string;
}

export interface User {
  id: string;
  phone: string;
  email?: string;
  name: string;
  address?: string;
  createdAt: string;
  wishlistProductIds?: string[];
}

export type Language = 'bn' | 'en';
