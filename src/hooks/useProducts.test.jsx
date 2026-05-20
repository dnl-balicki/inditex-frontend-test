import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useProducts } from './useProducts';
import * as api from '../services/api';

vi.mock('../services/api');

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shouldInitialiseWithIsLoadingTrueAndEmptyData', () => {
    api.getProducts.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useProducts());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('shouldReturnDataAndSetIsLoadingFalseOnSuccess', async () => {
    const products = [{ id: '1', brand: 'Apple', model: 'iPhone 12', price: '999' }];
    api.getProducts.mockResolvedValue(products);
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(products);
    expect(result.current.error).toBeNull();
  });

  it('shouldSetErrorMessageWhenFetchFails', async () => {
    api.getProducts.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('Failed to load products. Please try again later.');
    expect(result.current.data).toEqual([]);
  });

  it('shouldNotSetErrorStateWhenFetchIsAborted', async () => {
    api.getProducts.mockRejectedValue(new DOMException('Aborted', 'AbortError'));
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeNull();
  });

  it('shouldPassAnAbortSignalToGetProducts', async () => {
    api.getProducts.mockResolvedValue([]);
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(api.getProducts).toHaveBeenCalledWith(expect.any(AbortSignal));
  });

  it('shouldExposeARetryFunction', () => {
    api.getProducts.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useProducts());
    expect(result.current.retry).toBeInstanceOf(Function);
  });

  it('shouldRefetchDataWhenRetryIsCalled', async () => {
    const products = [{ id: '1', brand: 'Apple', model: 'iPhone 12', price: '999' }];
    api.getProducts
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(products);

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.error).not.toBeNull());

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.data).toEqual(products));
    expect(result.current.error).toBeNull();
  });
});
