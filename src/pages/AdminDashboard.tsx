import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, User } from '../types';
import { initialProducts } from '../data/initialProducts';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Loader2,
  FileSpreadsheet,
  Truck,
  Printer,
  Copy,
  Check
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentLanguage, 
    products, 
    orders, 
    usersList, 
    adminLoggedIn, 
    setAdminLoggedIn, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus,
    updateOrderCourier,
    deleteOrder,
    deleteUser,
    resetStoreData
  } = useApp();

  // Authentication states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // 🔷 COURIER BOOKING STATES
  const [bookingOrder, setBookingOrder] = useState<Order | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<'pathao' | 'steadfast'>('pathao');
  
  // Pathao form inputs
  const [pathaoStore, setPathaoStore] = useState('Al Barakah Premium Central Hub');
  const [pathaoZone, setPathaoZone] = useState('Dhaka City');
  const [pathaoWeight, setPathaoWeight] = useState('0.5');
  const [pathaoType, setPathaoType] = useState('Standard');
  
  // Steadfast form inputs
  const [steadfastStore, setSteadfastStore] = useState('Al Barakah Premium Store');
  const [steadfastNote, setSteadfastNote] = useState('Handle with care, premium attar/perfume bottles inside');
  
  // Booking status simulation states
  const [isBooking, setIsBooking] = useState(false);
  const [bookingLogs, setBookingLogs] = useState<string[]>([]);
  
  // Printing label state
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  
  // Copy state for tracking code
  const [copiedTrackingId, setCopiedTrackingId] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'customers'>('analytics');

  // Modal / Form States for Products
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields for Add/Edit product
  const [pNameEn, setPNameEn] = useState('');
  const [pNameBn, setPNameBn] = useState('');
  const [pDescEn, setPDescEn] = useState('');
  const [pDescBn, setPDescBn] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pDiscountPrice, setPDiscountPrice] = useState('');
  const [pCategory, setPCategory] = useState<'attar' | 'sunglasses' | 'accessories' | 'islamic'>('attar');
  const [pStock, setPStock] = useState('');
  const [pImages, setPImages] = useState(''); // comma-separated URLs
  const [pDiscountBadge, setPDiscountBadge] = useState('');
  const [pNotes, setPNotes] = useState('');
  const [pSizes, setPSizes] = useState(''); // comma-separated

  // Handle Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (username === 'AlBarakahpremium' && password === 'Delwar1212') {
      setAdminLoggedIn(true);
    } else {
      setAuthError(currentLanguage === 'bn' ? 'ভুল ইউজারনেম অথবা পাসওয়ার্ড!' : 'Invalid username or password!');
    }
  };

  const handleAdminLogout = () => {
    setAdminLoggedIn(false);
  };

  // 🔷 PRODUCT ACTIONS
  const openAddProductModal = () => {
    setEditingProduct(null);
    setPNameEn('');
    setPNameBn('');
    setPDescEn('');
    setPDescBn('');
    setPPrice('');
    setPDiscountPrice('');
    setPCategory('attar');
    setPStock('');
    setPImages('');
    setPDiscountBadge('');
    setPNotes('');
    setPSizes('');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProduct(p);
    setPNameEn(p.nameTrans.en);
    setPNameBn(p.nameTrans.bn);
    setPDescEn(p.descriptionTrans.en);
    setPDescBn(p.descriptionTrans.bn);
    setPPrice(p.price.toString());
    setPDiscountPrice(p.discountPrice?.toString() || '');
    setPCategory(p.category);
    setPStock(p.stock.toString());
    setPImages(p.images.join(', '));
    setPDiscountBadge(p.discountBadge || '');
    setPNotes(p.notes || '');
    setPSizes(p.sizeOrVolume?.join(', ') || '');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const imgArray = pImages.split(',').map((img) => img.trim()).filter(Boolean);
    const sizeArray = pSizes.split(',').map((s) => s.trim()).filter(Boolean);

    const productPayload = {
      name: pNameEn,
      nameTrans: { bn: pNameBn, en: pNameEn },
      description: pDescEn,
      descriptionTrans: { bn: pDescBn, en: pDescEn },
      price: parseFloat(pPrice) || 0,
      discountPrice: pDiscountPrice ? parseFloat(pDiscountPrice) : undefined,
      category: pCategory,
      stock: parseInt(pStock) || 0,
      images: imgArray.length > 0 ? imgArray : ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'],
      discountBadge: pDiscountBadge || undefined,
      sizeOrVolume: sizeArray.length > 0 ? sizeArray : undefined,
      notes: pNotes || undefined
    };

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...productPayload
      });
    } else {
      addProduct(productPayload);
    }

    setIsProductModalOpen(false);
  };

  // 🔷 COURIER SYSTEM OPERATIONS
  const handleOpenBooking = (ord: Order) => {
    setBookingOrder(ord);
    setSelectedCourier('pathao');
    setBookingLogs([]);
    setIsBooking(false);
  };

  const handleCancelCourier = (orderId: string) => {
    if (window.confirm(currentLanguage === 'bn' 
      ? 'আপনি কি নিশ্চিত যে এই কুরিয়ার বুকিং বাতিল করতে চান?' 
      : 'Are you sure you want to cancel the courier consignment for this order?')) {
      updateOrderCourier(orderId, 'none');
    }
  };

  const handlePrintLabel = (ord: Order) => {
    setPrintingOrder(ord);
  };

  const handleConfirmBooking = async () => {
    if (!bookingOrder) return;
    
    setIsBooking(true);
    setBookingLogs([]);
    
    const logs = selectedCourier === 'pathao' ? [
      'Establishing secure SSL handshake with merchant.pathao.com...',
      'Authorizing API OAuth2 bearer credentials...',
      `Generating store consignment payload for Order: ${bookingOrder.id}...`,
      `Validating recipient phone: "${bookingOrder.phone}" and address...`,
      'Calculating dynamic delivery charge (Standard weight: 0.5kg)...',
      'Pathao Merchant API: 201 Created successfully.',
      `Generated consignment tracking number...`
    ] : [
      'Establishing ping with Steadfast Courier integration endpoint...',
      'Verifying merchant api_key for Al Barakah Premium...',
      `Structuring JSON parcel dispatch package for ${bookingOrder.customerName}...`,
      `Configuring Cash On Delivery (COD) collection: BDT ${bookingOrder.paymentMethod === 'cod' ? bookingOrder.total : 0}...`,
      'Steadfast Database synced successfully. Generating bulk tracker...',
      'Parcel logged at Banani Dispatch Hub (Consignment active).'
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setBookingLogs((prev) => [...prev, logs[i]]);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const trackingId = selectedCourier === 'pathao' ? `PT-${randomNum}` : `SF-${randomNum}`;
    const defaultStatus = selectedCourier === 'pathao' ? 'Consignment Registered (Tejgaon Hub)' : 'Consignment Created (Banani Hub)';
    
    updateOrderCourier(bookingOrder.id, selectedCourier, trackingId, defaultStatus);
    updateOrderStatus(bookingOrder.id, 'shipped');
    
    setIsBooking(false);
    setBookingOrder(null);
  };

  // 🔷 DATA EXPORT HANDLERS (CSV Spreadsheets)
  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      alert(currentLanguage === 'bn' ? 'কোনো অর্ডার নেই!' : 'No orders to export!');
      return;
    }
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Address', 'Items', 'Subtotal (BDT)', 'Delivery Charge (BDT)', 'Total (BDT)', 'Payment Method', 'Transaction ID', 'Courier', 'Courier Tracking ID', 'Status', 'Date'];
    const rows = orders.map(o => {
      const itemsListStr = o.items.map(it => `${it.productName} (${it.selectedSize || 'std'}) x${it.quantity}`).join(' | ');
      return [
        o.id,
        o.customerName,
        `"${o.phone}"`,
        `"${o.address.replace(/"/g, '""')}"`,
        `"${itemsListStr.replace(/"/g, '""')}"`,
        o.subtotal,
        o.deliveryCharge,
        o.total,
        o.paymentMethod.toUpperCase(),
        o.transactionId || '',
        o.courier ? (o.courier === 'pathao' ? 'Pathao' : 'Steadfast') : 'None',
        o.courierTrackingId || '',
        o.status,
        new Date(o.createdAt).toLocaleString()
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Al_Barakah_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCustomersCSV = () => {
    if (usersList.length === 0) {
      alert(currentLanguage === 'bn' ? 'কোনো গ্রাহক তথ্য নেই!' : 'No customers to export!');
      return;
    }
    const headers = ['Customer ID', 'Name', 'Phone', 'Email', 'Address', 'Registered Date'];
    const rows = usersList.map(u => [
      u.id,
      u.name,
      `"${u.phone}"`,
      u.email || '',
      `"${(u.address || '').replace(/"/g, '""')}"`,
      new Date(u.createdAt).toLocaleString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Al_Barakah_Customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔷 METRICS CALCULATIONS
  const totalSales = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingSales = orders
    .filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStockItems = products.filter((p) => p.stock <= 5);

  // 🔷 CHART DATA PREPARATION
  // Category Sales breakdown
  const categorySalesMap: Record<string, number> = { attar: 0, sunglasses: 0, accessories: 0, islamic: 0, womens: 0, baby_toys: 0, organic_fruits: 0, medicine: 0 };
  orders.forEach((ord) => {
    if (ord.status !== 'cancelled') {
      ord.items.forEach((item) => {
        // Find product to determine category
        const prod = products.find((p) => p.id === item.productId) || initialProducts.find((p) => p.id === item.productId);
        if (prod) {
          const cat = prod.category;
          if (categorySalesMap[cat] !== undefined) {
            categorySalesMap[cat] += item.price * item.quantity;
          } else {
            categorySalesMap[cat] = item.price * item.quantity;
          }
        } else {
          categorySalesMap['attar'] += item.price * item.quantity; // default fallback
        }
      });
    }
  });

  const chartData = [
    { name: currentLanguage === 'bn' ? 'আতর' : 'Attar', value: categorySalesMap['attar'] },
    { name: currentLanguage === 'bn' ? 'মহিলাদের' : "Women", value: categorySalesMap['womens'] },
    { name: currentLanguage === 'bn' ? 'খেলনা' : 'Baby Toys', value: categorySalesMap['baby_toys'] },
    { name: currentLanguage === 'bn' ? 'সানগ্লাস' : 'Sunglasses', value: categorySalesMap['sunglasses'] },
    { name: currentLanguage === 'bn' ? 'এক্সেসরিজ' : 'Accessories', value: categorySalesMap['accessories'] },
    { name: currentLanguage === 'bn' ? 'ইসলামিক' : 'Islamic', value: categorySalesMap['islamic'] },
    { name: currentLanguage === 'bn' ? 'অর্গানিক ফ্রুটস' : 'Organic Fruits', value: categorySalesMap['organic_fruits'] },
    { name: currentLanguage === 'bn' ? 'মেডিসিন' : 'Medicine & Health', value: categorySalesMap['medicine'] }
  ];

  // Daily order count (simplified mockup stats based on orders)
  const orderStats = [
    { day: 'Sat', sales: 12500, orders: 4 },
    { day: 'Sun', sales: 18200, orders: 6 },
    { day: 'Mon', sales: 9800, orders: 3 },
    { day: 'Tue', sales: 24500, orders: 8 },
    { day: 'Wed', sales: 15400, orders: 5 },
    { day: 'Thu', sales: 29000, orders: 9 },
    { day: 'Fri', sales: 42000, orders: 12 }
  ];

  const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#A78BFA', '#F472B6', '#10B981', '#34D399'];

  // NOT LOGGED IN VIEW: Credentials Gate
  if (!adminLoggedIn) {
    return (
      <div className="bg-black text-white min-h-screen py-16 px-4" id="admin-login-view">
        <div className="max-w-md mx-auto bg-zinc-950 border border-amber-500/30 rounded-lg p-8 shadow-2xl shadow-black relative" id="admin-login-container">
          
          <div className="text-center space-y-2 mb-8" id="admin-login-header">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-3">
              <ShieldAlert size={22} className="animate-pulse" />
            </div>
            <h1 className="font-serif text-2xl font-bold">
              {currentLanguage === 'bn' ? 'অ্যাডমিন প্যানেল পোর্টাল' : 'Admin Panel Portal'}
            </h1>
            <p className="text-zinc-500 text-xs">
              {currentLanguage === 'bn' 
                ? 'আল বারাকাহ প্রিমিয়াম এডমিনিস্ট্রেটর অথেন্টিকেশন প্রয়োজন।' 
                : 'Al Barakah Premium administrator access authorization.'}
            </p>
          </div>

          {authError && (
            <div className="bg-rose-950/40 border border-rose-500/20 text-rose-400 p-3 rounded text-xs mb-5 font-semibold flex items-center gap-2">
              <ShieldAlert size={14} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 font-sans" id="admin-login-form">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-semibold">
                {currentLanguage === 'bn' ? 'ইউজারনেম' : 'Username'}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="AlBarakahpremium"
                className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/50 font-mono"
                id="admin-user-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-semibold">
                {currentLanguage === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2.5 focus:outline-none focus:border-amber-500/50 font-mono"
                id="admin-pass-input"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black rounded font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-amber-500/10 mt-2"
              id="admin-login-btn"
            >
              {currentLanguage === 'bn' ? 'প্রবেশ করুন' : 'Authenticate Access'}
            </button>
          </form>

          {/* Credentials Helper Box */}
          <div className="mt-6 pt-5 border-t border-zinc-900 text-center space-y-2.5" id="credentials-helper">
            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
              {currentLanguage === 'bn' ? 'অ্যাডমিন ডেমো ক্রেডেনশিয়ালস' : 'Administrator Access Credentials'}
            </span>
            <div className="bg-zinc-900/80 rounded border border-zinc-800/80 p-3 text-[11px] font-mono space-y-1 text-left relative overflow-hidden">
              <div className="absolute right-0 top-0 w-12 h-12 bg-amber-500/5 rounded-full flex items-center justify-center -mr-2 -mt-2">
                <ShieldAlert size={14} className="text-amber-500/20" />
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Username:</span>
                <span className="text-amber-500 font-bold">AlBarakahpremium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Password:</span>
                <span className="text-amber-500 font-bold">Delwar1212</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen py-8" id="admin-dashboard-view">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-5 mb-8 gap-4" id="admin-header">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide flex items-center gap-2">
              <LayoutDashboard size={26} className="text-amber-500" />
              {currentLanguage === 'bn' ? 'ম্যানেজমেন্ট কন্ট্রোল প্যানেল' : 'Management Control Panel'}
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">
              {currentLanguage === 'bn' 
                ? 'পণ্য স্টক, অর্ডার স্ট্যাটাস ও বিক্রয় সংক্রান্ত এনালাইটিক্স কন্ট্রোল।' 
                : 'Fulfill store operations, edit stock catalog, manage invoices & user analytics.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
            <button
              onClick={resetStoreData}
              className="px-3 py-2 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/10 hover:border-rose-500/30 text-rose-400 transition-colors text-xs font-semibold rounded"
              title={currentLanguage === 'bn' ? 'সব ডিলিট করে প্রথম থেকে শুরু করুন' : 'Reset all store database to defaults'}
              id="admin-reset-btn"
            >
              {currentLanguage === 'bn' ? 'স্টোর রিসেট' : 'Reset Database'}
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-4 py-2 bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-xs font-semibold rounded"
              id="admin-logout-btn"
            >
              {currentLanguage === 'bn' ? 'লগআউট' : 'Logout Admin Portal'}
            </button>
          </div>
        </div>

        {/* Analytics Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" id="admin-stats-strip">
          
          <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-lg flex items-center gap-4" id="stat-sales">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                {currentLanguage === 'bn' ? 'মোট বিক্রি (পরিশোধিত)' : 'Delivered Sales'}
              </p>
              <p className="text-sm sm:text-lg font-bold font-mono text-emerald-500">
                ৳{totalSales.toLocaleString('bn-BD')}
              </p>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-lg flex items-center gap-4" id="stat-pending">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                {currentLanguage === 'bn' ? 'চলতি অর্ডার মূল্য' : 'Pending Invoices'}
              </p>
              <p className="text-sm sm:text-lg font-bold font-mono text-amber-500">
                ৳{pendingSales.toLocaleString('bn-BD')}
              </p>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-lg flex items-center gap-4" id="stat-orders">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded border border-blue-500/20">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                {currentLanguage === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}
              </p>
              <p className="text-sm sm:text-lg font-bold font-mono text-white">
                {orders.length.toLocaleString('bn-BD')}
              </p>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-lg flex items-center gap-4" id="stat-customers">
            <div className="p-3 bg-pink-500/10 text-pink-500 rounded border border-pink-500/20">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                {currentLanguage === 'bn' ? 'মোট কাস্টমার' : 'Total Customers'}
              </p>
              <p className="text-sm sm:text-lg font-bold font-mono text-white">
                {usersList.length.toLocaleString('bn-BD')}
              </p>
            </div>
          </div>

        </div>

        {/* Low Stock Warning Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-rose-950/30 border border-rose-500/20 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8" id="low-stock-alert">
            <div className="flex gap-2 text-xs text-rose-400 font-semibold items-center">
              <Package size={16} />
              <span>
                {currentLanguage === 'bn'
                  ? `সতর্কতা: ${lowStockItems.length} টি পণ্যের স্টক শেষ হওয়ার পথে (স্টক সংখ্যা ৫ বা কম)!`
                  : `Stock Alert: ${lowStockItems.length} products are running extremely low on inventory (stock <= 5)!`}
              </span>
            </div>
            <button
              onClick={() => {
                setActiveTab('products');
              }}
              className="text-xs font-bold text-amber-500 hover:underline hover:text-amber-400 uppercase"
            >
              {currentLanguage === 'bn' ? 'স্টক আপডেট করুন' : 'Manage Inventory'}
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-900 mb-8 overflow-x-auto gap-2 scrollbar-none" id="admin-tabs">
          {[
            { id: 'analytics', label: { bn: 'বিক্রয় এনালাইটিক্স', en: 'Sales Analytics' } },
            { id: 'orders', label: { bn: 'অর্ডার তালিকা', en: 'Manage Orders' } },
            { id: 'products', label: { bn: 'পণ্য ক্যাটালগ', en: 'Products Catalog' } },
            { id: 'customers', label: { bn: 'গ্রাহক ডিরেক্টরি', en: 'Customer Directory' } }
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id as any)}
              className={`px-5 py-3 text-xs sm:text-sm font-semibold tracking-wide transition-all border-b-2 shrink-0 ${
                activeTab === tb.id
                  ? 'border-amber-500 text-amber-500 bg-zinc-950'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
              id={`tab-btn-${tb.id}`}
            >
              {tb.label[currentLanguage]}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        
        {/* Tab 1: Analytics with Recharts */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="analytics-tab-view">
            
            {/* Sales bar chart */}
            <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 p-6 rounded-lg space-y-4" id="sales-chart-card">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3">
                {currentLanguage === 'bn' ? 'সাপ্তাহিক বিক্রয় এনালাইটিক্স (৳ বিডিটি)' : 'Weekly Sales Trend (৳ BDT)'}
              </h3>
              <div className="h-72 w-full pt-4 text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="day" stroke="#71717a" />
                    <YAxis stroke="#71717a" />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a' }} />
                    <Bar dataKey="sales" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie breakdown chart */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-lg flex flex-col justify-between" id="category-pie-card">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3">
                {currentLanguage === 'bn' ? 'ক্যাটাগরি ভিত্তিক বিক্রয়' : 'Category Sales Distribution'}
              </h3>
              <div className="h-44 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-4 border-t border-zinc-900 pt-4" id="pie-legends">
                {chartData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-zinc-400 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx] }}></span>
                    <span className="truncate">{item.name}: ৳{item.value.toLocaleString('bn-BD')}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Orders list operations */}
        {activeTab === 'orders' && (
          <div className="space-y-4 font-sans" id="orders-tab-view">
            <div className="flex justify-between items-center bg-zinc-950 border border-zinc-900 p-4 rounded-lg gap-4" id="orders-actions-bar">
              <span className="text-xs text-zinc-500 font-mono">
                {currentLanguage === 'bn' 
                  ? `মোট ${orders.length.toLocaleString('bn-BD')} টি অর্ডার সিস্টেমে আছে` 
                  : `Total ${orders.length} orders recorded`}
              </span>
              <button
                onClick={handleExportOrdersCSV}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded flex items-center gap-1.5 uppercase tracking-wider transition-all duration-150 shadow-md shrink-0"
                id="btn-export-orders"
              >
                <FileSpreadsheet size={14} />
                <span>
                  {currentLanguage === 'bn' ? 'এক্সেল ডাউনলোড' : 'Export to CSV'}
                </span>
              </button>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">{currentLanguage === 'bn' ? 'অর্ডার আইডি' : 'Order ID'}</th>
                    <th className="p-4">{currentLanguage === 'bn' ? 'গ্রাহক তথ্য' : 'Customer'}</th>
                    <th className="p-4">{currentLanguage === 'bn' ? 'পণ্যসমূহ' : 'Items Ordered'}</th>
                    <th className="p-4">{currentLanguage === 'bn' ? 'মোট বিল' : 'Grand Total'}</th>
                    <th className="p-4">{currentLanguage === 'bn' ? 'পেমেন্ট' : 'Payment Method'}</th>
                    <th className="p-4">{currentLanguage === 'bn' ? 'কুরিয়ার / শিপিং' : 'Courier / Shipping'}</th>
                    <th className="p-4">{currentLanguage === 'bn' ? 'স্ট্যাটাস' : 'Status Control'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {orders.length > 0 ? (
                    orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-zinc-900/40 transition-colors" id={`admin-order-row-${ord.id}`}>
                        <td className="p-4 font-mono font-bold text-amber-500 whitespace-nowrap">
                          {ord.id}
                        </td>
                        <td className="p-4 space-y-1">
                          <p className="font-semibold text-white">{ord.customerName}</p>
                          <p className="text-[11px] text-zinc-500 font-mono">{ord.phone}</p>
                          <p className="text-[10px] text-zinc-500 truncate max-w-[150px]" title={ord.address}>{ord.address}</p>
                        </td>
                        <td className="p-4">
                          <ul className="space-y-1 text-[11px] list-disc list-inside max-w-[200px]" id={`ordered-list-${ord.id}`}>
                            {ord.items.map((it, i) => (
                              <li key={i} className="truncate">
                                {it.productName} ({it.selectedSize || 'std'}) <strong className="text-white">x{it.quantity}</strong>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-4 font-mono text-white font-bold whitespace-nowrap">
                          ৳{ord.total.toLocaleString('bn-BD')}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="uppercase bg-zinc-900 px-2 py-1 rounded text-[10px] font-bold text-zinc-400">
                            {ord.paymentMethod}
                          </span>
                          {ord.transactionId && (
                            <p className="text-[10px] font-mono text-zinc-600 mt-1">Trx: {ord.transactionId}</p>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {ord.courier ? (
                            <div className="space-y-1 text-left min-w-[140px]">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${
                                  ord.courier === 'pathao' 
                                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {ord.courier === 'pathao' ? 'Pathao' : 'Steadfast'}
                                </span>
                                <button
                                  onClick={() => handlePrintLabel(ord)}
                                  className="text-zinc-500 hover:text-amber-500 transition-colors p-0.5 cursor-pointer"
                                  title={currentLanguage === 'bn' ? 'ডেলিভারি স্লিপ প্রিন্ট' : 'Print Delivery Label'}
                                >
                                  <Printer size={12} />
                                </button>
                              </div>
                              <p className="font-mono text-[10px] text-zinc-300 font-semibold select-all">
                                {ord.courierTrackingId}
                              </p>
                              <p className="text-[9px] text-zinc-500 truncate max-w-[120px] font-sans">
                                {ord.courierStatus}
                              </p>
                              <button
                                onClick={() => handleCancelCourier(ord.id)}
                                className="text-[9px] text-rose-500 hover:text-rose-400 font-bold uppercase tracking-wider block mt-0.5 hover:underline cursor-pointer"
                              >
                                {currentLanguage === 'bn' ? 'বাতিল' : 'Cancel'}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenBooking(ord)}
                              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-amber-500 hover:text-black border border-zinc-800 text-[10px] font-bold text-amber-500 uppercase tracking-widest rounded transition-all duration-200 flex items-center gap-1 cursor-pointer"
                            >
                              <Truck size={12} />
                              <span>{currentLanguage === 'bn' ? 'বুকিং করুন' : 'Book'}</span>
                            </button>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                              className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded px-2.5 py-1.5 focus:outline-none focus:border-amber-500/50"
                              id={`status-select-${ord.id}`}
                            >
                              <option value="pending">{currentLanguage === 'bn' ? 'অপেক্ষমাণ' : 'Pending'}</option>
                              <option value="processing">{currentLanguage === 'bn' ? 'প্রক্রিয়াধীন' : 'Processing'}</option>
                              <option value="shipped">{currentLanguage === 'bn' ? 'শিপড হয়েছে' : 'Shipped'}</option>
                              <option value="delivered">{currentLanguage === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered'}</option>
                              <option value="cancelled">{currentLanguage === 'bn' ? 'বাতিল' : 'Cancelled'}</option>
                            </select>
                            <button
                              onClick={() => {
                                if (window.confirm(currentLanguage === 'bn' ? 'আপনি কি এই অর্ডারটি ডিলিট করতে চান?' : 'Are you sure you want to delete this order?')) {
                                  deleteOrder(ord.id);
                                }
                              }}
                              className="p-1.5 bg-zinc-900 hover:bg-rose-500/15 text-zinc-500 hover:text-rose-400 rounded border border-zinc-800 transition-colors"
                              title={currentLanguage === 'bn' ? 'অর্ডার ডিলিট করুন' : 'Delete Order'}
                              id={`btn-order-delete-${ord.id}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-zinc-500 font-medium">
                        {currentLanguage === 'bn' ? 'কোনো অর্ডার এখনো প্লেস করা হয়নি।' : 'No orders in system records.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {/* Tab 3: Products catalog management */}
        {activeTab === 'products' && (
          <div className="space-y-6" id="products-tab-view">
            
            {/* Add product action block */}
            <div className="flex justify-between items-center" id="catalog-actions-bar">
              <span className="text-xs text-zinc-500 font-mono">
                {currentLanguage === 'bn' 
                  ? `মোট ${products.length.toLocaleString('bn-BD')} টি পণ্য ক্যাটালগে আছে` 
                  : `Showing ${products.length} catalog items`}
              </span>
              <button
                onClick={openAddProductModal}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-4 py-2.5 rounded flex items-center gap-1.5 uppercase tracking-wider transition-all duration-150 shadow-md active:scale-95"
                id="btn-add-product-trigger"
              >
                <Plus size={14} />
                {currentLanguage === 'bn' ? 'নতুন পণ্য যুক্ত করুন' : 'Add New Product'}
              </button>
            </div>

            {/* Catalog list table */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden" id="catalog-list-table">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">{currentLanguage === 'bn' ? 'ছবি ও নাম' : 'Product Info'}</th>
                    <th className="p-4">{currentLanguage === 'bn' ? 'ক্যাটাগরি' : 'Category'}</th>
                    <th className="p-4">{currentLanguage === 'bn' ? 'মূল্য' : 'Price Details'}</th>
                    <th className="p-4">{currentLanguage === 'bn' ? 'স্টক' : 'Stock Status'}</th>
                    <th className="p-4 text-right">{currentLanguage === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {products.map((p) => {
                    const name = p.nameTrans[currentLanguage] || p.name;
                    return (
                      <tr key={p.id} className="hover:bg-zinc-900/30 transition-colors" id={`admin-product-row-${p.id}`}>
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.images[0]} alt={name} className="w-10 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white truncate text-xs sm:text-sm">{p.nameTrans.en}</p>
                            <p className="text-amber-500 font-medium text-[11px] truncate mt-0.5">{p.nameTrans.bn}</p>
                          </div>
                        </td>
                        <td className="p-4 capitalize font-mono text-zinc-400">
                          {p.category}
                        </td>
                        <td className="p-4 font-mono text-xs text-zinc-300">
                          {p.discountPrice ? (
                            <div className="space-y-0.5">
                              <p className="font-bold text-white">৳{p.discountPrice.toLocaleString('bn-BD')}</p>
                              <p className="text-[10px] text-zinc-500 line-through">৳{p.price.toLocaleString('bn-BD')}</p>
                            </div>
                          ) : (
                            <p className="font-bold text-white">৳{p.price.toLocaleString('bn-BD')}</p>
                          )}
                        </td>
                        <td className="p-4 font-mono">
                          <span className={`font-bold ${p.stock <= 5 ? 'text-rose-500' : 'text-zinc-300'}`}>
                            {p.stock} {currentLanguage === 'bn' ? 'টি' : 'items'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => openEditProductModal(p)}
                            className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-zinc-900 rounded"
                            title="Edit Product"
                            id={`btn-product-edit-${p.id}`}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/5 rounded"
                            title="Delete Product"
                            id={`btn-product-delete-${p.id}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 4: Customers directory */}
        {activeTab === 'customers' && (
          <div className="space-y-4 font-sans" id="customers-tab-view">
            <div className="flex justify-between items-center bg-zinc-950 border border-zinc-900 p-4 rounded-lg gap-4" id="customers-actions-bar">
              <span className="text-xs text-zinc-500 font-mono">
                {currentLanguage === 'bn' 
                  ? `মোট ${usersList.length.toLocaleString('bn-BD')} জন গ্রাহক নিবন্ধিত আছেন` 
                  : `Total ${usersList.length} registered customers`}
              </span>
              <button
                onClick={handleExportCustomersCSV}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded flex items-center gap-1.5 uppercase tracking-wider transition-all duration-150 shadow-md shrink-0"
                id="btn-export-customers"
              >
                <FileSpreadsheet size={14} />
                <span>
                  {currentLanguage === 'bn' ? 'এক্সেল ডাউনলোড' : 'Export to CSV'}
                </span>
              </button>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">{currentLanguage === 'bn' ? 'গ্রাহক নাম' : 'Customer Name'}</th>
                  <th className="p-4">{currentLanguage === 'bn' ? 'মোবাইল নম্বর' : 'Phone'}</th>
                  <th className="p-4">{currentLanguage === 'bn' ? 'ইমেইল' : 'Email'}</th>
                  <th className="p-4">{currentLanguage === 'bn' ? 'ঠিকানা' : 'Address'}</th>
                  <th className="p-4">{currentLanguage === 'bn' ? 'তারিখ' : 'Registered On'}</th>
                  <th className="p-4 text-right">{currentLanguage === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {usersList.length > 0 ? (
                  usersList.map((user) => (
                    <tr key={user.id} className="hover:bg-zinc-900/40 transition-colors" id={`admin-user-row-${user.id}`}>
                      <td className="p-4 font-semibold text-white">
                        {user.name}
                      </td>
                      <td className="p-4 font-mono">
                        {user.phone}
                      </td>
                      <td className="p-4 font-mono text-zinc-400">
                        {user.email || '-'}
                      </td>
                      <td className="p-4 text-xs max-w-xs truncate" title={user.address}>
                        {user.address || '-'}
                      </td>
                      <td className="p-4 font-mono text-zinc-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (window.confirm(currentLanguage === 'bn' ? 'আপনি কি এই গ্রাহক প্রোফাইলটি ডিলিট করতে চান?' : 'Are you sure you want to delete this customer account?')) {
                              deleteUser(user.id);
                            }
                          }}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors animate-fade-in"
                          title={currentLanguage === 'bn' ? 'গ্রাহক ডিলিট করুন' : 'Delete Customer'}
                          id={`btn-user-delete-${user.id}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-zinc-500 font-medium">
                      {currentLanguage === 'bn' ? 'কোনো গ্রাহক এখনো রেজিস্টার করেননি।' : 'No customer accounts in registry.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}

      </div>

      {/* 🔷 ADD / EDIT PRODUCT MODAL OVERLAY */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" id="product-modal-backdrop">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg max-w-2xl w-full p-6 space-y-5 my-10 max-h-[90vh] overflow-y-auto" id="product-modal-content">
            
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3" id="modal-header">
              <h3 className="font-serif text-lg font-bold text-amber-500">
                {editingProduct 
                  ? (currentLanguage === 'bn' ? 'পণ্য সংশোধন করুন' : 'Edit Premium Product') 
                  : (currentLanguage === 'bn' ? 'নতুন পণ্য যুক্ত করুন' : 'Add New Luxury Product')}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="text-zinc-500 hover:text-white font-bold"
                id="btn-close-modal"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs" id="modal-form">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-semibold">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={pNameEn}
                    onChange={(e) => setPNameEn(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-semibold">পণ্যর নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={pNameBn}
                    onChange={(e) => setPNameBn(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-semibold">Product Description (English) *</label>
                  <textarea
                    required
                    rows={3}
                    value={pDescEn}
                    onChange={(e) => setPDescEn(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/50 leading-relaxed"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-semibold">পণ্যের বিবরণ (বাংলা) *</label>
                  <textarea
                    required
                    rows={3}
                    value={pDescBn}
                    onChange={(e) => setPDescBn(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/50 leading-relaxed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-semibold">Original Price (৳ BDT) *</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-semibold">Discount Price (৳ BDT - Optional)</label>
                  <input
                    type="number"
                    value={pDiscountPrice}
                    onChange={(e) => setPDiscountPrice(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-semibold">Category *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="attar">Attar</option>
                    <option value="womens">Women Collection</option>
                    <option value="baby_toys">Baby Toys</option>
                    <option value="sunglasses">Sunglasses</option>
                    <option value="accessories">Accessories</option>
                    <option value="islamic">Islamic Products</option>
                    <option value="organic_fruits">Organic Fruits</option>
                    <option value="medicine">Medicine & Health</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-semibold">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-semibold">Discount Offer Badge (e.g., ১৫% ছাড় / ১৬% OFF)</label>
                  <input
                    type="text"
                    value={pDiscountBadge}
                    onChange={(e) => setPDiscountBadge(e.target.value)}
                    placeholder="১৬% ছাড়"
                    className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 font-semibold">Product Images (Paste multiple URLs separated by commas) *</label>
                <input
                  type="text"
                  required
                  value={pImages}
                  onChange={(e) => setPImages(e.target.value)}
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-semibold">Notes / Highlights (e.g. Scent profile / Frame materials)</label>
                  <input
                    type="text"
                    value={pNotes}
                    onChange={(e) => setPNotes(e.target.value)}
                    placeholder="Sweet Amber, Vanilla, Warm Musk"
                    className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-semibold">Volume / Sizes (Comma-separated, e.g. ৩ মিলি, ৬ মিলি, ১২ মিলি)</label>
                  <input
                    type="text"
                    value={pSizes}
                    onChange={(e) => setPSizes(e.target.value)}
                    placeholder="৩ মিলি, ৬ মিলি, ১২ মিলি"
                    className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-2 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900" id="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 font-semibold rounded hover:text-white"
                  id="btn-cancel-save"
                >
                  {currentLanguage === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded shadow"
                  id="btn-submit-save"
                >
                  {currentLanguage === 'bn' ? 'সংরক্ষণ করুন' : 'Save Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================== COURIER BOOKING MODAL ==================== */}
      {bookingOrder && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" id="courier-booking-modal">
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg max-w-lg w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3" id="booking-modal-header">
              <div className="flex items-center gap-2">
                <Truck className="text-amber-500" size={18} />
                <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                  {currentLanguage === 'bn' ? 'কুরিয়ার ডেলিভারি বুকিং' : 'Courier Delivery Booking'}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 rounded">
                Order: {bookingOrder.id}
              </span>
            </div>

            {!isBooking ? (
              <div className="space-y-4">
                {/* Select Courier Tabs */}
                <div className="grid grid-cols-2 gap-3" id="courier-select-tabs">
                  <button
                    type="button"
                    onClick={() => setSelectedCourier('pathao')}
                    className={`p-3 rounded border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      selectedCourier === 'pathao'
                        ? 'bg-orange-500/10 border-orange-500/50 text-orange-400 shadow-lg shadow-orange-500/5'
                        : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <span className="font-bold text-xs uppercase tracking-wider">Pathao Delivery</span>
                    <span className="text-[10px] text-zinc-500 leading-normal">
                      {currentLanguage === 'bn' ? 'ঢাকা ও সারা বাংলাদেশ ডেলিভারি' : 'Reliable island-wide logistics network'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCourier('steadfast')}
                    className={`p-3 rounded border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      selectedCourier === 'steadfast'
                        ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-lg shadow-rose-500/5'
                        : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <span className="font-bold text-xs uppercase tracking-wider">Steadfast Courier</span>
                    <span className="text-[10px] text-zinc-500 leading-normal">
                      {currentLanguage === 'bn' ? 'দ্রুত ক্যাশ অন ডেলিভারি সার্ভিস' : 'Superfast COD clearance service'}
                    </span>
                  </button>
                </div>

                {/* Recipient Summary Info */}
                <div className="bg-zinc-900/30 p-3.5 rounded border border-zinc-900 text-xs text-zinc-400 space-y-1.5 text-left font-sans">
                  <div className="flex justify-between">
                    <span className="font-bold text-zinc-500 uppercase text-[9px]">{currentLanguage === 'bn' ? 'গ্রাহক:' : 'Recipient:'}</span>
                    <span className="text-white font-medium">{bookingOrder.customerName} ({bookingOrder.phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-zinc-500 uppercase text-[9px]">{currentLanguage === 'bn' ? 'ঠিকানা:' : 'Address:'}</span>
                    <span className="text-zinc-300 font-medium truncate max-w-[240px]" title={bookingOrder.address}>{bookingOrder.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-zinc-500 uppercase text-[9px]">{currentLanguage === 'bn' ? 'বিলিং মোট:' : 'Subtotal:'}</span>
                    <span className="text-zinc-300 font-mono">৳{bookingOrder.total.toLocaleString('bn-BD')} ({bookingOrder.paymentMethod.toUpperCase()})</span>
                  </div>
                </div>

                {/* Conditional Form fields */}
                {selectedCourier === 'pathao' ? (
                  /* PATHAO FORM FIELDS */
                  <div className="space-y-3.5 text-left animate-fadeIn">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {currentLanguage === 'bn' ? 'স্টোর লোকেশন' : 'Merchant Store Location'}
                      </label>
                      <input
                        type="text"
                        value={pathaoStore}
                        onChange={(e) => setPathaoStore(e.target.value)}
                        className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2 focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                          {currentLanguage === 'bn' ? 'ডেলিভারি জোন' : 'Delivery Zone'}
                        </label>
                        <select
                          value={pathaoZone}
                          onChange={(e) => setPathaoZone(e.target.value)}
                          className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2 focus:outline-none focus:border-orange-500/50"
                        >
                          <option value="Dhaka City">Dhaka City</option>
                          <option value="Dhaka Suburbs">Dhaka Suburbs</option>
                          <option value="Chittagong City">Chittagong City</option>
                          <option value="Sylhet City">Sylhet City</option>
                          <option value="Rajshahi City">Rajshahi City</option>
                          <option value="Other Outside Dhaka">Other Outside Dhaka</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                          {currentLanguage === 'bn' ? 'প্যাকেজের ওজন' : 'Package Weight'}
                        </label>
                        <select
                          value={pathaoWeight}
                          onChange={(e) => setPathaoWeight(e.target.value)}
                          className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2 focus:outline-none"
                        >
                          <option value="0.5">0.5 kg</option>
                          <option value="1.0">1.0 kg</option>
                          <option value="2.0">2.0 kg</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                          {currentLanguage === 'bn' ? 'ডেলিভারি ধরণ' : 'Delivery Speed'}
                        </label>
                        <select
                          value={pathaoType}
                          onChange={(e) => setPathaoType(e.target.value)}
                          className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2 focus:outline-none"
                        >
                          <option value="Standard">Standard (24-48 hrs)</option>
                          <option value="Express">Express (Same Day)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                          {currentLanguage === 'bn' ? 'সংগ্রহযোগ্য COD বিল' : 'COD Amount to Collect'}
                        </label>
                        <div className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2 font-mono font-bold text-orange-400 flex items-center justify-between">
                          <span>৳{bookingOrder.paymentMethod === 'cod' ? bookingOrder.total.toLocaleString('bn-BD') : '0'}</span>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wide">
                            {bookingOrder.paymentMethod === 'cod' ? 'COD active' : 'Prepaid'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* STEADFAST FORM FIELDS */
                  <div className="space-y-3.5 text-left animate-fadeIn">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {currentLanguage === 'bn' ? 'স্টোর প্রোফাইল নাম' : 'Merchant Sender Profile'}
                      </label>
                      <input
                        type="text"
                        value={steadfastStore}
                        onChange={(e) => setSteadfastStore(e.target.value)}
                        className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2 focus:outline-none focus:border-rose-500/50"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {currentLanguage === 'bn' ? 'সংগ্রহযোগ্য ক্যাশ (COD)' : 'COD Cash Collection'}
                      </label>
                      <div className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2 font-mono font-bold text-rose-400 flex items-center justify-between">
                        <span>৳{bookingOrder.paymentMethod === 'cod' ? bookingOrder.total.toLocaleString('bn-BD') : '0'}</span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wide">
                          {bookingOrder.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Fully Paid'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {currentLanguage === 'bn' ? 'ডেলিভারি ম্যান নোট' : 'Special Courier Note'}
                      </label>
                      <textarea
                        rows={2}
                        value={steadfastNote}
                        onChange={(e) => setSteadfastNote(e.target.value)}
                        className="bg-zinc-900 text-xs text-white border border-zinc-800 rounded px-3 py-2 focus:outline-none focus:border-rose-500/50 leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900" id="booking-modal-actions">
                  <button
                    type="button"
                    onClick={() => setBookingOrder(null)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 font-semibold text-xs uppercase tracking-wider rounded hover:text-white cursor-pointer"
                  >
                    {currentLanguage === 'bn' ? 'বন্ধ করুন' : 'Close'}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className={`px-5 py-2 font-bold text-xs uppercase tracking-wider rounded shadow transition-all cursor-pointer ${
                      selectedCourier === 'pathao'
                        ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-orange-500/10'
                        : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/10'
                    }`}
                  >
                    {currentLanguage === 'bn' ? 'বুকিং নিশ্চিত করুন' : 'Confirm API Booking'}
                  </button>
                </div>
              </div>
            ) : (
              /* API BOOKING LIVE SIMULATOR LOGS */
              <div className="space-y-4 animate-fadeIn" id="booking-api-simulator">
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                  <Loader2 className={`animate-spin ${selectedCourier === 'pathao' ? 'text-orange-500' : 'text-rose-500'}`} size={32} />
                  <p className="text-sm font-bold text-white tracking-wide">
                    {currentLanguage === 'bn' ? 'কুরিয়ার সার্ভার কানেকশন হচ্ছে...' : 'Pinging Courier Endpoints...'}
                  </p>
                  <p className="text-zinc-500 text-[11px] text-center max-w-sm">
                    {currentLanguage === 'bn' ? 'অনুগ্রহ করে অপেক্ষা করুন, রিয়েল-টাইম এপিআই রিকোয়েস্ট ও অথরাইজেশন হচ্ছে।' : 'Establishing secure channel and transferring consignment schema metadata.'}
                  </p>
                </div>

                {/* Console Simulator Box */}
                <div className="bg-black/90 rounded border border-zinc-900 p-4 font-mono text-[10px] text-emerald-400 space-y-2 text-left max-h-52 overflow-y-auto leading-relaxed select-none shadow-inner">
                  <p className="text-zinc-600 font-bold">// REAL-TIME WEB API LOG TERMINAL</p>
                  {bookingLogs.map((log, index) => (
                    <div key={index} className="flex gap-2 animate-fadeIn">
                      <span className="text-zinc-600 font-bold">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SHIPPING LABEL / CONSIGNMENT SLIP PREVIEW ==================== */}
      {printingOrder && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" id="label-printing-modal">
          <div className="max-w-md w-full space-y-4">
            
            {/* The Print Layout Frame styled precisely like an thermal print receipt */}
            <div className="bg-white text-black p-6 rounded shadow-2xl space-y-4 text-left border-4 border-double border-zinc-400 font-sans select-none" id="printable-area-box">
              
              {/* Badge & Logo */}
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">SHIPPING PARTNER</p>
                  <h4 className="font-sans text-xl font-black tracking-tighter uppercase text-black border-2 border-black px-2 py-0.5 bg-black text-white inline-block">
                    {printingOrder.courier === 'pathao' ? 'PATHAO' : 'STEADFAST'}
                  </h4>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">MERCHANT GATEWAY</p>
                  <p className="font-serif text-sm font-black italic text-zinc-800">Al Barakah Premium</p>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="border-b-2 border-black pb-3 text-center space-y-1">
                <div className="flex justify-center items-center h-14 w-full bg-zinc-50 border border-zinc-200 py-1.5 px-4 overflow-hidden">
                  <div className="flex justify-between items-center w-full h-full font-mono font-bold tracking-[6px] text-xs text-black select-all text-center select-none cursor-text">
                    |||| | ||||| | |||| | ||||| | ||| |||| | ||||| | ||
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                  <span>TRK: {printingOrder.courierTrackingId}</span>
                  <span>ORD: {printingOrder.id}</span>
                </div>
              </div>

              {/* Shipping Address Details Grid */}
              <div className="grid grid-cols-2 gap-4 border-b border-zinc-300 pb-3 text-xs">
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase">SENDER</span>
                  <p className="font-bold text-black text-xs leading-normal">Al Barakah Premium</p>
                  <p className="text-zinc-600 text-[11px] leading-snug">Warehouse Central, Uttara, Sector-10, Dhaka</p>
                  <p className="text-black font-semibold text-[11px] font-mono">+8801700000000</p>
                </div>
                <div className="space-y-1 border-l border-zinc-200 pl-3">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase">RECIPIENT</span>
                  <p className="font-bold text-black text-xs leading-normal">{printingOrder.customerName}</p>
                  <p className="text-zinc-600 text-[11px] leading-snug break-words" title={printingOrder.address}>{printingOrder.address}</p>
                  <p className="text-black font-semibold text-[11px] font-mono">{printingOrder.phone}</p>
                </div>
              </div>

              {/* Area & Date Details */}
              <div className="flex justify-between items-center border-b border-zinc-300 pb-3 text-xs font-semibold text-zinc-700">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">SHIPPING AREA</span>
                  <span>{printingOrder.area === 'inside_dhaka' ? 'Inside Dhaka (Home)' : 'Outside Dhaka (Hub)'}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">DISPATCH DATE</span>
                  <span>{new Date(printingOrder.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Purchased items catalog */}
              <div className="border-b border-zinc-300 pb-3 text-xs text-zinc-800 space-y-1">
                <span className="block text-[8px] font-bold text-zinc-500 uppercase mb-1">PARCEL CONTENTS</span>
                {printingOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="truncate max-w-[200px]">{it.productName} ({it.selectedSize || 'std'})</span>
                    <span className="font-mono font-bold text-black">x{it.quantity}</span>
                  </div>
                ))}
              </div>

              {/* HUGE CASH TO COLLECT COD DISPLAY */}
              <div className="bg-zinc-100 p-3.5 rounded text-center border border-zinc-300 space-y-1">
                {printingOrder.paymentMethod === 'cod' ? (
                  <>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase block tracking-wider">CASH ON DELIVERY (COD COLLECTION)</span>
                    <h2 className="font-mono text-2xl font-black text-black">৳{printingOrder.total.toLocaleString('bn-BD')}</h2>
                    <p className="text-[9px] text-zinc-500 italic leading-relaxed">Collect exact amount before handing over parcel.</p>
                  </>
                ) : (
                  <>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase block tracking-wider">FULLY PAID (PREPAID PARCEL)</span>
                    <h2 className="font-mono text-xl font-black text-emerald-600">৳0.00 (NO CASH TO COLLECT)</h2>
                    <p className="text-[9px] text-emerald-600/80 italic leading-relaxed">Online paid via {printingOrder.paymentMethod.toUpperCase()}. Deliver directly.</p>
                  </>
                )}
              </div>

              {/* Barcode/QR Mock design details */}
              <div className="flex justify-between items-center text-[9px] text-zinc-400 font-mono">
                <span>VER: 4.1.0-ALB</span>
                <span>AUTHENTIC LABEL - THANK YOU</span>
              </div>

            </div>

            {/* Utility control buttons (Will NOT print) */}
            <div className="flex gap-3 justify-end text-xs font-sans">
              <button
                type="button"
                onClick={() => setPrintingOrder(null)}
                className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider rounded hover:text-white cursor-pointer"
              >
                {currentLanguage === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shadow shadow-amber-500/10 cursor-pointer"
              >
                <Printer size={14} />
                <span>{currentLanguage === 'bn' ? 'প্রিন্ট স্লিপ' : 'Print Slip'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
