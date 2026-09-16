import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';
type Lang = 'ES' | 'EN';

export function useAppConfig() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang');
    if (saved === 'ES' || saved === 'EN') return saved;
    return 'ES';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  return { theme, setTheme: setThemeState, lang, setLang: setLangState };
}
