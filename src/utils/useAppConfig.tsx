import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';
type Lang = 'ES' | 'EN' | 'CA';

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('atm_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('atm_lang');
    if (saved === 'ES' || saved === 'EN' || saved === 'CA') return saved;
    return 'ES';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('atm_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang.toLowerCase();
    localStorage.setItem('atm_lang', lang);
  }, [lang]);

  return (
    <AppContext.Provider value={{ theme, setTheme: setThemeState, lang, setLang: setLangState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppConfig() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppConfig must be used within an AppProvider');
  }
  return context;
}
