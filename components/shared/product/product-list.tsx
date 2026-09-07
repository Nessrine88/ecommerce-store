import ProductCard from "./product-card";
import { Product } from "@/types";

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: Product[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div className="px-4 sm:px-6 md:px-0">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold my-6 sm:my-8 md:my-10">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data && data.length > 0 ? (
          limitedData.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No product found
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;