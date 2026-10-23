"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const t = useTranslations("Pagination");

  const router = useRouter();
  const pathname = usePathname(); // "/admin/products", no locale
  const searchParams = useSearchParams();

  const currentPage = Number(page) || 1;
  const total = Number(totalPages) || 1;

  const handleClick = (btnType: "next" | "prev") => {
    const pageValue = btnType === "next" ? currentPage + 1 : currentPage - 1;

    const params = new URLSearchParams(searchParams.toString());
    params.set(urlParamName || "page", String(pageValue));

    router.push(`${pathname}?${params.toString()}`); // becomes /en/admin/products?page=2
  };

  return (
    <div className="mt-5 flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        disabled={currentPage <= 1}
        onClick={() => handleClick("prev")}
      >
        {t("previous")}
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="w-28"
        disabled={currentPage >= total}
        onClick={() => handleClick("next")}
      >
        {t("next")}
      </Button>
    </div>
  );
};

export default Pagination;