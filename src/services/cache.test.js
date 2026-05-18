import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCache, setCache } from './cache';

describe('cache', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it('returns null for a missing key', () => {
    expect(getCache('nonexistent')).toBeNull();
  });

  it('stores and retrieves data', () => {
    setCache('test_key', { value: 42 });
    expect(getCache('test_key')).toEqual({ value: 42 });
  });

  it('returns null after expiration (3600001 ms)', () => {
    setCache('test_key', { value: 42 });
    vi.advanceTimersByTime(3600001);
    expect(getCache('test_key')).toBeNull();
  });

  it('returns data before expiration (3599999 ms)', () => {
    setCache('test_key', { value: 42 });
    vi.advanceTimersByTime(3599999);
    expect(getCache('test_key')).toEqual({ value: 42 });
  });
});
