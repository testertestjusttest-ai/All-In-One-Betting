"use client";

import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "bn" | "hi";

const labels: Record<Locale, { name: string; native: string; title: string; subtitle: string; continue: string }> = {
  en: { name: "English", native: "English", title: "Choose your language", subtitle: "Select a language for the BetBass website.", continue: "Continue" },
  bn: { name: "Bengali", native: "বাংলা", title: "আপনার ভাষা নির্বাচন করুন", subtitle: "BetBass ওয়েবসাইটের জন্য একটি ভাষা নির্বাচন করুন।", continue: "চালিয়ে যান" },
  hi: { name: "Hindi", native: "हिन्दी", title: "अपनी भाषा चुनें", subtitle: "BetBass वेबसाइट के लिए एक भाषा चुनें।", continue: "जारी रखें" },
};

const translations: Record<Locale, Record<string, string>> = {
  en: {},
  bn: {
    "Directory":"ডিরেক্টরি","Countries":"দেশসমূহ","Methodology":"পদ্ধতি","FAQ":"সাধারণ প্রশ্ন","Explore":"অন্বেষণ",
    "View all":"সব দেখুন","Featured platforms":"ফিচার্ড প্ল্যাটফর্ম","TOP CASINOS & PLATFORMS":"শীর্ষ ক্যাসিনো ও প্ল্যাটফর্ম",
    "GLOBAL BETTING & CASINO DIRECTORY":"গ্লোবাল বেটিং ও ক্যাসিনো ডিরেক্টরি","Compare betting & casino platforms":"বেটিং ও ক্যাসিনো প্ল্যাটফর্ম তুলনা করুন",
    "with clarity.":"স্বচ্ছতার সাথে।","Browse platforms":"প্ল্যাটফর্ম দেখুন","Explore countries":"দেশসমূহ দেখুন",
    "Structured profiles":"সুসংগঠিত প্রোফাইল","Consistent platform fields":"সামঞ্জস্যপূর্ণ প্ল্যাটফর্ম তথ্য",
    "Freshness aware":"তথ্যের আপডেট সচেতন","Verify current operator terms":"বর্তমান অপারেটর শর্ত যাচাই করুন",
    "Country context":"দেশভিত্তিক তথ্য","GEO data where available":"উপলভ্য GEO তথ্য",
    "Transparent links":"স্বচ্ছ লিংক","Affiliate disclosure included":"অ্যাফিলিয়েট প্রকাশ করা হয়েছে",
    "DISCOVER":"আবিষ্কার করুন","Find the right information faster.":"সঠিক তথ্য আরও দ্রুত খুঁজুন।",
    "Search, filter and compare the platforms currently published in the BetBass dataset.":"BetBass ডেটাসেটে থাকা প্ল্যাটফর্ম সার্চ, ফিল্টার ও তুলনা করুন।",
    "How BetBass works →":"BetBass কীভাবে কাজ করে →","Betting Sites":"বেটিং সাইট","Online Casinos":"অনলাইন ক্যাসিনো",
    "Sportsbooks":"স্পোর্টসবুক","Casino Bonuses":"ক্যাসিনো বোনাস","Betting Bonuses":"বেটিং বোনাস","All Countries":"সব দেশ",
    "GLOBAL GEO":"গ্লোবাল GEO","Explore by country":"দেশ অনুযায়ী দেখুন","View all countries →":"সব দেশ দেখুন →",
    "TRUST LAYER":"বিশ্বাসের স্তর","More than an affiliate link.":"শুধু একটি অ্যাফিলিয়েট লিংকের চেয়েও বেশি।",
    "Read our methodology →":"আমাদের পদ্ধতি পড়ুন →","FAQ":"সাধারণ প্রশ্ন","BetBass FAQ":"BetBass সাধারণ প্রশ্ন",
    "What is BetBass?":"BetBass কী?","How are bonus details handled?":"বোনাসের তথ্য কীভাবে পরিচালিত হয়?",
    "Does BetBass accept bets?":"BetBass কি বাজি গ্রহণ করে?","Are outbound links affiliate links?":"বাইরের লিংক কি অ্যাফিলিয়েট লিংক?",
    "About":"আমাদের সম্পর্কে","Privacy":"গোপনীয়তা","Terms":"শর্তাবলি","Responsible Gambling":"দায়িত্বশীল জুয়া",
    "Join Now":"এখনই যোগ দিন","Partner offer":"পার্টনার অফার","Platform profile":"প্ল্যাটফর্ম প্রোফাইল",
    "Explore the profile":"প্রোফাইল দেখুন","Ready to join?":"যোগ দিতে প্রস্তুত?",
    "Research profile":"রিসার্চ প্রোফাইল","Active profile":"সক্রিয় প্রোফাইল","Platform information":"প্ল্যাটফর্ম তথ্য",
    "Verified data":"যাচাইকৃত তথ্য",
  },
  hi: {
    "Directory":"डायरेक्टरी","Countries":"देश","Methodology":"कार्यप्रणाली","FAQ":"सामान्य प्रश्न","Explore":"एक्सप्लोर",
    "View all":"सभी देखें","Featured platforms":"फीचर्ड प्लेटफ़ॉर्म","TOP CASINOS & PLATFORMS":"शीर्ष कैसीनो और प्लेटफ़ॉर्म",
    "GLOBAL BETTING & CASINO DIRECTORY":"ग्लोबल बेटिंग और कैसीनो डायरेक्टरी","Compare betting & casino platforms":"बेटिंग और कैसीनो प्लेटफ़ॉर्म की तुलना करें",
    "with clarity.":"स्पष्टता के साथ।","Browse platforms":"प्लेटफ़ॉर्म देखें","Explore countries":"देश देखें",
    "Structured profiles":"सुव्यवस्थित प्रोफ़ाइल","Consistent platform fields":"सुसंगत प्लेटफ़ॉर्म जानकारी",
    "Freshness aware":"अपडेट जागरूक","Verify current operator terms":"वर्तमान ऑपरेटर शर्तें जांचें",
    "Country context":"देश संदर्भ","GEO data where available":"जहाँ उपलब्ध हो GEO डेटा",
    "Transparent links":"पारदर्शी लिंक","Affiliate disclosure included":"एफिलिएट खुलासा शामिल",
    "DISCOVER":"खोजें","Find the right information faster.":"सही जानकारी जल्दी खोजें।",
    "How BetBass works →":"BetBass कैसे काम करता है →","Betting Sites":"बेटिंग साइट्स","Online Casinos":"ऑनलाइन कैसीनो",
    "Sportsbooks":"स्पोर्ट्सबुक","Casino Bonuses":"कैसीनो बोनस","Betting Bonuses":"बेटिंग बोनस","All Countries":"सभी देश",
    "GLOBAL GEO":"ग्लोबल GEO","Explore by country":"देश के अनुसार देखें","View all countries →":"सभी देश देखें →",
    "TRUST LAYER":"विश्वसनीयता स्तर","More than an affiliate link.":"सिर्फ एक एफिलिएट लिंक से अधिक।",
    "Read our methodology →":"हमारी कार्यप्रणाली पढ़ें →","BetBass FAQ":"BetBass सामान्य प्रश्न",
    "What is BetBass?":"BetBass क्या है?","How are bonus details handled?":"बोनस जानकारी कैसे संभाली जाती है?",
    "Does BetBass accept bets?":"क्या BetBass दांव स्वीकार करता है?","Are outbound links affiliate links?":"क्या बाहरी लिंक एफिलिएट लिंक हैं?",
    "About":"हमारे बारे में","Privacy":"गोपनीयता","Terms":"शर्तें","Responsible Gambling":"जिम्मेदार जुआ",
    "Join Now":"अभी जुड़ें","Partner offer":"पार्टनर ऑफर","Platform profile":"प्लेटफ़ॉर्म प्रोफ़ाइल",
    "Explore the profile":"प्रोफ़ाइल देखें","Ready to join?":"जुड़ने के लिए तैयार हैं?",
    "Research profile":"रिसर्च प्रोफ़ाइल","Active profile":"सक्रिय प्रोफ़ाइल","Platform information":"प्लेटफ़ॉर्म जानकारी",
    "Verified data":"सत्यापित डेटा",
  },
};

const STORAGE_KEY = "betbass-language";

function applyTranslations(locale: Locale) {
  document.documentElement.lang = locale === "bn" ? "bn" : locale === "hi" ? "hi" : "en";
  const map = translations[locale];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.nodeValue?.trim()) nodes.push(node);
  }
  for (const node of nodes) {
    const raw = node.nodeValue || "";
    const leading = raw.match(/^\s*/)?.[0] || "";
    const trailing = raw.match(/\s*$/)?.[0] || "";
    const key = raw.trim();
    if (map[key]) node.nodeValue = leading + map[key] + trailing;
  }
}

export default function LanguageController() {
  const [locale, setLocale] = useState<Locale>("en");
  const [open, setOpen] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    const initial = saved === "bn" || saved === "hi" || saved === "en" ? saved : "en";
    setLocale(initial);
    setFirstVisit(!saved);
  }, []);

  useEffect(() => {
    applyTranslations(locale);
    const observer = new MutationObserver(() => applyTranslations(locale));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  const current = useMemo(() => labels[locale], [locale]);

  const choose = (next: Locale) => {
    setLocale(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    setFirstVisit(false);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="betbass-language-button"
        aria-label="Change language"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">文</span> {current.native}
      </button>

      {open && (
        <div className="betbass-language-backdrop" role="dialog" aria-modal="true" aria-label={current.title}>
          <div className="betbass-language-modal">
            <div className="betbass-language-kicker">BETBASS</div>
            <h2>{current.title}</h2>
            <p>{current.subtitle}</p>
            <div className="betbass-language-options">
              {(Object.keys(labels) as Locale[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={item === locale ? "is-selected" : ""}
                  onClick={() => choose(item)}
                >
                  <strong>{labels[item].native}</strong>
                  <span>{labels[item].name}</span>
                </button>
              ))}
            </div>
            <button type="button" className="betbass-language-continue" onClick={() => { window.localStorage.setItem(STORAGE_KEY, locale); setFirstVisit(false); setOpen(false); }}>
              {current.continue}
            </button>
          </div>
        </div>
      )}

      {firstVisit && !open && (
        <div className="betbass-language-backdrop" role="dialog" aria-modal="true">
          <div className="betbass-language-modal">
            <div className="betbass-language-kicker">BETBASS</div>
            <h2>Choose your language</h2>
            <p>Select a language for the BetBass website.</p>
            <div className="betbass-language-options">
              {(Object.keys(labels) as Locale[]).map((item) => (
                <button key={item} type="button" className={item === locale ? "is-selected" : ""} onClick={() => choose(item)}>
                  <strong>{labels[item].native}</strong><span>{labels[item].name}</span>
                </button>
              ))}
            </div>
            <button type="button" className="betbass-language-continue" onClick={() => { window.localStorage.setItem(STORAGE_KEY, locale); setFirstVisit(false); }}>
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}
