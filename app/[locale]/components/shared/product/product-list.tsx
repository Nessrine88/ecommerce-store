import ProductCard from "./product-card";
import { Product } from "@/types";
import { getTranslations } from "next-intl/server";

const ProductList = async ({
  data,
  title,
  limit,
}: {
  data: Product[];
  title?: string;
  limit?: number;
}) => {
  const t = await getTranslations("ProductList");

  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className="px-4 sm:px-6 md:px-0 max-w-7xl mx-auto">
      {title && (
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold my-6 sm:my-8 md:my-10">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data && data.length > 0 ? (
          limitedData.map((product: Product) => (
            <ProductCard
              key={product.slug}
              product={product}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-accent ">
            {t("noProducts")}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;