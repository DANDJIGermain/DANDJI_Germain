import { useState, useEffect, useRef } from "react";
import Script from "next/script";

const LanguageSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState("fr");

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    // Auto-detect and set language
    const hasCookie = document.cookie.includes("googtrans=");
    if (!hasCookie) {
      const browserLang = navigator.language.slice(0, 2).toLowerCase();
      let defaultLang = "fr";
      if (["en", "es", "de"].includes(browserLang)) {
        defaultLang = browserLang;
      }
      
      if (defaultLang !== "fr") {
        document.cookie = `googtrans=/fr/${defaultLang}; path=/;`;
        document.cookie = `googtrans=/fr/${defaultLang}; domain=.${window.location.hostname}; path=/;`;
        window.location.reload();
      }
    } else {
      // Read current language from cookie
      const match = document.cookie.match(/googtrans=\/fr\/([a-z]{2})/);
      if (match && match[1]) {
        setLang(match[1]);
      } else {
        setLang("fr");
      }
    }

    // Click outside listener
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    if (newLang === "fr") {
      // clear cookie
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
    } else {
      document.cookie = `googtrans=/fr/${newLang}; path=/;`;
      document.cookie = `googtrans=/fr/${newLang}; domain=.${window.location.hostname}; path=/;`;
    }
    window.location.reload();
  };

  if (!mounted) return null;

  const languages = [
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'de', label: 'DE', flag: '🇩🇪' },
  ];
  const currentLanguage = languages.find(l => l.code === lang) || languages[0];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        iframe.goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .goog-te-balloon-frame {
          display: none !important;
        }
        font {
          background: transparent !important;
          box-shadow: none !important;
        }
      `}} />
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 cursor-pointer text-sm font-bold uppercase text-dark focus:outline-none dark:text-darkmode-light px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <span className="text-base">{currentLanguage.flag}</span>
          <span>{currentLanguage.label}</span>
          <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 py-2 w-28 bg-white dark:bg-darkmode-body border border-border dark:border-darkmode-border rounded-lg shadow-xl z-[99]">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  changeLanguage(l.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-start gap-3 px-4 py-2 text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${lang === l.code ? 'text-primary' : 'text-dark dark:text-darkmode-light'}`}
              >
                <span className="text-base">{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'fr',
              includedLanguages: 'fr,en,es,de',
              autoDisplay: false
            }, 'google_translate_element');
          }
        `}
      </Script>
    </>
  );
};

export default LanguageSwitcher;
