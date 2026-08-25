import Hero from "@/components/Hero";
import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
const page = async() => {
  const latestProducts = await getLatestProducts()
  const normalizedLatestProducts = latestProducts.map((product) => ({
    ...product,
    images: product.images ?? [],
    brand: product.brand ?? "",
  }))
  return (
    <div className="text-accent">
      <Hero />
      <ProductList title = "Newest Product" data={normalizedLatestProducts} />
    </div>
  );
};

export default page;
