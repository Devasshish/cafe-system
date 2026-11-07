import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'cafe_royale_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  /**
   * Add item to cart. Prevents adding unavailable products.
   */
  const addToCart = (item, quantity = 1) => {
    if (!item || !item.isAvailable) {
      return { success: false, message: 'This item is currently unavailable.' };
    }

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i._id === item._id);

      if (existingIndex > -1) {
        // Increment existing quantity
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      // Add new item to cart
      return [
        ...prevItems,
        {
          _id: item._id,
          name: item.name,
          price: Number(item.price),
          image: item.image,
          category: item.category,
          preparationTime: item.preparationTime || 5,
          isAvailable: item.isAvailable,
          quantity: Math.max(1, quantity),
        },
      ];
    });

    return { success: true };
  };

  /**
   * Increase item quantity by 1
   */
  const increaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  /**
   * Decrease item quantity by 1; removes item if quantity reaches 0
   */
  const decreaseQuantity = (itemId) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item._id === itemId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  /**
   * Remove item from cart completely
   */
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  /**
   * Clear all items from cart (called upon successful order)
   */
  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing localStorage cart:', e);
    }
  };

  /**
   * Check quantity of an item in cart
   */
  const getItemQuantity = (itemId) => {
    const item = cartItems.find((i) => i._id === itemId);
    return item ? item.quantity : 0;
  };

  // Computed values
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = Math.round(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100
  ) / 100;
  const totalAmount = subtotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        subtotal,
        totalAmount,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;

