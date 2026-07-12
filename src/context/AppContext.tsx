import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem, Order, User, Language, OrderItem } from '../types';
import { initialProducts } from '../data/initialProducts';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { 
  auth, 
  db,
  loginWithGoogle, 
  logoutFromFirebase, 
  syncUserProfile, 
  saveOrderToFirestore,
  fetchUserOrdersFromFirestore,
  fetchAllOrdersFromFirestore,
  syncProductsToFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  deleteOrderFromFirestore
} from '../lib/firebase';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  usersList: User[];
  currentUser: User | null;
  currentLanguage: Language;
  currentPage: string;
  selectedProduct: Product | null;
  adminLoggedIn: boolean;
  newOrderNotification: Order | null;
  setNewOrderNotification: (order: Order | null) => void;
  
  // Products Management
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  // Shopping Management
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  
  // Wishlist
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Order Placement
  placeOrder: (orderData: {
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    area: 'inside_dhaka' | 'outside_dhaka';
    paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'bank' | 'cod';
    paymentNumber?: string;
    transactionId?: string;
  }) => Order;
  
  // Authentication
  loginOrRegister: (name: string, phone: string, email?: string, address?: string) => User;
  loginWithGoogleAuth: () => Promise<User | null>;
  logoutUser: () => void;
  
  // Language & Navigation
  setLanguage: (lang: Language) => void;
  setCurrentPage: (page: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  setAdminLoggedIn: (loggedIn: boolean) => void;
  
  // Admin Operations
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderCourier: (orderId: string, courier: 'pathao' | 'steadfast' | 'none', trackingId?: string, courierStatus?: string) => void;
  deleteOrder: (orderId: string) => void;
  deleteUser: (userId: string) => void;
  resetStoreData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('al_barakah_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('al_barakah_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('al_barakah_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('al_barakah_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [usersList, setUsersList] = useState<User[]>(() => {
    const saved = localStorage.getItem('al_barakah_users_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('al_barakah_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('al_barakah_lang');
    return (saved as Language) || 'bn';
  });

  const [currentPage, setCurrentPageState] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('al_barakah_admin') === 'true';
  });

  const [newOrderNotification, setNewOrderNotification] = useState<Order | null>(null);

  // Real-time order listener for admin
  useEffect(() => {
    if (!adminLoggedIn) return;

    console.log("Admin logged in. Subscribing to real-time orders...");
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, orderBy("createdAt", "desc"));
    
    let isInitial = true;

    const playChime = () => {
      try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav");
        audio.volume = 0.45;
        audio.play();
      } catch (e) {
        console.log("Audio autoplay blocked or failed", e);
      }
    };

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList: Order[] = [];
      const newOrders: Order[] = [];

      snapshot.forEach((doc) => {
        ordersList.push(doc.data() as Order);
      });

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const orderData = change.doc.data() as Order;
          // Verify it's recent (created in the last 10 minutes) and not part of the initial load
          const isRecent = Date.now() - new Date(orderData.createdAt).getTime() < 600000;
          if (!isInitial && isRecent) {
            newOrders.push(orderData);
          }
        }
      });

      // Update local state and sync with Firestore changes
      setOrders(ordersList);

      if (newOrders.length > 0) {
        // Show the latest new order notification
        const latest = newOrders[0];
        setNewOrderNotification(latest);
        playChime();
      }

      isInitial = false;
    }, (error) => {
      console.error("Error listening to real-time orders snapshot:", error);
    });

    return () => unsubscribe();
  }, [adminLoggedIn]);

  // Listen to Firebase Auth changes to auto-login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync profile to Firestore and fetch their data
        const profile = await syncUserProfile(firebaseUser);
        if (profile) {
          // Map Firebase properties to the App's User structure
          const appUser: User = {
            id: profile.id,
            name: profile.name,
            phone: profile.phone,
            email: profile.email,
            address: profile.address,
            createdAt: profile.createdAt,
            wishlistProductIds: profile.wishlistProductIds
          };
          setCurrentUser(appUser);
          
          // Also fetch user's orders from Firestore
          const firestoreOrders = await fetchUserOrdersFromFirestore(firebaseUser.uid);
          if (firestoreOrders.length > 0) {
            setOrders(prev => {
              const merged = [...prev];
              firestoreOrders.forEach(o => {
                if (!merged.some(m => m.id === o.id)) {
                  merged.push(o as Order);
                }
              });
              return merged;
            });
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync products with Firestore on first load
  useEffect(() => {
    const syncProducts = async () => {
      const dbProducts = await syncProductsToFirestore(initialProducts);
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts as Product[]);
      }
    };
    syncProducts();
  }, []);

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('al_barakah_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('al_barakah_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('al_barakah_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('al_barakah_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('al_barakah_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('al_barakah_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('al_barakah_current_user');
    }
  }, [currentUser]);

  // Synchronize wishlist changes into logged-in user profile
  useEffect(() => {
    if (currentUser) {
      const currentIds = currentUser.wishlistProductIds || [];
      const wishlistIds = wishlist.map((p) => p.id);
      const hasChanged = 
        currentIds.length !== wishlistIds.length ||
        wishlistIds.some(id => !currentIds.includes(id));
      
      if (hasChanged) {
        const updatedUser = { ...currentUser, wishlistProductIds: wishlistIds };
        setCurrentUser(updatedUser);
        setUsersList((prevList) =>
          prevList.map((u) => (u.id === currentUser.id ? updatedUser : u))
        );
      }
    }
  }, [wishlist]);

  // Load saved user wishlist when user logs in
  useEffect(() => {
    if (currentUser) {
      const userWishlistIds = currentUser.wishlistProductIds || [];
      const resolvedWishlist = products.filter(p => userWishlistIds.includes(p.id));
      
      if (userWishlistIds.length > 0) {
        setWishlist((prev) => {
          // Merge guest wishlist with user saved wishlist
          const merged = [...prev];
          resolvedWishlist.forEach((p) => {
            if (!merged.some((m) => m.id === p.id)) {
              merged.push(p);
            }
          });
          return merged;
        });
      }
    }
  }, [currentUser?.id]);

  useEffect(() => {
    localStorage.setItem('al_barakah_lang', currentLanguage);
  }, [currentLanguage]);

  // Handle setting active page and scroll to top automatically
  const setCurrentPage = (page: string) => {
    setCurrentPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔷 PRODUCT OPERATIONS
  const addProduct = (pData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newProduct: Product = {
      ...pData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0
    };
    setProducts((prev) => [newProduct, ...prev]);
    saveProductToFirestore(newProduct);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProduct?.id === updated.id) {
      setSelectedProduct(updated);
    }
    saveProductToFirestore(updated);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setWishlist((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
    deleteProductFromFirestore(id);
  };

  // 🔷 CART OPERATIONS
  const addToCart = (product: Product, quantity = 1, size?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIdx > -1) {
        const nextCart = [...prev];
        nextCart[existingIdx] = {
          ...nextCart[existingIdx],
          quantity: nextCart[existingIdx].quantity + quantity
        };
        return nextCart;
      }
      return [...prev, { product, quantity, selectedSize: size }];
    });
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // 🔷 WISHLIST
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const isAlready = prev.some((p) => p.id === product.id);
      if (isAlready) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // 🔷 PLACE ORDER
  const placeOrder = (orderData: {
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    area: 'inside_dhaka' | 'outside_dhaka';
    paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'bank' | 'cod';
    paymentNumber?: string;
    transactionId?: string;
  }) => {
    const subtotal = cart.reduce((acc, item) => {
      const actualPrice = item.product.discountPrice || item.product.price;
      return acc + actualPrice * item.quantity;
    }, 0);

    const deliveryCharge = orderData.area === 'inside_dhaka' ? 80 : 150;
    const total = subtotal + deliveryCharge;

    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.nameTrans[currentLanguage] || item.product.name,
      price: item.product.discountPrice || item.product.price,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      image: item.product.images[0]
    }));

    const newOrder: Order = {
      ...orderData,
      id: `AB-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUser?.id,
      items: orderItems,
      subtotal,
      deliveryCharge,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Update Product Stock Levels
    setProducts((prev) =>
      prev.map((p) => {
        const cartMatch = cart.find((c) => c.product.id === p.id);
        if (cartMatch) {
          const newStock = Math.max(0, p.stock - cartMatch.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    // Save Order
    setOrders((prev) => [newOrder, ...prev]);

    // Save Order to Firestore
    saveOrderToFirestore(newOrder);

    // Save customer if logged in, add order to history if applicable
    if (currentUser) {
      // User details updated
      const updatedUser = { ...currentUser, address: orderData.address };
      setCurrentUser(updatedUser);
      setUsersList((prevList) =>
        prevList.map((u) => (u.id === currentUser.id ? updatedUser : u))
      );
      if (auth.currentUser) {
        syncUserProfile(auth.currentUser, updatedUser);
      }
    } else {
      // Auto register non-logged in users
      loginOrRegister(orderData.customerName, orderData.phone, orderData.email, orderData.address);
    }

    clearCart();
    return newOrder;
  };

  // 🔷 AUTH OPERATIONS
  const loginOrRegister = (name: string, phone: string, email?: string, address?: string) => {
    const existing = usersList.find((u) => u.phone === phone);
    if (existing) {
      const updated: User = {
        ...existing,
        name: name || existing.name,
        email: email || existing.email,
        address: address || existing.address
      };
      setUsersList((prev) => prev.map((u) => (u.id === existing.id ? updated : u)));
      setCurrentUser(updated);
      return updated;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      phone,
      name,
      email,
      address,
      createdAt: new Date().toISOString()
    };
    setUsersList((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const logoutUser = () => {
    logoutFromFirebase();
    setCurrentUser(null);
    setWishlist([]);
  };

  // Google Login Auth method
  const loginWithGoogleAuth = async () => {
    try {
      const fbUser = await loginWithGoogle();
      if (fbUser) {
        const profile = await syncUserProfile(fbUser, { wishlistProductIds: wishlist.map(p => p.id) });
        if (profile) {
          const appUser: User = {
            id: profile.id,
            name: profile.name,
            phone: profile.phone,
            email: profile.email,
            address: profile.address,
            createdAt: profile.createdAt,
            wishlistProductIds: profile.wishlistProductIds
          };
          setCurrentUser(appUser);
          setUsersList(prev => {
            if (prev.some(u => u.id === appUser.id)) {
              return prev.map(u => u.id === appUser.id ? appUser : u);
            }
            return [...prev, appUser];
          });
          return appUser;
        }
      }
      return null;
    } catch (err) {
      console.error("Google Sign In flow failed", err);
      return null;
    }
  };

  // 🔷 ADMIN SESSION
  const setAdminLogged = (loggedIn: boolean) => {
    setAdminLoggedIn(loggedIn);
    if (loggedIn) {
      sessionStorage.setItem('al_barakah_admin', 'true');
    } else {
      sessionStorage.removeItem('al_barakah_admin');
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status };
          saveOrderToFirestore(updated);
          return updated;
        }
        return ord;
      })
    );
  };

  const updateOrderCourier = (
    orderId: string,
    courier: 'pathao' | 'steadfast' | 'none',
    trackingId?: string,
    courierStatus?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          let updated: Order;
          if (courier === 'none') {
            const { courier: _, courierTrackingId: __, courierStatus: ___, ...rest } = ord;
            updated = rest as Order;
          } else {
            updated = {
              ...ord,
              courier,
              courierTrackingId: trackingId,
              courierStatus: courierStatus || 'Consignment Created'
            } as Order;
          }
          saveOrderToFirestore(updated);
          return updated;
        }
        return ord;
      })
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    deleteOrderFromFirestore(orderId);
  };

  const deleteUser = (userId: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const resetStoreData = () => {
    if (window.confirm(currentLanguage === 'bn' ? 'আপনি কি নিশ্চিত যে আপনি সমস্ত স্টোর ডেটা রিসেট করতে চান?' : 'Are you sure you want to reset all store data to factory defaults?')) {
      setProducts(initialProducts);
      setOrders([]);
      setUsersList([]);
      setCurrentUser(null);
      setCart([]);
      setWishlist([]);
      sessionStorage.removeItem('al_barakah_admin');
      setAdminLoggedIn(false);
      setCurrentPageState('home');
    }
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        usersList,
        currentUser,
        currentLanguage,
        currentPage,
        selectedProduct,
        adminLoggedIn,
        newOrderNotification,
        setNewOrderNotification,
        
        addProduct,
        updateProduct,
        deleteProduct,
        
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        
        toggleWishlist,
        isInWishlist,
        
        placeOrder,
        
        loginOrRegister,
        loginWithGoogleAuth,
        logoutUser,
        
        setLanguage,
        setCurrentPage,
        setSelectedProduct,
        setAdminLoggedIn: setAdminLogged,
        
        updateOrderStatus,
        updateOrderCourier,
        deleteOrder,
        deleteUser,
        resetStoreData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
