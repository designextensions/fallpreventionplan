import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Senior-first accessibility preferences. Dr. Angell explicitly asked for a
// large-text option and a grayscale / high-contrast mode. These persist across
// visits and are applied to <html> so the whole app responds.

export type TextScale = "normal" | "large" | "xlarge";

export interface A11ySettings {
  textScale: TextScale;
  contrast: boolean; // high-contrast mode
  grayscale: boolean; // reduce color
  reduceMotion: boolean; // reduce animation
}

interface A11yContextValue extends A11ySettings {
  setTextScale: (s: TextScale) => void;
  toggleContrast: () => void;
  toggleGrayscale: () => void;
  toggleReduceMotion: () => void;
  reset: () => void;
}

const STORAGE_KEY = "fpp.a11y";

const DEFAULTS: A11ySettings = {
  textScale: "normal",
  contrast: false,
  grayscale: false,
  reduceMotion: false,
};

function readStored(): A11ySettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<A11ySettings>) };
  } catch {
    return DEFAULTS;
  }
}

function apply(settings: A11ySettings) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.setAttribute("data-text-scale", settings.textScale);
  el.classList.toggle("a11y-contrast", settings.contrast);
  el.classList.toggle("a11y-grayscale", settings.grayscale);
  el.classList.toggle("a11y-reduce-motion", settings.reduceMotion);
}

const A11yContext = createContext<A11yContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(() => readStored());

  useEffect(() => {
    apply(settings);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore persistence failures (e.g. private mode)
    }
  }, [settings]);

  const setTextScale = useCallback((textScale: TextScale) => {
    setSettings((s) => ({ ...s, textScale }));
  }, []);
  const toggleContrast = useCallback(() => {
    setSettings((s) => ({ ...s, contrast: !s.contrast }));
  }, []);
  const toggleGrayscale = useCallback(() => {
    setSettings((s) => ({ ...s, grayscale: !s.grayscale }));
  }, []);
  const toggleReduceMotion = useCallback(() => {
    setSettings((s) => ({ ...s, reduceMotion: !s.reduceMotion }));
  }, []);
  const reset = useCallback(() => setSettings(DEFAULTS), []);

  const value = useMemo<A11yContextValue>(
    () => ({
      ...settings,
      setTextScale,
      toggleContrast,
      toggleGrayscale,
      toggleReduceMotion,
      reset,
    }),
    [settings, setTextScale, toggleContrast, toggleGrayscale, toggleReduceMotion, reset],
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useAccessibility(): A11yContextValue {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useAccessibility must be used inside <AccessibilityProvider>");
  return ctx;
}
