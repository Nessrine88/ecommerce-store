import ProductCard from "@/components/shared/product/product-card";
import { getAllCategories, getAllProducts } from "@/lib/actions/product.actions";
import Link from "next/link";


const prices = [
  {
    name: '$1 to $50',
    value: '1-50'
  },
    {
    name: '$51 to $100',
    value: '51-100'
  },
    {
    name: '$101 to $200',
    value: '101-200'
  },
    {
    name: '$201 to $500',
    value: '201-500'
  },
     {
    name: '$501 to $1000',
    value: '501-1000'
  },
]
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

  // Construct filter url
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

  return (
    <div className=" text-accent grid md:grid-cols-5 md:gap-5 min-h-screen min-w-7xl">
      {/* Filters */}
      <div className="filter-links">
        {/* Categories Links */}
        <div className="text-xl mb-2 mt-3">
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  href={getFilterUrl({ c: "all" })}
                  className={`${(category === "all" || category === "") && "font-bold"}`}
                >
                  Any
                </Link>
              </li>
              {categories.map((x) => (
                <li key={x.category}>
                  <Link
                    href={getFilterUrl({ c: x.category })}
                    className={`${category === x.category && "font-bold"}`}
                  >
                    {x.category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prices Links */}
        <div className="text-xl mb-2 mt-3">
          Price
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  href={getFilterUrl({ p: "all" })}
                  className={`${(price === "all" ) && "font-bold"}`}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    href={getFilterUrl({ p: p.value })}
                    className={`${price === p.value && "font-bold"}`}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-4 md:col-span-4 ">
        <div className="grid grid-cols-1 gap-4 mt-10  sm:grid-cols-2 md:grid-cols-3">
          {products.data.length === 0 && (
            <div className="md:col-span-3">
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