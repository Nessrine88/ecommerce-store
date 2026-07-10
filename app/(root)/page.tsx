import Hero from "@/components/Hero";
import ProductList from "@/components/shared/header/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
const page = async() => {
  const latestProducts = await getLatestProducts()
  return (
    <div className="text-accent">
      <Hero />
      <ProductList title = "Newest Product" data={latestProducts} />
    </div>
  );
};

export default page;
