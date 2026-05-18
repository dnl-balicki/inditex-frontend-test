import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(() => {
    const saved = localStorage.getItem('cartCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  const updateCartCount = (newItemsCount) => {
    setCartCount((prevCount) => {
      const total = prevCount + newItemsCount;
      localStorage.setItem('cartCount', String(total));
      return total;
    });
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
