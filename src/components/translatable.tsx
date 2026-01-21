"use client";

import { useLanguage } from '@/hooks/use-language';
import { useEffect, useState } from 'react';

interface TranslatableProps {
  text: string;
  as?: React.ElementType;
  className?: string;
}

export function Translatable({
  text,
  as: Component = 'span',
  className,
}: TranslatableProps) {
  const { language, translate } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    let isMounted = true;
    const doTranslate = async () => {
      const newText = language === 'en' ? text : await translate(text);
      if (isMounted) {
        setTranslatedText(newText);
      }
    };
    doTranslate();
    return () => {
      isMounted = false;
    };
  }, [language, text, translate]);

  return <Component className={className}>{translatedText}</Component>;
}
