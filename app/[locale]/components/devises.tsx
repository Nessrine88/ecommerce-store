
"use client";

import { useState } from "react";
import { ChevronDown, Coins, Search } from "lucide-react";
import { useCurrency } from "../context/currency-context";
export type Devise = {
  code: string;
  label: string;
  labelAr: string;
  symbol: string;
  flag: string;
};

export const DEVISES: Devise[] = [
  { code: "AED", label: "UAE Dirham", labelAr: "درهم إماراتي", symbol: "د.إ", flag: "🇦🇪" },
  { code: "AFN", label: "Afghani", labelAr: "أفغاني", symbol: "؋", flag: "🇦🇫" },
  { code: "ALL", label: "Albanian Lek", labelAr: "ليك ألباني", symbol: "L", flag: "🇦🇱" },
  { code: "AMD", label: "Armenian Dram", labelAr: "درام أرميني", symbol: "֏", flag: "🇦🇲" },
  { code: "AOA", label: "Angolan Kwanza", labelAr: "كوانزا أنغولي", symbol: "Kz", flag: "🇦🇴" },
  { code: "ARS", label: "Argentine Peso", labelAr: "بيزو أرجنتيني", symbol: "$", flag: "🇦🇷" },
  { code: "AUD", label: "Australian Dollar", labelAr: "دولار أسترالي", symbol: "A$", flag: "🇦🇺" },
  { code: "AWG", label: "Aruban Florin", labelAr: "فلورن أروبي", symbol: "ƒ", flag: "🇦🇼" },
  { code: "AZN", label: "Azerbaijani Manat", labelAr: "مانات أذربيجاني", symbol: "₼", flag: "🇦🇿" },

  { code: "BAM", label: "Bosnia and Herzegovina Convertible Mark", labelAr: "مارك بوسني قابل للتحويل", symbol: "KM", flag: "🇧🇦" },
  { code: "BBD", label: "Barbados Dollar", labelAr: "دولار بربادوسي", symbol: "Bds$", flag: "🇧🇧" },
  { code: "BDT", label: "Bangladeshi Taka", labelAr: "تاكا بنغلاديشي", symbol: "৳", flag: "🇧🇩" },
  { code: "BHD", label: "Bahraini Dinar", labelAr: "دينار بحريني", symbol: ".د.ب", flag: "🇧🇭" },
  { code: "BIF", label: "Burundian Franc", labelAr: "فرنك بوروندي", symbol: "FBu", flag: "🇧🇮" },
  { code: "BMD", label: "Bermudian Dollar", labelAr: "دولار برمودي", symbol: "$", flag: "🇧🇲" },
  { code: "BND", label: "Brunei Dollar", labelAr: "دولار بروناي", symbol: "B$", flag: "🇧🇳" },
  { code: "BOB", label: "Boliviano", labelAr: "بوليفيانو", symbol: "Bs.", flag: "🇧🇴" },
  { code: "BOV", label: "Bolivian Mvdol", labelAr: "بوليفيانو مبدول", symbol: "BOV", flag: "🇧🇴" },
  { code: "BRL", label: "Brazilian Real", labelAr: "ريال برازيلي", symbol: "R$", flag: "🇧🇷" },
  { code: "BSD", label: "Bahamian Dollar", labelAr: "دولار باهامي", symbol: "$", flag: "🇧🇸" },
  { code: "BTN", label: "Bhutanese Ngultrum", labelAr: "نغولتروم بوتاني", symbol: "Nu.", flag: "🇧🇹" },
  { code: "BWP", label: "Botswana Pula", labelAr: "بولا بوتسواني", symbol: "P", flag: "🇧🇼" },
  { code: "BYN", label: "Belarusian Ruble", labelAr: "روبل بيلاروسي", symbol: "Br", flag: "🇧🇾" },
  { code: "BZD", label: "Belize Dollar", labelAr: "دولار بليزي", symbol: "BZ$", flag: "🇧🇿" },

  { code: "CAD", label: "Canadian Dollar", labelAr: "دولار كندي", symbol: "C$", flag: "🇨🇦" },
  { code: "CDF", label: "Congolese Franc", labelAr: "فرنك كونغولي", symbol: "FC", flag: "🇨🇩" },
  { code: "CHE", label: "WIR Euro", labelAr: "يورو WIR", symbol: "CHE", flag: "🇨🇭" },
  { code: "CHF", label: "Swiss Franc", labelAr: "فرنك سويسري", symbol: "CHF", flag: "🇨🇭" },
  { code: "CHW", label: "WIR Franc", labelAr: "فرنك WIR", symbol: "CHW", flag: "🇨🇭" },
  { code: "CLF", label: "Unidad de Fomento", labelAr: "وحدة التنمية التشيلية", symbol: "UF", flag: "🇨🇱" },
  { code: "CLP", label: "Chilean Peso", labelAr: "بيزو تشيلي", symbol: "$", flag: "🇨🇱" },
  { code: "CNY", label: "Chinese Yuan", labelAr: "يوان صيني", symbol: "¥", flag: "🇨🇳" },
  { code: "COP", label: "Colombian Peso", labelAr: "بيزو كولومبي", symbol: "$", flag: "🇨🇴" },
  { code: "COU", label: "Unidad de Valor Real", labelAr: "وحدة القيمة الحقيقية", symbol: "COU", flag: "🇨🇴" },
  { code: "CRC", label: "Costa Rican Colon", labelAr: "كولون كوستاريكي", symbol: "₡", flag: "🇨🇷" },
  { code: "CUP", label: "Cuban Peso", labelAr: "بيزو كوبي", symbol: "$", flag: "🇨🇺" },
  { code: "CVE", label: "Cape Verde Escudo", labelAr: "إسكودو الرأس الأخضر", symbol: "$", flag: "🇨🇻" },
  { code: "CZK", label: "Czech Koruna", labelAr: "كرونة تشيكية", symbol: "Kč", flag: "🇨🇿" },

  { code: "DJF", label: "Djiboutian Franc", labelAr: "فرنك جيبوتي", symbol: "Fdj", flag: "🇩🇯" },
  { code: "DKK", label: "Danish Krone", labelAr: "كرونة دنماركية", symbol: "kr", flag: "🇩🇰" },
  { code: "DOP", label: "Dominican Peso", labelAr: "بيزو دومينيكاني", symbol: "RD$", flag: "🇩🇴" },
  { code: "DZD", label: "Algerian Dinar", labelAr: "دينار جزائري", symbol: "دج", flag: "🇩🇿" },

  { code: "EGP", label: "Egyptian Pound", labelAr: "جنيه مصري", symbol: "ج.م", flag: "🇪🇬" },
  { code: "ERN", label: "Eritrean Nakfa", labelAr: "ناكفا إريتري", symbol: "Nfk", flag: "🇪🇷" },
  { code: "ETB", label: "Ethiopian Birr", labelAr: "بير إثيوبي", symbol: "Br", flag: "🇪🇹" },
  { code: "EUR", label: "Euro", labelAr: "يورو", symbol: "€", flag: "🇪🇺" },

  { code: "FJD", label: "Fiji Dollar", labelAr: "دولار فيجي", symbol: "FJ$", flag: "🇫🇯" },
  { code: "FKP", label: "Falkland Islands Pound", labelAr: "جنيه جزر فوكلاند", symbol: "£", flag: "🇫🇰" },
  { code: "GBP", label: "Pound Sterling", labelAr: "جنيه إسترليني", symbol: "£", flag: "🇬🇧" },
  { code: "GEL", label: "Georgian Lari", labelAr: "لاري جورجي", symbol: "₾", flag: "🇬🇪" },
  { code: "GHS", label: "Ghanaian Cedi", labelAr: "سيدي غاني", symbol: "₵", flag: "🇬🇭" },
  { code: "GIP", label: "Gibraltar Pound", labelAr: "جنيه جبل طارق", symbol: "£", flag: "🇬🇮" },
  { code: "GMD", label: "Gambian Dalasi", labelAr: "دالاسي غامبي", symbol: "D", flag: "🇬🇲" },
  { code: "GNF", label: "Guinean Franc", labelAr: "فرنك غيني", symbol: "FG", flag: "🇬🇳" },
  { code: "GTQ", label: "Guatemalan Quetzal", labelAr: "كيتزال غواتيمالي", symbol: "Q", flag: "🇬🇹" },
  { code: "GYD", label: "Guyanese Dollar", labelAr: "دولار غياني", symbol: "G$", flag: "🇬🇾" },

  { code: "HKD", label: "Hong Kong Dollar", labelAr: "دولار هونغ كونغ", symbol: "HK$", flag: "🇭🇰" },
  { code: "HNL", label: "Honduran Lempira", labelAr: "لمبيرا هندوراسي", symbol: "L", flag: "🇭🇳" },
  { code: "HTG", label: "Haitian Gourde", labelAr: "غورد هايتي", symbol: "G", flag: "🇭🇹" },
  { code: "HUF", label: "Hungarian Forint", labelAr: "فورنت مجري", symbol: "Ft", flag: "🇭🇺" },

  { code: "IDR", label: "Indonesian Rupiah", labelAr: "روبية إندونيسية", symbol: "Rp", flag: "🇮🇩" },
  { code: "ILS", label: "Israeli New Shekel", labelAr: "شيكل إسرائيلي جديد", symbol: "₪", flag: "🇮🇱" },
  { code: "INR", label: "Indian Rupee", labelAr: "روبية هندية", symbol: "₹", flag: "🇮🇳" },
  { code: "IQD", label: "Iraqi Dinar", labelAr: "دينار عراقي", symbol: "ع.د", flag: "🇮🇶" },
  { code: "IRR", label: "Iranian Rial", labelAr: "ريال إيراني", symbol: "﷼", flag: "🇮🇷" },
  { code: "ISK", label: "Icelandic Króna", labelAr: "كرونا آيسلندية", symbol: "kr", flag: "🇮🇸" },

  { code: "JMD", label: "Jamaican Dollar", labelAr: "دولار جامايكي", symbol: "J$", flag: "🇯🇲" },
  { code: "JOD", label: "Jordanian Dinar", labelAr: "دينار أردني", symbol: "د.ا", flag: "🇯🇴" },
  { code: "JPY", label: "Japanese Yen", labelAr: "ين ياباني", symbol: "¥", flag: "🇯🇵" },

  { code: "KES", label: "Kenyan Shilling", labelAr: "شلن كيني", symbol: "KSh", flag: "🇰🇪" },
  { code: "KGS", label: "Kyrgyzstani Som", labelAr: "سوم قيرغيزستاني", symbol: "с", flag: "🇰🇬" },
  { code: "KHR", label: "Cambodian Riel", labelAr: "ريال كمبودي", symbol: "៛", flag: "🇰🇭" },
  { code: "KMF", label: "Comorian Franc", labelAr: "فرنك قمري", symbol: "CF", flag: "🇰🇲" },
  { code: "KPW", label: "North Korean Won", labelAr: "وون كوري شمالي", symbol: "₩", flag: "🇰🇵" },
  { code: "KRW", label: "South Korean Won", labelAr: "وون كوري جنوبي", symbol: "₩", flag: "🇰🇷" },
  { code: "KWD", label: "Kuwaiti Dinar", labelAr: "دينار كويتي", symbol: "د.ك", flag: "🇰🇼" },
  { code: "KYD", label: "Cayman Islands Dollar", labelAr: "دولار جزر كايمان", symbol: "CI$", flag: "🇰🇾" },
  { code: "KZT", label: "Kazakhstani Tenge", labelAr: "تينغ كازاخستاني", symbol: "₸", flag: "🇰🇿" },

  { code: "LAK", label: "Lao Kip", labelAr: "كيب لاوسي", symbol: "₭", flag: "🇱🇦" },
  { code: "LBP", label: "Lebanese Pound", labelAr: "ليرة لبنانية", symbol: "ل.ل", flag: "🇱🇧" },
  { code: "LKR", label: "Sri Lankan Rupee", labelAr: "روبية سريلانكية", symbol: "Rs", flag: "🇱🇰" },
  { code: "LRD", label: "Liberian Dollar", labelAr: "دولار ليبيري", symbol: "L$", flag: "🇱🇷" },
  { code: "LSL", label: "Lesotho Loti", labelAr: "لوتي ليسوتو", symbol: "L", flag: "🇱🇸" },
  { code: "LYD", label: "Libyan Dinar", labelAr: "دينار ليبي", symbol: "ل.د", flag: "🇱🇾" },

  { code: "MAD", label: "Moroccan Dirham", labelAr: "درهم مغربي", symbol: "د.م.", flag: "🇲🇦" },
  { code: "MDL", label: "Moldovan Leu", labelAr: "ليو مولدوفي", symbol: "L", flag: "🇲🇩" },
  { code: "MGA", label: "Malagasy Ariary", labelAr: "أرياري مدغشقري", symbol: "Ar", flag: "🇲🇬" },
  { code: "MKD", label: "Macedonian Denar", labelAr: "دينار مقدوني", symbol: "ден", flag: "🇲🇰" },
  { code: "MMK", label: "Myanmar Kyat", labelAr: "كيات ميانماري", symbol: "K", flag: "🇲🇲" },
  { code: "MNT", label: "Mongolian Tögrög", labelAr: "توغروغ منغولي", symbol: "₮", flag: "🇲🇳" },
  { code: "MOP", label: "Macanese Pataca", labelAr: "باتاكا ماكاوية", symbol: "MOP$", flag: "🇲🇴" },
  { code: "MRU", label: "Mauritanian Ouguiya", labelAr: "أوقية موريتانية", symbol: "UM", flag: "🇲🇷" },
  { code: "MUR", label: "Mauritian Rupee", labelAr: "روبية موريشية", symbol: "₨", flag: "🇲🇺" },
  { code: "MVR", label: "Maldivian Rufiyaa", labelAr: "روفيه مالديفية", symbol: "Rf", flag: "🇲🇻" },
  { code: "MWK", label: "Malawian Kwacha", labelAr: "كواشا ملاوية", symbol: "MK", flag: "🇲🇼" },
  { code: "MXN", label: "Mexican Peso", labelAr: "بيزو مكسيكي", symbol: "$", flag: "🇲🇽" },
  { code: "MXV", label: "Mexican Unidad de Inversion", labelAr: "وحدة الاستثمار المكسيكية", symbol: "UDI", flag: "🇲🇽" },
  { code: "MYR", label: "Malaysian Ringgit", labelAr: "رينغيت ماليزي", symbol: "RM", flag: "🇲🇾" },
  { code: "MZN", label: "Mozambican Metical", labelAr: "ميتيكال موزمبيقي", symbol: "MT", flag: "🇲🇿" },

  { code: "NAD", label: "Namibian Dollar", labelAr: "دولار ناميبي", symbol: "N$", flag: "🇳🇦" },
  { code: "NGN", label: "Nigerian Naira", labelAr: "نايرا نيجيري", symbol: "₦", flag: "🇳🇬" },
  { code: "NIO", label: "Nicaraguan Córdoba", labelAr: "كوردوبا نيكاراغوي", symbol: "C$", flag: "🇳🇮" },
  { code: "NOK", label: "Norwegian Krone", labelAr: "كرونة نرويجية", symbol: "kr", flag: "🇳🇴" },
  { code: "NPR", label: "Nepalese Rupee", labelAr: "روبية نيبالية", symbol: "₨", flag: "🇳🇵" },
  { code: "NZD", label: "New Zealand Dollar", labelAr: "دولار نيوزيلندي", symbol: "NZ$", flag: "🇳🇿" },

  { code: "OMR", label: "Omani Rial", labelAr: "ريال عماني", symbol: "ر.ع.", flag: "🇴🇲" },

  { code: "PAB", label: "Panamanian Balboa", labelAr: "بالبوا بنمي", symbol: "B/.", flag: "🇵🇦" },
  { code: "PEN", label: "Peruvian Sol", labelAr: "سول بيروفي", symbol: "S/", flag: "🇵🇪" },
  { code: "PGK", label: "Papua New Guinean Kina", labelAr: "كينا بابوا غينيا الجديدة", symbol: "K", flag: "🇵🇬" },
  { code: "PHP", label: "Philippine Peso", labelAr: "بيزو فلبيني", symbol: "₱", flag: "🇵🇭" },
  { code: "PKR", label: "Pakistani Rupee", labelAr: "روبية باكستانية", symbol: "₨", flag: "🇵🇰" },
  { code: "PLN", label: "Polish Złoty", labelAr: "زلوتي بولندي", symbol: "zł", flag: "🇵🇱" },
  { code: "PYG", label: "Paraguayan Guaraní", labelAr: "غواراني باراغواي", symbol: "₲", flag: "🇵🇾" },

  { code: "QAR", label: "Qatari Riyal", labelAr: "ريال قطري", symbol: "ر.ق", flag: "🇶🇦" },

  { code: "RON", label: "Romanian Leu", labelAr: "ليو روماني", symbol: "lei", flag: "🇷🇴" },
  { code: "RSD", label: "Serbian Dinar", labelAr: "دينار صربي", symbol: "дин.", flag: "🇷🇸" },
  { code: "RUB", label: "Russian Ruble", labelAr: "روبل روسي", symbol: "₽", flag: "🇷🇺" },
  { code: "RWF", label: "Rwandan Franc", labelAr: "فرنك رواندي", symbol: "FRw", flag: "🇷🇼" },

  { code: "SAR", label: "Saudi Riyal", labelAr: "ريال سعودي", symbol: "ر.س", flag: "🇸🇦" },
  { code: "SBD", label: "Solomon Islands Dollar", labelAr: "دولار جزر سليمان", symbol: "SI$", flag: "🇸🇧" },
  { code: "SCR", label: "Seychellois Rupee", labelAr: "روبية سيشلية", symbol: "₨", flag: "🇸🇨" },
  { code: "SDG", label: "Sudanese Pound", labelAr: "جنيه سوداني", symbol: "ج.س.", flag: "🇸🇩" },
  { code: "SEK", label: "Swedish Krona", labelAr: "كرونة سويدية", symbol: "kr", flag: "🇸🇪" },
  { code: "SGD", label: "Singapore Dollar", labelAr: "دولار سنغافوري", symbol: "S$", flag: "🇸🇬" },
  { code: "SHP", label: "Saint Helena Pound", labelAr: "جنيه سانت هيلينا", symbol: "£", flag: "🇸🇭" },
  { code: "SLE", label: "Sierra Leonean Leone", labelAr: "ليون سيراليوني", symbol: "Le", flag: "🇸🇱" },
  { code: "SOS", label: "Somali Shilling", labelAr: "شلن صومالي", symbol: "S", flag: "🇸🇴" },
  { code: "SRD", label: "Surinamese Dollar", labelAr: "دولار سورينامي", symbol: "$", flag: "🇸🇷" },
  { code: "SSP", label: "South Sudanese Pound", labelAr: "جنيه جنوب سوداني", symbol: "£", flag: "🇸🇸" },
  { code: "STN", label: "São Tomé and Príncipe Dobra", labelAr: "دوبرا ساو تومي وبرينسيبي", symbol: "Db", flag: "🇸🇹" },
  { code: "SVC", label: "Salvadoran Colón", labelAr: "كولون سلفادوري", symbol: "₡", flag: "🇸🇻" },
  { code: "SYP", label: "Syrian Pound", labelAr: "ليرة سورية", symbol: "ل.س", flag: "🇸🇾" },
  { code: "SZL", label: "Eswatini Lilangeni", labelAr: "ليلانجيني إسواتيني", symbol: "E", flag: "🇸🇿" },

  { code: "THB", label: "Thai Baht", labelAr: "بات تايلاندي", symbol: "฿", flag: "🇹🇭" },
  { code: "TJS", label: "Tajikistani Somoni", labelAr: "سوموني طاجيكي", symbol: "SM", flag: "🇹🇯" },
  { code: "TMT", label: "Turkmenistan Manat", labelAr: "مانات تركماني", symbol: "m", flag: "🇹🇲" },
  { code: "TND", label: "Tunisian Dinar", labelAr: "دينار تونسي", symbol: "د.ت", flag: "🇹🇳" },
  { code: "TOP", label: "Tongan Paʻanga", labelAr: "بانغا تونغي", symbol: "T$", flag: "🇹🇴" },
  { code: "TRY", label: "Turkish Lira", labelAr: "ليرة تركية", symbol: "₺", flag: "🇹🇷" },
  { code: "TTD", label: "Trinidad and Tobago Dollar", labelAr: "دولار ترينيداد وتوباغو", symbol: "TT$", flag: "🇹🇹" },
  { code: "TWD", label: "New Taiwan Dollar", labelAr: "دولار تايواني جديد", symbol: "NT$", flag: "🇹🇼" },
  { code: "TZS", label: "Tanzanian Shilling", labelAr: "شلن تنزاني", symbol: "TSh", flag: "🇹🇿" },

  { code: "UAH", label: "Ukrainian Hryvnia", labelAr: "هريفنيا أوكرانية", symbol: "₴", flag: "🇺🇦" },
  { code: "UGX", label: "Ugandan Shilling", labelAr: "شلن أوغندي", symbol: "USh", flag: "🇺🇬" },
  { code: "USD", label: "US Dollar", labelAr: "دولار أمريكي", symbol: "$", flag: "🇺🇸" },
  { code: "USN", label: "US Dollar (Next Day)", labelAr: "دولار أمريكي لليوم التالي", symbol: "$", flag: "🇺🇸" },
  { code: "UYI", label: "Uruguay Peso en Unidades Indexadas", labelAr: "بيزو أوروغواي بوحدات مفهرسة", symbol: "UYI", flag: "🇺🇾" },
  { code: "UYU", label: "Uruguayan Peso", labelAr: "بيزو أوروغواي", symbol: "$U", flag: "🇺🇾" },
  { code: "UYW", label: "Unidad Previsional", labelAr: "وحدة أوروغواي المؤسسية", symbol: "UYW", flag: "🇺🇾" },
  { code: "UZS", label: "Uzbekistani Soʻm", labelAr: "سوم أوزبكستاني", symbol: "soʻm", flag: "🇺🇿" },

  { code: "VED", label: "Venezuelan Bolívar Digital", labelAr: "بوليفار فنزويلي رقمي", symbol: "Bs.D", flag: "🇻🇪" },
  { code: "VES", label: "Venezuelan Bolívar Soberano", labelAr: "بوليفار فنزويلي", symbol: "Bs.", flag: "🇻🇪" },
  { code: "VND", label: "Vietnamese Đồng", labelAr: "دونغ فيتنامي", symbol: "₫", flag: "🇻🇳" },
  { code: "VUV", label: "Vanuatu Vatu", labelAr: "فاتو فانواتو", symbol: "VT", flag: "🇻🇺" },

  { code: "WST", label: "Samoan Tala", labelAr: "تالا ساموا", symbol: "WS$", flag: "🇼🇸" },

  { code: "XAF", label: "Central African CFA Franc", labelAr: "فرنك وسط أفريقي", symbol: "FCFA", flag: "🌍" },
  { code: "XCD", label: "East Caribbean Dollar", labelAr: "دولار شرق الكاريبي", symbol: "EC$", flag: "🌴" },
  { code: "XCG", label: "Caribbean Guilder", labelAr: "غيلدر كاريبي", symbol: "Cg", flag: "🇨🇼" },
  { code: "XOF", label: "West African CFA Franc", labelAr: "فرنك غرب أفريقي", symbol: "CFA", flag: "🌍" },
  { code: "XPF", label: "CFP Franc", labelAr: "فرنك سي إف بي", symbol: "₣", flag: "🌊" },

  { code: "YER", label: "Yemeni Rial", labelAr: "ريال يمني", symbol: "﷼", flag: "🇾🇪" },
  { code: "ZAR", label: "South African Rand", labelAr: "راند جنوب أفريقي", symbol: "R", flag: "🇿🇦" },
  { code: "ZMW", label: "Zambian Kwacha", labelAr: "كواشا زامبي", symbol: "ZK", flag: "🇿🇲" },
  { code: "ZWG", label: "Zimbabwe Gold", labelAr: "ذهب زيمبابوي", symbol: "ZiG", flag: "🇿🇼" },

  // ISO special-purpose currency/fund codes commonly present
  { code: "XAU", label: "Gold", labelAr: "ذهب", symbol: "XAU", flag: "🥇" },
  { code: "XAG", label: "Silver", labelAr: "فضة", symbol: "XAG", flag: "🥈" },
  { code: "XPT", label: "Platinum", labelAr: "بلاتين", symbol: "XPT", flag: "⚪" },
  { code: "XPD", label: "Palladium", labelAr: "بلاديوم", symbol: "XPD", flag: "⚪" },
  { code: "XDR", label: "SDR (Special Drawing Rights)", labelAr: "حقوق السحب الخاصة", symbol: "XDR", flag: "🌐" },
  { code: "XSU", label: "SUCRE", labelAr: "سوكري", symbol: "XSU", flag: "🌎" },
  { code: "XUA", label: "ADB Unit of Account", labelAr: "وحدة حساب بنك التنمية الأفريقي", symbol: "XUA", flag: "🌍" },
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
const [search, setSearch] = useState("");
const filteredDevises = devises.filter((devise) => {
  const query = search.toLowerCase();

  return (
    devise.code.toLowerCase().includes(query) ||
    devise.label.toLowerCase().includes(query) ||
    devise.labelAr.includes(search)
  );
});
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

        <span>{current?.symbol}</span>

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
          <div className="m-2 relative py-1">
  <Search
    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
    size={16}
  />

  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="
      w-full
      border border-white/10
      rounded-2xl
      my-1
      pl-9 pr-3 py-2
      bg-zinc-800
      text-white
      placeholder:text-zinc-500
      outline-none
      focus:border-emerald-400/50
    "
  />
</div>
     
            {filteredDevises.map((devise) => (
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

