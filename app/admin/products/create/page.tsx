import { Metadata } from "next";
import ProductForm from "@/components/admin/product-form";
export const metadata: Metadata = {
  title: "Create Product",
};
const CreateProductPage = () => {
  return (
    <div>
      <h2>Create product</h2>
      <ProductForm type="Create" />
    </div>
  );
};

export default CreateProductPage;
