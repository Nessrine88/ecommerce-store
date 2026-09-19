
import ProductCard from "@/app/[locale]/components/shared/product/product-card";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { XIcon } from "lucide-react";

const prices = [
  { value: "1-50", min: 1, max: 50 },
  { value: "51-100", min: 51, max: 100 },
  { value: "101-200", min: 101, max: 200 },
  { value: "201-500", min: 201, max: 500 },
  { value: "501-1000", min: 501, max: 1000 },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ["newest", "lowest", "highest", "rating"] as const;

export async function generateMetadata(props: {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
  }>;
}) {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale,
    namespace: "SearchPage",
  });

  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q !== "all" && q.trim() !== "";
  const isCategorySet = category !== "all" && category.trim() !== "";
  const isPriceSet = price !== "all" && price.trim() !== "";
  const isRatingSet = rating !== "all" && rating.trim() !== "";

  if (
    isQuerySet ||
    isCategorySet ||
    isPriceSet ||
    isRatingSet
  ) {
    const parts = [
      isQuerySet ? `${t("query")}: ${q}` : "",
      isCategorySet ? `${t("category")}: ${category}` : "",
      isPriceSet ? `${t("price")}: ${price}` : "",
      isRatingSet ? `${t("rating")}: ${rating}` : "",
    ].filter(Boolean);

    return {
      title: parts.join(" | "),
    };
  }

  return {
    title: t("searchProducts"),
  };
}

const SearchPage = async (props: {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale,
    namespace: "SearchPage",
  });

  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  const currentPage = Math.max(Number(page) || 1, 1);

  const categories = await getAllCategories();

  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params: Record<string, string> = {
      q,
      category,
      price,
      rating,
      sort,
      page: String(currentPage),
    };

    if (c !== undefined) {
      params.category = c;
    }

    if (p !== undefined) {
      params.price = p;
    }

    if (s !== undefined) {
      params.sort = s;
    }

    if (r !== undefined) {
      params.rating = r;
    }

    if (pg !== undefined) {
      params.page = pg;
    }

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: currentPage,
    locale,
  });

  const hasActiveFilters =
    (q !== "all" && q !== "") ||
    (category !== "all" && category !== "") ||
    (rating !== "all" && rating !== "") ||
    (price !== "all" && price !== "");

  const FilterLink = ({
    href,
    active,
    children,
  }: {
    href: string;
    active: boolean;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      className={cn(
        "block rounded-md px-2 py-1 text-sm transition-colors",
        active
          ? "font-semibold text-accent"
          : "text-muted hover:bg-card-hover hover:text-text"
      )}
    >
      {children}
    </Link>
  );

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 bg-bg p-4 text-text sm:p-6 md:grid-cols-5 md:gap-8">
      {/* Filters */}
      <aside className="space-y-6 rounded-lg border border-primary/30 bg-surface p-4 md:col-span-1">
        {/* Categories */}
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary">
            {t("filters.category")}
          </h3>

          <ul className="flex flex-wrap gap-1 md:block md:space-y-0.5">
            <li>
              <FilterLink
                href={getFilterUrl({
                  c: "all",
                  pg: "1",
                })}
                active={category === "all" || category === ""}
              >
                {t("any")}
              </FilterLink>
            </li>

            {categories.map((x) => (
              <li key={x.category}>
                <FilterLink
                  href={getFilterUrl({
                    c: x.category,
                    pg: "1",
                  })}
                  active={category === x.category}
                >
                  {x.category}
                </FilterLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px bg-primary/20" />

        {/* Price */}
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary">
            {t("filters.price")}
          </h3>

          <ul className="flex flex-wrap gap-1 md:block md:space-y-0.5">
            <li>
              <FilterLink
                href={getFilterUrl({
                  p: "all",
                  pg: "1",
                })}
                active={price === "all"}
              >
                {t("any")}
              </FilterLink>
            </li>

            {prices.map((p) => (
              <li key={p.value}>
                <FilterLink
                  href={getFilterUrl({
                    p: p.value,
                    pg: "1",
                  })}
                  active={price === p.value}
                >
                  {t("priceRange", {
                    min: p.min,
                    max: p.max,
                  })}
                </FilterLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px bg-primary/20" />

        {/* Rating */}
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary">
            {t("filters.rating")}
          </h3>

          <ul className="flex flex-wrap gap-1 md:block md:space-y-0.5">
            <li>
              <FilterLink
                href={getFilterUrl({
                  r: "all",
                  pg: "1",
                })}
                active={rating === "all"}
              >
                {t("any")}
              </FilterLink>
            </li>

            {ratings.map((r) => (
              <li key={r}>
                <FilterLink
                  href={getFilterUrl({
                    r: String(r),
                    pg: "1",
                  })}
                  active={rating === String(r)}
                >
                  {t("ratingAndUp", {
                    rating: r,
                  })}
                </FilterLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Products */}
      <div className="space-y-4 md:col-span-4">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-primary/20 pb-4 md:flex-row md:items-center md:justify-between">
          {/* Active filters */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            {q !== "all" && q !== "" && (
              <span className="rounded-full bg-card px-3 py-1 text-text">
                {t("activeFilters.query")}: {q}
              </span>
            )}

            {category !== "all" && category !== "" && (
              <span className="rounded-full bg-card px-3 py-1 text-text">
                {t("activeFilters.category")}: {category}
              </span>
            )}

            {price !== "all" && price !== "" && (
              <span className="rounded-full bg-card px-3 py-1 text-text">
                {t("activeFilters.price")}: {price}
              </span>
            )}

            {rating !== "all" && rating !== "" && (
              <span className="rounded-full bg-card px-3 py-1 text-text">
                {t("activeFilters.rating")}: {rating}{" "}
                {t("starsAndUp")}
              </span>
            )}

            {hasActiveFilters && (
              <Link
                href="/search"
                className="flex items-center gap-1 px-1 text-accent transition-colors hover:text-secondary"
              >
                <XIcon className="size-3" />
                {t("clear")}
              </Link>
            )}
          </div>

          {/* Sort */}
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <span className="text-muted">
              {t("sortBy")}:
            </span>

            {sortOrders.map((s) => (
              <Link
                key={s}
                href={getFilterUrl({
                  s,
                  pg: "1",
                })}
                className={cn(
                  "rounded-md px-2 py-1 capitalize transition-colors hover:bg-card-hover",
                  sort === s
                    ? "font-semibold text-accent"
                    : "text-muted hover:text-text"
                )}
              >
                {t(`sort.${s}`)}
              </Link>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.data.length === 0 && (
            <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-primary/30 text-muted sm:col-span-2 md:col-span-3">
              {t("noProducts")}
            </div>
          )}

          {products.data.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                images: product.images ?? [],
                brand: product.brand ?? "",
                price: product.price ?? "0",
              }}
            />
          ))}
        </div>

        {/* Pagination */}
        {products.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            {currentPage > 1 && (
              <Link
                href={getFilterUrl({
                  pg: String(currentPage - 1),
                })}
                className="rounded-md border border-primary/30 px-3 py-2 text-sm text-muted transition-colors hover:bg-card-hover hover:text-text"
              >
                {t("pagination.previous")}
              </Link>
            )}

            <span className="rounded-md bg-card px-3 py-2 text-sm font-semibold text-text">
              {t("pagination.page", {
                current: currentPage,
                total: products.totalPages,
              })}
            </span>

            {currentPage < products.totalPages && (
              <Link
                href={getFilterUrl({
                  pg: String(currentPage + 1),
                })}
                className="rounded-md border border-primary/30 px-3 py-2 text-sm text-muted transition-colors hover:bg-card-hover hover:text-text"
              >
                {t("pagination.next")}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
