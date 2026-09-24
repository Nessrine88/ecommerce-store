"use client";

import { Link } from "@/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import React from "react";

const links = [
  {
    key: "profile",
    href: "/user/profile",
  },
  {
    key: "orders",
    href: "/user/orders",
  },
];

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const t = useTranslations("UserNav");

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
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
              : "",
          )}
        >
          {t(item.key)}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;