import Hero from "@/components/Hero";
import ProductList from "@/components/shared/header/product/product-list";
import sampleData from '@/db/sample-data'
const page = () => {
  return (
    <div className="text-accent">
      <Hero />
      <ProductList title = "Newest Product" data={sampleData} limit={4} />
    </div>
  );
};

export default page;
