import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';
import { CartProvider } from '../context/CartContext';
import * as api from '../services/api';

vi.mock('../services/api');

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe('useCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shouldReturnZeroAsTheInitialCartCount', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cartCount).toBe(0);
  });

  it('shouldInitialiseCartCountFromLocalStorage', () => {
    localStorage.setItem('cartCount', '4');
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cartCount).toBe(4);
  });

  it('shouldReplaceCartCountWithTheApiResponseValue', async () => {
    api.addToCart.mockResolvedValue({ count: 5 });
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.addToCart('1', 1, 2);
    });
    expect(result.current.cartCount).toBe(5);
  });

  it('shouldNotAccumulateCartCountAcrossMultipleAdditions', async () => {
    api.addToCart
      .mockResolvedValueOnce({ count: 3 })
      .mockResolvedValueOnce({ count: 3 });
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.addToCart('1', 1, 2);
      await result.current.addToCart('1', 1, 2);
    });
    expect(result.current.cartCount).toBe(3);
  });

  it('shouldPersistCartCountToLocalStorageAfterUpdate', async () => {
    api.addToCart.mockResolvedValue({ count: 7 });
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.addToCart('1', 1, 2);
    });
    expect(localStorage.getItem('cartCount')).toBe('7');
  });

  it('shouldPropagateApiErrorsToTheCaller', async () => {
    api.addToCart.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useCart(), { wrapper });
    await expect(
      act(() => result.current.addToCart('1', 1, 2))
    ).rejects.toThrow('Network error');
  });
});
