'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { VoPlatform } from './vo-platform-types';

const STORAGE_KEY = 'a11y-lens:vo-platform';

function detectDefaultPlatform(): VoPlatform {
  if (typeof navigator === 'undefined') return 'macos';
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && 'ontouchend' in document)) {
    return 'ios';
  }
  return 'macos';
}

function readStoredPlatform(): VoPlatform | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'macos' || v === 'ios') return v;
  } catch {
    // SSR or restricted context
  }
  return null;
}

type VoPlatformContextValue = {
  platform: VoPlatform;
  setPlatform: (p: VoPlatform) => void;
  togglePlatform: () => void;
};

const VoPlatformContext = createContext<VoPlatformContextValue>({
  platform: 'macos',
  setPlatform: () => {},
  togglePlatform: () => {},
});

export function VoPlatformProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatformState] = useState<VoPlatform>(
    () => readStoredPlatform() ?? detectDefaultPlatform(),
  );

  const setPlatform = useCallback((p: VoPlatform) => {
    setPlatformState(p);
    try {
      localStorage.setItem(STORAGE_KEY, p);
    } catch {
      // ignore
    }
  }, []);

  const togglePlatform = useCallback(() => {
    setPlatform(platform === 'macos' ? 'ios' : 'macos');
  }, [platform, setPlatform]);

  useEffect(() => {
    const stored = readStoredPlatform();
    if (stored && stored !== platform) {
      setPlatformState(stored);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VoPlatformContext.Provider value={{ platform, setPlatform, togglePlatform }}>
      {children}
    </VoPlatformContext.Provider>
  );
}

export function useVoPlatform() {
  return useContext(VoPlatformContext);
}
