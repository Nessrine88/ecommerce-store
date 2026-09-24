"use client";

import { Link } from "@/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  {
    key: "overview",
    href: "/admin/overview",
  },
  {
    key: "products",
    href: "/admin/products",
  },
  {
    key: "orders",
    href: "/admin/orders",
  },
  {
    key: "users",
    href: "/admin/users",
  },
];

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const t = useTranslations("AdminNav");

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={cn(
          "hidden items-center space-x-4 md:flex lg:space-x-6",
          className,
        )}
        {...props}
      >
        {links.map((item) => {
          const href = item.href;

          return (
            <Link
              key={item.key}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === href || pathname.startsWith(`${href}/`)
                  ? "underline underline-offset-8"
                  : "",
              )}
            >
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"
          aria-label={t("toggleNavigation")}
          aria-expanded={open}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* Mobile menu */}
        {open && (
          <div className="absolute left-0 top-16 z-50 w-full border-b bg-bg/80 shadow-md backdrop-blur-3xl">
            <nav className="flex flex-col p-3">
              {links.map((item) => {
                const href = item.href;

                return (
                  <Link
                    key={item.key}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-muted",
                      pathname === href || pathname.startsWith(`${href}/`)
                        ? "bg-muted text-primary"
                        : "",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export default MainNav;