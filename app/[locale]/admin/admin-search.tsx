"use client";

import { Input } from "@/app/[locale]/components/ui/input";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const AdminSearch = () => {
  const pathname = usePathname();
  const params = useParams();

  const locale = params.locale as string;

  const formActionUrl = pathname.includes("/admin/orders")
    ? `/${locale}/admin/orders`
    : pathname.includes("/admin/users")
      ? `/${locale}/admin/users`
      : `/${locale}/admin/products`;

  const searchParams = useSearchParams();

  const [queryValue, setQueryValue] = useState(
    searchParams.get("query") || ""
  );

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="md:w-[100px] lg:w-[300px]"
      />
    </form>
  );
};

export default AdminSearch;