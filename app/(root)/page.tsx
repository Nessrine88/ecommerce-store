import Hero from "@/components/Hero";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProduct from "@/components/view-all-products";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";

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
    <div className="text-accent">
     

      {normalizedFeaturedProducts.length > 0 && (
        <ProductCarousel data={normalizedFeaturedProducts} />
      )}

      <ProductList
        title="Newest Products"
        data={normalizedLatestProducts}
      />
      <ViewAllProduct />
    </div>
  );
};

export default Page;