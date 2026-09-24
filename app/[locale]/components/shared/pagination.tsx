"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({
  page,
  totalPages,
  urlParamName,
}: PaginationProps) => {
  const t = useTranslations("Pagination");

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(page) || 1;
  const total = Number(totalPages) || 1;

  const handleClick = (btnType: string) => {
    const pageValue =
      btnType === "next"
        ? currentPage + 1
        : currentPage - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });

    router.push(newUrl);
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