
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  {
    title: "Overview",
    href: "/admin/overview",
  },
  {
    title: "Products",
    href: "/admin/products",
  },
  {
    title: "Orders",
    href: "/admin/orders",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
];

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={cn(
          "hidden items-center  space-x-4 md:flex lg:space-x-6",
          className
        )}
        {...props}
      >
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.includes(item.href)
                ? "underline underline-offset-8"
                : ""
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5 " />
          )}
        </button>

        {/* Mobile menu */}
        {open && (
          <div className="absolute backdrop-blur-3xl bg-bg/80 left-0 top-16 z-50 w-full border-b bg-background shadow-md">
            <nav className="flex flex-col p-3">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-muted",
                    pathname.includes(item.href)
                      ? "bg-muted text-primary"
                      : ""
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export default MainNav;

