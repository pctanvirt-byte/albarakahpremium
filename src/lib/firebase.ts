import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  initializeFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy
} from "firebase/firestore";

// Read configuration from the local firebase config
import firebaseConfigData from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfigData);

// Initialize Firebase Auth & Providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

// Initialize Firestore Database with forced long-polling to bypass WebSocket iframe blocks
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Helper function: Log in with Google Popup (handles iframe constraints gracefully)
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Firebase Google Sign-in Error:", error);
    throw error;
  }
};

// Helper function: Sign out
export const logoutFromFirebase = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Firebase Sign-out Error:", error);
    throw error;
  }
};

// Firestore helper: Sync user profile
export const syncUserProfile = async (user: FirebaseUser, extraData: any = {}) => {
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    const profile = {
      id: user.uid,
      name: user.displayName || extraData.name || "Al Barakah Member",
      phone: user.phoneNumber || extraData.phone || "",
      email: user.email || "",
      address: extraData.address || "",
      avatar: user.photoURL || "",
      role: "customer" as const,
      wishlistProductIds: extraData.wishlistProductIds || [],
      createdAt: userSnap.exists() ? userSnap.data().createdAt : new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    await setDoc(userRef, profile, { merge: true });
    return profile;
  } catch (error) {
    console.error("Failed to sync user profile in Firestore:", error);
    return null;
  }
};

// Firestore helper: Sync order
export const saveOrderToFirestore = async (order: any) => {
  try {
    const orderRef = doc(db, "orders", order.id);
    await setDoc(orderRef, order);
  } catch (error) {
    console.error("Failed to save order to Firestore:", error);
  }
};

// Firestore helper: Fetch orders for user
export const fetchUserOrdersFromFirestore = async (userId: string) => {
  try {
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const ordersList: any[] = [];
    querySnapshot.forEach((doc) => {
      ordersList.push(doc.data());
    });
    return ordersList;
  } catch (error) {
    console.error("Failed to fetch user orders from Firestore:", error);
    return [];
  }
};

// Firestore helper: Fetch all orders (Admin)
export const fetchAllOrdersFromFirestore = async () => {
  try {
    const ordersCol = collection(db, "orders");
    const querySnapshot = await getDocs(ordersCol);
    const ordersList: any[] = [];
    querySnapshot.forEach((doc) => {
      ordersList.push(doc.data());
    });
    return ordersList;
  } catch (error) {
    console.error("Failed to fetch all orders from Firestore:", error);
    return [];
  }
};

// Firestore helper: Fetch products
export const fetchProductsFromFirestore = async () => {
  try {
    const productsCol = collection(db, "products");
    const querySnapshot = await getDocs(productsCol);
    const productsList: any[] = [];
    querySnapshot.forEach((doc) => {
      productsList.push(doc.data());
    });
    return productsList;
  } catch (error) {
    console.error("Failed to fetch products from Firestore:", error);
    return [];
  }
};

// Firestore helper: Sync products (saves fallback local products if none are in DB yet)
export const syncProductsToFirestore = async (fallbackProducts: any[]) => {
  try {
    const productsInDB = await fetchProductsFromFirestore();
    if (productsInDB.length === 0) {
      console.log("Seeding fallback products into Firestore...");
      for (const p of fallbackProducts) {
        const productRef = doc(db, "products", p.id);
        await setDoc(productRef, p);
      }
      return fallbackProducts;
    }
    return productsInDB;
  } catch (error) {
    console.error("Failed to sync products to Firestore:", error);
    return fallbackProducts;
  }
};

// Firestore helper: Save single product
export const saveProductToFirestore = async (product: any) => {
  try {
    const productRef = doc(db, "products", product.id);
    await setDoc(productRef, product);
  } catch (error) {
    console.error("Failed to save product to Firestore:", error);
  }
};

// Firestore helper: Delete product
export const deleteProductFromFirestore = async (productId: string) => {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Failed to delete product from Firestore:", error);
  }
};
