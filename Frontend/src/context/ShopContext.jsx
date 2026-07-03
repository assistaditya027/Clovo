import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ShopContext = createContext();

const PRODUCT_CACHE_KEY = 'clovo.products.cache.v1';
const PRODUCT_CACHE_TTL = 10 * 60 * 1000;

const clearStoredAuth = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('cartItems');
  } catch {
    // ignore storage failures
  }
};

const readProductCache = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PRODUCT_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.products)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const ShopContextProvider = (props) => {
  const currency = '\u20B9';
  const deliveryFeeEnv = Number(import.meta.env.VITE_DELIVERY_FEE);
  const delivery_fee = Number.isFinite(deliveryFeeEnv) ? deliveryFeeEnv : 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const apiBase = backendUrl ? backendUrl.replace(/\/+$/, '') : '';

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const initialProductCache = readProductCache();
  const [products, setProducts] = useState(() => initialProductCache?.products ?? []);
  const [token, setToken] = useState('');

  // ── Wishlist: stored as array of product _id strings ──
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();
  const productsById = useMemo(
    () => new Map(products.map((product) => [product._id, product])),
    [products],
  );

  // ── Safe localStorage helpers ──
  const safeGet = (key) => {
    if (typeof window === 'undefined') return null;
    try { return window.localStorage.getItem(key); }
    catch { return null; }
  };

  const safeSet = (key, value) => {
    if (typeof window === 'undefined') return;
    try { window.localStorage.setItem(key, value); }
    catch { /* ignore */ }
  };

  const handleAuthFailure = useCallback((message = 'Session expired. Please sign in again.') => {
    clearStoredAuth();
    setToken('');
    setCartItems({});
    setWishlist([]);
    toast.error(message);
    navigate('/login');
  }, [navigate]);

  const requestWithAuth = useCallback(
    async (requestFn) => {
      try {
        return await requestFn();
      } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || error.message || '';
        if (status === 401 || /jwt expired/i.test(message)) {
          handleAuthFailure();
          return { unauthorized: true };
        }
        throw error;
      }
    },
    [handleAuthFailure],
  );

  // ══════════════════════════════════════════
  //  WISHLIST FUNCTIONS
  // ══════════════════════════════════════════

  // Toggle a product in/out of wishlist (syncs with backend)
  const toggleWishlist = async (productId) => {
    try {
      if (token) {
        // If user is logged in, sync with backend
        if (!apiBase) { toast.error('Backend URL is not configured.'); return; }
        const response = await requestWithAuth(() =>
          axios.post(
            `${apiBase}/api/wishlist/toggle`,
            { productId },
            { headers: { token } },
          ),
        );
        if (response?.unauthorized) return;
        if (response.data.success) {
          setWishlist(response.data.wishlist || []);
          const action = response.data.isWishlisted ? 'Added to' : 'Removed from';
          toast.success(`${action} Wishlist`);
        } else {
          toast.error(response.data.message);
        }
      } else {
        // If not logged in, use localStorage
        setWishlist((prev) => {
          const updated = prev.includes(productId)
            ? prev.filter((id) => id !== productId)
            : [...prev, productId];
          safeSet('wishlist', JSON.stringify(updated));
          return updated;
        });
        toast.success(
          wishlist.includes(productId) ? 'Removed from Wishlist' : 'Added to Wishlist'
        );
      }
    } catch (error) {
      console.warn(error);
      toast.error(error.message || 'Error updating wishlist');
    }
  };

  // Check if a product is wishlisted
  const isWishlisted = (productId) => wishlist.includes(productId);

  // Get wishlist count
  const getWishlistCount = () => wishlist.length;

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = safeGet('wishlist');
    if (stored) {
      try { setWishlist(JSON.parse(stored)); }
      catch { /* ignore */ }
    }
  }, []);

  // Load wishlist from backend when user logs in
  const loadUserWishlist = useCallback(async (authToken) => {
    if (!apiBase) return;
    try {
      const response = await axios.post(
        `${apiBase}/api/wishlist/get`,
        {},
        { headers: { token: authToken } }
      );
      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
      } else {
        console.warn('Failed to load wishlist:', response.data.message);
      }
    } catch (error) {
      console.warn('Error loading wishlist:', error);
    }
  }, [apiBase]);

  // ══════════════════════════════════════════
  //  CART FUNCTIONS (unchanged)
  // ══════════════════════════════════════════

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Please Select a size');
      return;
    }
    const cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    if (token) {
      try {
        if (!apiBase) { toast.error('Backend URL is not configured.'); return; }
        const response = await requestWithAuth(() =>
          axios.post(`${apiBase}/api/cart/add`, { itemId, size }, { headers: { token } }),
        );
        if (response?.unauthorized) return;
      } catch (error) {
        console.warn(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) totalCount += cartItems[items][item];
        } catch (error) { console.warn(error); }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    if (token) {
      try {
        if (!apiBase) { toast.error('Backend URL is not configured.'); return; }
        const response = await requestWithAuth(() =>
          axios.post(`${apiBase}/api/cart/update`, { itemId, size, quantity }, { headers: { token } }),
        );
        if (response?.unauthorized) return;
      } catch (error) {
        console.warn(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = productsById.get(items);
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0)
            totalAmount += cartItems[items][item] * itemInfo.price;
        } catch (error) {
          console.warn(error);
          toast.error(error.message);
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = useCallback(async () => {
    try {
      if (!apiBase) { toast.error('Backend URL is not configured.'); return; }
      const cached = readProductCache();

      if (cached?.products?.length) {
        setProducts(cached.products);
        const isFresh = Date.now() - cached.timestamp < PRODUCT_CACHE_TTL;
        if (isFresh) return;
      }

      const response = await axios.get(`${apiBase}/api/product/list`);
      if (response.data.success) {
        const nextProducts = response.data.products || [];
        setProducts(nextProducts);
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(
              PRODUCT_CACHE_KEY,
              JSON.stringify({ timestamp: Date.now(), products: nextProducts }),
            );
          } catch {
            // Ignore cache write failures.
          }
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.warn(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  }, [apiBase]);

  const loadUserCart = useCallback(async (authToken) => {
    if (!apiBase) return;
    try {
      const response = await axios.post(
        `${apiBase}/api/cart/get`, {},
        { headers: { token: authToken } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.warn(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  }, [apiBase]);

  useEffect(() => { getProductsData(); }, [getProductsData]);

  useEffect(() => {
    if (!token) {
      const storedToken = safeGet('token');
      if (storedToken) setToken(storedToken);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadUserCart(token);
      loadUserWishlist(token);
    } else {
      const storedCart = safeGet('cartItems');
      if (storedCart) {
        try { setCartItems(JSON.parse(storedCart)); }
        catch (error) { console.warn(error); }
      }
    }
  }, [token, loadUserCart, loadUserWishlist]);

  useEffect(() => {
    if (!token) safeSet('cartItems', JSON.stringify(cartItems));
  }, [cartItems, token]);

  const value = useMemo(
    () => ({
      products,
      currency,
      delivery_fee,
      search,
      setSearch,
      showSearch,
      setShowSearch,
      cartItems,
      setCartItems,
      addToCart,
      getCartCount,
      updateQuantity,
      getCartAmount,
      navigate,
      backendUrl,
      setToken,
      token,
      // Wishlist
      wishlist,
      toggleWishlist,
      isWishlisted,
      getWishlistCount,
    }),
    [
      products,
      currency,
      delivery_fee,
      search,
      setSearch,
      showSearch,
      setShowSearch,
      cartItems,
      setCartItems,
      addToCart,
      getCartCount,
      updateQuantity,
      getCartAmount,
      navigate,
      backendUrl,
      setToken,
      token,
      wishlist,
      toggleWishlist,
      isWishlisted,
      getWishlistCount,
    ],
  );

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
