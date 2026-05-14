import { useState, useEffect } from "react";

const LanguageSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState("FR");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="language-switcher ml-4 flex items-center">
      <span className="mr-2 text-xl">
        {lang === "FR" ? "🇫🇷" : lang === "EN" ? "🇺🇸" : "🇪🇸"}
      </span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="cursor-pointer border-none bg-transparent text-sm font-bold uppercase text-dark focus:outline-none dark:text-darkmode-light"
      >
        <option value="FR" className="dark:bg-darkmode-body">FR</option>
        <option value="EN" className="dark:bg-darkmode-body">EN</option>
        <option value="ES" className="dark:bg-darkmode-body">ES</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
