"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Cart, CartItem } from '@/types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (item: Omit<CartItem, '_id'>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'guest_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();

  // Initialize cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      if (userInfo) {
        // User is logged in, fetch from database
        await fetchCartFromDB();
      } else {
        // Guest user, load from localStorage
        loadGuestCart();
      }
      setLoading(false);
    };

    initializeCart();
  }, [userInfo]);

  // Fetch cart from database for logged-in users
  const fetchCartFromDB = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/cart', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  // Load guest cart from localStorage
  const loadGuestCart = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const guestCart: Cart = JSON.parse(stored);
        setCart(guestCart);
      } else {
        setCart({ items: [], totalPrice: 0 });
      }
    } catch (error) {
      console.error('Failed to load guest cart:', error);
      setCart({ items: [], totalPrice: 0 });
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = (cartData: Cart) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error('Failed to save guest cart:', error);
    }
  };

  // Calculate total price for guest cart
  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.itemPrice * item.quantity, 0);
  };

  // Merge guest cart with user cart when logging in
  const mergeGuestCart = async () => {
    try {
      const guestCartStr = localStorage.getItem(CART_STORAGE_KEY);
      if (!guestCartStr) return;

      const guestCart: Cart = JSON.parse(guestCartStr);
      if (guestCart.items.length === 0) return;

      const res = await fetch('http://localhost:5001/api/cart/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ guestCartItems: guestCart.items }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data);
        // Clear guest cart from localStorage after merge
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to merge cart:', error);
    }
  };

  // Call merge when user logs in
  useEffect(() => {
    if (userInfo && cart && !cart._id) {
      // User just logged in and has a guest cart
      mergeGuestCart();
    }
  }, [userInfo]);

  // Add item to cart
  const addToCart = async (item: Omit<CartItem, '_id'>) => {
    if (userInfo) {
      // Logged-in user: Add to database
      try {
        const res = await fetch('http://localhost:5001/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(item),
        });

        if (res.ok) {
          const data = await res.json();
          setCart(data);
        } else {
          const error = await res.json();
          throw new Error(error.error || 'Failed to add to cart');
        }
      } catch (error: any) {
        console.error('Failed to add to cart:', error);
        alert(error.message);
      }
    } else {
      // Guest user: Add to localStorage
      const currentCart = cart || { items: [], totalPrice: 0 };
      
      // Check if identical item exists
      const existingItemIndex = currentCart.items.findIndex(cartItem => {
        return (
          cartItem.productId === item.productId &&
          JSON.stringify(cartItem.selectedColor) === JSON.stringify(item.selectedColor) &&
          JSON.stringify(cartItem.selectedSize) === JSON.stringify(item.selectedSize) &&
          JSON.stringify(cartItem.selectedFrame) === JSON.stringify(item.selectedFrame) &&
          cartItem.selectedDesign === item.selectedDesign &&
          cartItem.generatedImage === item.generatedImage &&
          cartItem.customText === item.customText
        );
      });

      if (existingItemIndex > -1) {
        // Increment quantity
        currentCart.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item with temporary ID
        currentCart.items.push({
          ...item,
          _id: `guest_${Date.now()}_${Math.random()}`,
        });
      }

      currentCart.totalPrice = calculateTotal(currentCart.items);
      setCart(currentCart);
      saveGuestCart(currentCart);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    if (userInfo) {
      // Logged-in user
      try {
        const res = await fetch('http://localhost:5001/api/cart/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ itemId, quantity }),
        });

        if (res.ok) {
          const data = await res.json();
          setCart(data);
        }
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    } else {
      // Guest user
      if (!cart) return;
      
      const updatedItems = cart.items.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      );
      
      const updatedCart = {
        ...cart,
        items: updatedItems,
        totalPrice: calculateTotal(updatedItems),
      };
      
      setCart(updatedCart);
      saveGuestCart(updatedCart);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    if (userInfo) {
      // Logged-in user
      try {
        const res = await fetch(`http://localhost:5001/api/cart/remove/${itemId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setCart(data);
        }
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    } else {
      // Guest user
      if (!cart) return;
      
      const updatedItems = cart.items.filter(item => item._id !== itemId);
      const updatedCart = {
        ...cart,
        items: updatedItems,
        totalPrice: calculateTotal(updatedItems),
      };
      
      setCart(updatedCart);
      saveGuestCart(updatedCart);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (userInfo) {
      // Logged-in user
      try {
        const res = await fetch('http://localhost:5001/api/cart/clear', {
          method: 'DELETE',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setCart(data);
        }
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      // Guest user
      const emptyCart = { items: [], totalPrice: 0 };
      setCart(emptyCart);
      saveGuestCart(emptyCart);
    }
  };

  // Calculate item count
  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};