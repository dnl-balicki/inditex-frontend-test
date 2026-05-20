import { getCache, setCache } from './cache';
import { mapProduct } from '../utils/productMapper';

const BASE_URL = 'https://itx-frontend-test.onrender.com/api';

const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export const getProducts = async (signal) => {
  const cacheKey = 'products_list';
  const cached = getCache(cacheKey);
  if (cached) return cached;
  const data = await request(`${BASE_URL}/product`, { signal });
  setCache(cacheKey, data);
  return data;
};

export const getProduct = async (id, signal) => {
  const cacheKey = `product_${id}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;
  const data = mapProduct(await request(`${BASE_URL}/product/${id}`, { signal }));
  setCache(cacheKey, data);
  return data;
};

export const addToCart = async (id, colorCode, storageCode) => {
  return request(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, colorCode, storageCode }),
  });
};
