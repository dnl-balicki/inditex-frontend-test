import { useState, useEffect, useCallback } from 'react';
import { getProduct } from '../services/api';

export function useProductDetail(id) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setData(null);

    getProduct(id, controller.signal)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled && err.name !== 'AbortError') {
          setError('Failed to load product. Please try again later.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [id, retryKey]);

  const retry = useCallback(() => setRetryKey((k) => k + 1), []);

  return { data, isLoading, error, retry };
}
