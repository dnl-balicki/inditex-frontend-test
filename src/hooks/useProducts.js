import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/api';

export function useProducts() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    getProducts(controller.signal)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled && err.name !== 'AbortError') {
          setError('Failed to load products. Please try again later.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [retryKey]);

  const retry = useCallback(() => setRetryKey((k) => k + 1), []);

  return { data, isLoading, error, retry };
}
