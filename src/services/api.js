import { getCache, setCache } from './cache';

const BASE_URL = 'https://itx-frontend-test.onrender.com/api';

export const getProducts = async () => {
  const cacheKey = 'products_list';
  const cached = getCache(cacheKey);
  if (cached) return cached;
  const response = await fetch(`${BASE_URL}/product`);
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
};

export const getProduct = async (id) => {
  const cacheKey = `product_${id}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;
  const response = await fetch(`${BASE_URL}/product/${id}`);
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
};

export const addToCart = async (id, colorCode, storageCode) => {
  const response = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, colorCode, storageCode }),
  });
  return response.json();
};
