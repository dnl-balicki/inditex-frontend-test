import { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCountState] = useState(() => {
    try {
      const saved = localStorage.getItem('cartCount');
      const parsed = parseInt(saved, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    } catch {
      return 0;
    }
  });

  const setCartCount = (count) => {
    localStorage.setItem('cartCount', String(count));
    setCartCountState(count);
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}
