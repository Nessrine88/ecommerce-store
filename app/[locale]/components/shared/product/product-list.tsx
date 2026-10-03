import ProductCard from "./product-card";
import { Product } from "@/types";
import { getTranslations } from "next-intl/server";

const ProductList = async ({
  data,
  title,
  limit = 6, // always show 6 by default
}: {
  data: Product[];
  title?: string;
  limit?: number;
}) => {
  const t = await getTranslations("ProductList");

 

  // split into 3 columns: items 0,3 -> col 1 | 1,4 -> col 2 | 2,5 -> col 3
  const columns = [0, 1, 2].map((c) =>
    data.map((product, i) => ({ product, i })).filter(({ i }) => i % 3 === c)
  );

  // vertical offset per column (desktop only)
  const offsets = ["md:mt-16", "md:mt-0", "md:mt-28"];

  return (
    <div className="mx-auto  rounded-3xl ">
      {title && (
        <h2 className="my-6 text-2xl font-bold text-white sm:my-8 sm:text-3xl md:my-10 md:text-4xl">
          {title}
        </h2>
      )}

      {data.length > 0 ? (
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-5 md:grid-cols-3">
          {columns.map((col, c) => (
            <div key={c} className={`flex flex-col gap-5 ${offsets[c]}`}>
              {col.map(({ product, i }) => (
                <ProductCard key={product.slug} product={product} index={i} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-accent">{t("noProducts")}</div>
      )}
    </div>
  );
};

export default ProductList;