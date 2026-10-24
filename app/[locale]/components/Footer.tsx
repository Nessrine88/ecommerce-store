"use client";

import React, { useState } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/actions/newsletter.actions";

const Footer = () => {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNewsletterSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback("");

    try {
      const result = await subscribeToNewsletter(email);

      setFeedback(result.message);
      setIsSuccess(result.success);

      if (result.success) {
        setEmail("");
      }
    } catch (error) {
      console.error("Newsletter submission failed:", error);
      setFeedback("Something went wrong. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full border-t border-white/10 bg-gradient-to-b from-[#12281d] via-[#0f2017] to-[#07120c] text-white/90 transition-colors duration-300 dark:border-zinc-800 dark:bg-none dark:bg-black dark:text-zinc-300">
      {/* Main Footer Links & Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info & Socials */}
          <div className="space-y-5 lg:col-span-2">
            <Link
              href="/"
              className="inline-block text-2xl font-black tracking-tight text-white dark:text-zinc-100"
            >
              MANBATI<span className="text-emerald-400">.</span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-white/70 dark:text-zinc-400">
              {t("brandDescription")}
            </p>

            {/* Contact Info */}
            <ul className="space-y-2.5 pt-2 text-xs text-white/80 dark:text-zinc-400">
              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>123 Commerce Way, Tech District, NY 10001</span>
              </li>

              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>+1 (800) 555-0199</span>
              </li>

              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>support@yourstore.com</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2 rtl:space-x-reverse">
              {[
                { icon: FaFacebookF, href: "#", label: "Facebook" },
                { icon: FaInstagram, href: "#", label: "Instagram" },
                { icon: FaXTwitter, href: "#", label: "X" },
                { icon: FaYoutube, href: "#", label: "YouTube" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white/80 transition-colors hover:border-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/10"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white dark:text-zinc-100">
              {t("quickLinks.title")}
            </h3>

            <ul className="space-y-2.5 text-xs">
              {[
                { label: t("quickLinks.shopAll"), href: "/shop" },
                {
                  label: t("quickLinks.featuredProducts"),
                  href: "/featured",
                },
                {
                  label: t("quickLinks.newArrivals"),
                  href: "/new-arrivals",
                },
                {
                  label: t("quickLinks.bestSellers"),
                  href: "/best-sellers",
                },
                {
                  label: t("quickLinks.specialOffers"),
                  href: "/offers",
                },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 transition-colors hover:text-emerald-400 dark:text-zinc-400 dark:hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white dark:text-zinc-100">
              {t("customerSupport.title")}
            </h3>

            <ul className="space-y-2.5 text-xs">
              {[
                {
                  label: t("customerSupport.myAccount"),
                  href: "/profile",
                },
                {
                  label: t("customerSupport.trackOrder"),
                  href: "/orders",
                },
                {
                  label: t("customerSupport.shippingPolicy"),
                  href: "/shipping",
                },
                {
                  label: t("customerSupport.returnsExchanges"),
                  href: "/returns",
                },
                {
                  label: t("customerSupport.faqsHelp"),
                  href: "/faq",
                },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 transition-colors hover:text-emerald-400 dark:text-zinc-400 dark:hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white dark:text-zinc-100">
              {t("newsletter.title")}
            </h3>

            <p className="text-xs leading-relaxed text-white/70 dark:text-zinc-400">
              {t("newsletter.description")}
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="space-y-2"
            >
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter.placeholder")}
                  autoComplete="email"
                  required
                  maxLength={255}
                  disabled={isSubmitting}
                  aria-label={t("newsletter.placeholder")}
                  className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-2.5 pr-10 text-xs text-white placeholder-white/40 backdrop-blur-md outline-none transition-all focus:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 rtl:pl-10 rtl:pr-4"
                />

                <button
                  type="submit"
                  aria-label="Subscribe"
                  disabled={isSubmitting}
                  className="absolute right-1.5 top-1.5 rounded-lg bg-emerald-500 p-1.5 text-zinc-950 transition-all hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 rtl:left-1.5 rtl:right-auto"
                >
                  <Send
                    className={`h-3.5 w-3.5 rtl:rotate-180 ${
                      isSubmitting ? "animate-pulse" : ""
                    }`}
                  />
                </button>
              </div>

              {feedback && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`text-xs ${
                    isSuccess ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {feedback}
                </p>
              )}

              <span className="block text-[10px] text-white/40 dark:text-zinc-500">
                {t("newsletter.privacyNote")}
              </span>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal Bar */}
      <div className="border-t border-white/10 bg-black/20 dark:border-zinc-800/80 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-white/60 sm:flex-row dark:text-zinc-500">
          <p>{t("legal.copyright", { year: currentYear })}</p>

          {/* Legal Links */}
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white dark:hover:text-zinc-300"
            >
              {t("legal.privacyPolicy")}
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-white dark:hover:text-zinc-300"
            >
              {t("legal.termsOfService")}
            </Link>

            <Link
              href="/cookies"
              className="transition-colors hover:text-white dark:hover:text-zinc-300"
            >
              {t("legal.cookieSettings")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;