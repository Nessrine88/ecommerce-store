import ProductCard from "@/components/shared/product/product-card";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { XIcon } from "lucide-react";

const prices = [
  { name: "$1 to $50", value: "1-50" },
  { name: "$51 to $100", value: "51-100" },
  { name: "$101 to $200", value: "101-200" },
  { name: "$201 to $500", value: "201-500" },
  { name: "$501 to $1000", value: "501-1000" },
];

const ratings = [4, 3, 2, 1];
const sortOrders = ["newest", "lowest", "highest", "rating"];
export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;
  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search ${isQuerySet ? q : ""}
        ${isCategorySet ? `: Category ${category}` : ""}
        ${isPriceSet ? `: Price ${price}` : ""}
        ${isRatingSet ? `: Rating ${rating}` : ""}`.trim(),
    };
  } else {
    return {
      title: "Search Products ",
    };
  }

  return {
    title: "Search",
  };
}
const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

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
      page,
    };

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    sort,
    rating,
    page: Number(page),
  });

  const hasActiveFilters =
    (q !== "all" && q !== "") ||
    (category !== "all" && category !== "") ||
    rating !== "all" ||
    price !== "all";

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
          ? "bg-accent font-semibold text-bg"
          : "text-muted hover:bg-card-hover hover:text-text",
      )}
    >
      {children}
    </Link>
  );

  return (
    <div className="grid min-h-screen min-w-7xl grid-cols-1 gap-6 bg-bg p-6 text-text md:grid-cols-5 md:gap-8">
      {/* Filters */}
      <aside className="space-y-6 rounded-lg border border-primary/30 bg-surface p-4 md:col-span-1">
        {/* Categories */}
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary">
            Category
          </h3>
          <ul className="space-y-0.5">
            <li>
              <FilterLink
                href={getFilterUrl({ c: "all" })}
                active={category === "all" || category === ""}
              >
                Any
              </FilterLink>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <FilterLink
                  href={getFilterUrl({ c: x.category })}
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
            Price
          </h3>
          <ul className="space-y-0.5">
            <li>
              <FilterLink
                href={getFilterUrl({ p: "all" })}
                active={price === "all"}
              >
                Any
              </FilterLink>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <FilterLink
                  href={getFilterUrl({ p: p.value })}
                  active={price === p.value}
                >
                  {p.name}
                </FilterLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px bg-primary/20" />

        {/* Rating */}
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary">
            Rating
          </h3>
          <ul className="space-y-0.5">
            <li>
              <FilterLink
                href={getFilterUrl({ r: "all" })}
                active={rating === "all"}
              >
                Any
              </FilterLink>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <FilterLink
                  href={getFilterUrl({ r: `${r}` })}
                  active={rating === r.toString()}
                >
                  {r} stars & up
                </FilterLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Products */}
      <div className="space-y-4 md:col-span-4">
        <div className="flex flex-col gap-3 border-b border-primary/20 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            {q !== "all" && q !== "" && (
              <span className="rounded-full bg-card px-3 py-1 text-text">
                Query: {q}
              </span>
            )}
            {category !== "all" && category !== "" && (
              <span className="rounded-full bg-card px-3 py-1 text-text">
                Category: {category}
              </span>
            )}
            {price !== "all" && price !== "" && (
              <span className="rounded-full bg-card px-3 py-1 text-text">
                Price: {price}
              </span>
            )}
            {rating !== "all" && (
              <span className="rounded-full bg-card px-3 py-1 text-text">
                Rating: {rating} stars & up
              </span>
            )}
            {hasActiveFilters && (
              <Link
                href="/search"
                className="flex items-center gap-1 px-1 text-accent transition-colors hover:text-secondary"
              >
                <XIcon className="size-3" />
                Clear
              </Link>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted">Sort by:</span>
            {sortOrders.map((s) => (
              <Link
                key={s}
                href={getFilterUrl({ s })}
                className={cn(
                  "rounded-md px-2 py-1 capitalize transition-colors hover:bg-card-hover",
                  sort === s
                    ? "font-semibold text-accent"
                    : "text-muted hover:text-text",
                )}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.data.length === 0 && (
            <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-primary/30 text-muted md:col-span-3">
              No products found
            </div>
          )}

          {products.data.map((product) => {
            const normalizedProduct = {
              ...product,
              images: product.images ?? [],
              brand: product.brand ?? "",
              price: product.price ?? "0",
            };

            return (
              <ProductCard
                key={product.id}
                product={normalizedProduct as any}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
