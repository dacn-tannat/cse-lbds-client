import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])

  constructor(callback: IntersectionObserverCallback) {
    // Immediately call the callback with empty entries
    callback([], this);
  }
}

window.IntersectionObserver = MockIntersectionObserver as any;

// Mock ResizeObserver (needed for Radix UI)
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

window.ResizeObserver = MockResizeObserver;

// Mock window.matchMedia (needed for responsive components)
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock requestAnimationFrame
const rAF = vi.fn((callback: FrameRequestCallback): number => {
  return setTimeout(() => callback(Date.now()), 0) as unknown as number;
});

window.requestAnimationFrame = rAF;

window.cancelAnimationFrame = vi.fn((id: number) => {
  clearTimeout(id);
});

// Extend Vitest's expect method with testing-library methods
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
}); 