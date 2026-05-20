import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { addToCart as addToCartApi } from '../services/api';

export function useCart() {
  const { cartCount, setCartCount } = useContext(CartContext);

  const addToCart = async (id, colorCode, storageCode) => {
    const result = await addToCartApi(id, colorCode, storageCode);
    setCartCount(result.count);
    return result;
  };

  return { cartCount, addToCart };
}
