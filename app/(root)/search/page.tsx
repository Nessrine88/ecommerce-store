import ProductCard from "@/components/shared/product/product-card";
import { getAllProducts } from "@/lib/actions/product.actions";

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

  const products = await getAllProducts({
    query: q,
    category,
    price,
    sort,
    rating,
    page: Number(page),
  });
console.log("SEARCH RESULT:", products);
  return (
    <div className="grid md:grid-cols-5 md:gap-5 min-h-screen min-w-7xl">
      {/* Filters */}
      <div className="filter-links">
        {/* FILTERS */}
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