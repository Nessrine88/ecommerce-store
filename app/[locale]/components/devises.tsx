
"use client";

import { useState } from "react";
import { ChevronDown, Coins } from "lucide-react";
import { useCurrency } from "../context/currency-context";

export type Devise = {
  code: string;
  label: string;
  labelAr: string;
  symbol: string;
  flag: string;
};

const DEVISES: Devise[] = [
  { code: "DZD", label: "Algerian Dinar", labelAr: "دينار جزائري", symbol: "د.ج", flag: "🇩🇿" },
  { code: "BHD", label: "Bahraini Dinar", labelAr: "دينار بحريني", symbol: ".د.ب", flag: "🇧🇭" },
  { code: "KMF", label: "Comorian Franc", labelAr: "فرنك قمري", symbol: "CF", flag: "🇰🇲" },
  { code: "DJF", label: "Djiboutian Franc", labelAr: "فرنك جيبوتي", symbol: "Fdj", flag: "🇩🇯" },
  { code: "EGP", label: "Egyptian Pound", labelAr: "جنيه مصري", symbol: "ج.م", flag: "🇪🇬" },
  { code: "IQD", label: "Iraqi Dinar", labelAr: "دينار عراقي", symbol: "ع.د", flag: "🇮🇶" },
  { code: "JOD", label: "Jordanian Dinar", labelAr: "دينار أردني", symbol: "د.ا", flag: "🇯🇴" },
  { code: "KWD", label: "Kuwaiti Dinar", labelAr: "دينار كويتي", symbol: "د.ك", flag: "🇰🇼" },
  { code: "LBP", label: "Lebanese Pound", labelAr: "ليرة لبنانية", symbol: "ل.ل", flag: "🇱🇧" },
  { code: "LYD", label: "Libyan Dinar", labelAr: "دينار ليبي", symbol: "ل.د", flag: "🇱🇾" },
  { code: "MRU", label: "Mauritanian Ouguiya", labelAr: "أوقية موريتانية", symbol: "أ.م", flag: "🇲🇷" },
  { code: "MAD", label: "Moroccan Dirham", labelAr: "درهم مغربي", symbol: "د.م.", flag: "🇲🇦" },
  { code: "OMR", label: "Omani Rial", labelAr: "ريال عماني", symbol: "ر.ع.", flag: "🇴🇲" },
  { code: "QAR", label: "Qatari Riyal", labelAr: "ريال قطري", symbol: "ر.ق", flag: "🇶🇦" },
  { code: "SAR", label: "Saudi Riyal", labelAr: "ريال سعودي", symbol: "ر.س", flag: "🇸🇦" },
  { code: "SOS", label: "Somali Shilling", labelAr: "شلن صومالي", symbol: "S", flag: "🇸🇴" },
  { code: "SDG", label: "Sudanese Pound", labelAr: "جنيه سوداني", symbol: "ج.س.", flag: "🇸🇩" },
  { code: "SYP", label: "Syrian Pound", labelAr: "ليرة سورية", symbol: "ل.س", flag: "🇸🇾" },
  { code: "TND", label: "Tunisian Dinar", labelAr: "دينار تونسي", symbol: "د.ت", flag: "🇹🇳" },
  { code: "AED", label: "UAE Dirham", labelAr: "درهم إماراتي", symbol: "د.إ", flag: "🇦🇪" },
  { code: "YER", label: "Yemeni Rial", labelAr: "ريال يمني", symbol: "ر.ي", flag: "🇾🇪" },
];

type DevisesProps = {
  devises?: Devise[];
  locale?: "en" | "ar";
  className?: string;
};

const Devises = ({
  devises = DEVISES,
  locale = "en",
  className = "",
}: DevisesProps) => {
  const { currency, setCurrency } = useCurrency();

  const [open, setOpen] = useState(false);

  const current =
    devises.find((devise) => devise.code === currency) ?? devises[0];

  const handleSelect = (code: string) => {
    setCurrency(code);
    setOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="
          inline-flex items-center gap-2
          px-3 py-2
          rounded-full
          bg-black/40 hover:bg-black/60
          border border-white/20
          backdrop-blur-md
          text-white text-xs sm:text-sm font-semibold
          transition-all duration-200
        "
      >
        <Coins className="w-3.5 h-3.5 text-emerald-300" />

        <span>{current?.flag}</span>

        <span>{current?.code}</span>

        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          <ul
            role="listbox"
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="
              absolute right-0 mt-2 z-50
              min-w-[14rem] max-h-72
              overflow-y-auto
              rounded-xl
              bg-zinc-900/95
              border border-white/10
              backdrop-blur-md
              shadow-xl shadow-black/30
            "
          >
            {devises.map((devise) => (
              <li key={devise.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={devise.code === currency}
                  onClick={() => handleSelect(devise.code)}
                  className={`
                    w-full flex items-center justify-between gap-3
                    px-4 py-2.5
                    text-xs sm:text-sm
                    transition-colors duration-150
                    ${
                      devise.code === currency
                        ? "bg-emerald-400/15 text-emerald-300"
                        : "text-zinc-200 hover:bg-white/5"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <span>{devise.flag}</span>

                    <span className="font-medium">
                      {locale === "ar" ? devise.labelAr : devise.label}
                    </span>
                  </span>

                  <span className="flex items-center gap-2 text-zinc-400">
                    <span>{devise.code}</span>
                    <span>{devise.symbol}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Devises;

