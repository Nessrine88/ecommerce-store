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

const Page = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  const latestProducts = await getLatestProducts(locale);
  const featuredProducts = await getFeaturedProducts(locale);

  const t = await getTranslations("Homepage");

  return (
    <div className="text-text">
      <div className="mx-auto max-w-7xl space-y-8 py-6 sm:py-8 md:space-y-12 md:py-10">
        {featuredProducts.length > 0 && (
          <section>
            <ProductCarousel data={featuredProducts} />
          </section>
        )}

        <section>
          <ProductList
            title={t("newestProducts")}
            data={latestProducts}
            limit={5}
          />
        </section>

        <section className="flex justify-center">
          <ViewAllProduct />
        </section>

        <section className="pb-4">
          <IconBoxes />
        </section>
      </div>
    </div>
  );
};

export default Page;