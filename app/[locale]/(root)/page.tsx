import Hero from "@/app/[locale]/components/Hero";
import ProductCarousel from "@/app/[locale]/components/shared/product/product-carousel";
import ProductList from "@/app/[locale]/components/shared/product/product-list";
import ViewAllProduct from "@/app/[locale]/components/view-all-products";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";
import IconBoxes from "@/app/[locale]/components/icon-boxes";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  const normalizedLatestProducts = latestProducts.map((product) => ({
    ...product,
    images: product.images ?? [],
    brand: product.brand ?? "",
    rating:
      typeof product.rating === "number"
        ? product.rating
        : Number(product.rating ?? 0),
  }));

  const normalizedFeaturedProducts = featuredProducts.map((product) => ({
    ...product,
    images: product.images ?? [],
    brand: product.brand ?? "",
    rating:
      typeof product.rating === "number"
        ? product.rating
        : Number(product.rating ?? 0),
  }));
const t = await getTranslations('Homepage')
  return (
    <div className=" bg-bg text-text">
      <div className="mx-auto max-w-7xl space-y-8  py-6 sm:py-8 md:space-y-12 md:py-10">
        {normalizedFeaturedProducts.length > 0 && (
          <section>
            <ProductCarousel data={normalizedFeaturedProducts} />
          </section>
        )}

        <section>
          <ProductList
            title={t("newestProducts")}
            data={normalizedLatestProducts}
            limit={5}
          />
        </section>

        <section className="flex justify-center">
          <ViewAllProduct />
        </section>

        <section className=" pb-4">
          <IconBoxes />
        </section>
      </div>
    </div>
  );
};

export default Page;