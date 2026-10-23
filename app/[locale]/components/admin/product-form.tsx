"use client";

import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductsSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import slugify from "slugify";

import { UploadButton } from "@/lib/uploadthing";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/[locale]/components/ui/form";
import { Input } from "@/app/[locale]/components/ui/input";
import { Textarea } from "@/app/[locale]/components/ui/textarea";
import { Checkbox } from "@/app/[locale]/components/ui/checkbox";
import { Button } from "@/app/[locale]/components/ui/button";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/[locale]/components/ui/select";

const ProductForm = ({
  type,
  product,
  productId,
  categories,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
  categories: { id: string; name: string }[];
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: (type === "Update"
      ? zodResolver(updateProductsSchema)
      : zodResolver(insertProductSchema)) as any,
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });

  const onSubmit = async (values: z.infer<typeof insertProductSchema>) => {
    try {
      // Warn if a translated name is provided without its description.
      const missingTranslations: string[] = [];

      if (values.nameAr?.trim() && !values.descriptionAr?.trim()) {
        missingTranslations.push("Arabic");
      }

      if (values.nameFr?.trim() && !values.descriptionFr?.trim()) {
        missingTranslations.push("French");
      }

      if (missingTranslations.length > 0) {
        toast.warning(
          `Please enter the ${missingTranslations.join(" and ")} description${
            missingTranslations.length > 1 ? "s" : ""
          } before saving.`,
        );
        return;
      }

      if (type === "Create") {
        const res = await createProduct(values);

        if (!res.success) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          router.push("/admin/products");
        }

        return;
      }

      if (type === "Update") {
        if (!productId) {
          toast.error("Product ID is missing.");
          return;
        }

        const res = await updateProduct({
          ...values,
          id: productId,
        });

        if (!res.success) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          router.push("/admin/products");
        }
      }
    } catch (error) {
      console.error("Product submission failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const images = form.watch("images") ?? [];
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* =========================
            ENGLISH PRODUCT DETAILS
        ========================= */}

        <Card>
          <CardContent className="space-y-5 pt-6">
            <h2 className="text-lg font-semibold">English - Product Details</h2>

            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Product Name (English)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter product slug"
                          className="pr-24"
                          {...field}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const name = form.getValues("name");

                            form.setValue(
                              "slug",
                              slugify(name || "", {
                                lower: true,
                                strict: true,
                              }),
                              { shouldValidate: true },
                            );
                          }}
                          className="absolute right-1 top-1"
                        >
                          Generate
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (English)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* =========================
            ARABIC PRODUCT DETAILS
        ========================= */}

        <Card>
          <CardContent className="space-y-5 pt-6">
            <h2 className="text-lg font-semibold">العربية - تفاصيل المنتج</h2>

            <FormField
              control={form.control}
              name="nameAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المنتج</FormLabel>
                  <FormControl>
                    <Input
                      dir="rtl"
                      lang="ar"
                      placeholder="أدخل اسم المنتج"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptionAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف المنتج</FormLabel>
                  <FormControl>
                    <Textarea
                      dir="rtl"
                      lang="ar"
                      placeholder="أدخل وصف المنتج"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* =========================
            FRENCH PRODUCT DETAILS
        ========================= */}

        <Card>
          <CardContent className="space-y-5 pt-6">
            <h2 className="text-lg font-semibold">
              Français - Détails du produit
            </h2>

            <FormField
              control={form.control}
              name="nameFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du produit</FormLabel>
                  <FormControl>
                    <Input
                      lang="fr"
                      placeholder="Entrez le nom du produit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptionFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description du produit</FormLabel>
                  <FormControl>
                    <Textarea
                      lang="fr"
                      placeholder="Entrez la description du produit"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* =========================
            CATEGORY AND BRAND
        ========================= */}

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>

                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* =========================
            PRICE AND STOCK
        ========================= */}

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter product price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter product stock"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* =========================
            PRODUCT IMAGES
        ========================= */}

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem className="w-full">
              <FormLabel>Product Images</FormLabel>

              <Card>
                <CardContent className="min-h-48 space-y-4 pt-6">
                  <div className="flex flex-wrap items-start gap-4">
                    {images.map((image: string) => (
                      <div key={image} className="relative">
                        <Image
                          src={image}
                          alt="Product image"
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            form.setValue(
                              "images",
                              images.filter((img: string) => img !== image),
                              { shouldValidate: true },
                            )
                          }
                          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        if (res?.[0]?.url) {
                          form.setValue(
                            "images",
                            [...(form.getValues("images") ?? []), res[0].url],
                            { shouldValidate: true },
                          );
                          toast.success("Image uploaded successfully.");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(error.message);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================
            FEATURED PRODUCT
        ========================= */}

        <Card>
          <CardContent className="mt-2 space-y-4 pt-6">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormLabel>Is Featured?</FormLabel>
                </FormItem>
              )}
            />

            {isFeatured && banner && (
              <div className="relative">
                <Image
                  src={banner}
                  alt="Product banner"
                  className="w-full rounded-sm object-cover object-center"
                  width={1920}
                  height={680}
                />

                <button
                  type="button"
                  onClick={() => form.setValue("banner", null)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                  aria-label="Remove banner"
                >
                  ×
                </button>
              </div>
            )}

            {isFeatured && !banner && (
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res: { url: string }[]) => {
                  if (res?.[0]?.url) {
                    form.setValue("banner", res[0].url);
                    toast.success("Banner uploaded successfully.");
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(error.message);
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* =========================
            SUBMIT
        ========================= */}

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Product`}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
