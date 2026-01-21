"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { translateContent } from '@/ai/flows/translate-content';

type Language = 'en' | 'af';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (text: string) => Promise<string>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // In a real app, you might load a saved preference from localStorage
  }, []);

  const translate = useCallback(async (text: string): Promise<string> => {
    if (language === 'en') return text;
    if (translations[text]) return translations[text];

    try {
      const result = await translateContent({ text, targetLanguage: 'af' });
      setTranslations((prev) => ({ ...prev, [text]: result.translatedText }));
      return result.translatedText;
    } catch (error) {
      console.error("Translation failed:", error);
      return text; // Fallback to original text on error
    }
  }, [language, translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};
