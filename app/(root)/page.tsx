import Hero from "@/components/Hero";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProduct from "@/components/view-all-products";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";
import IconBoxes from "@/components/icon-boxes";


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

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 md:px-8">
        {normalizedFeaturedProducts.length > 0 && (
          <section>
            <ProductCarousel data={normalizedFeaturedProducts} />
          </section>
        )}

        <section>
          <ProductList title="Newest Products" data={normalizedLatestProducts} />
        </section>

        <section className="flex justify-center ">
          <ViewAllProduct />
        </section>
                <section className="flex justify-center pb-4">
          <IconBoxes />
        </section>
      </div>
    </div>
  );
};

export default Page;