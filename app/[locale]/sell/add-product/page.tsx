import { Metadata } from "next";
import ProductForm from "@/app/[locale]/components/admin/product-form";
import { db } from "@/app/db";
import { categories } from "@/app/db/schema";
export const metadata: Metadata = {
  title: "Create Product",
};
const CreateProductPage = async () => {
  const allCategories = await db
    .select({ id: categories.id, name: categories.slug })
    .from(categories);

  return <ProductForm type="Create" categories={allCategories} />;
};

export default CreateProductPage;
