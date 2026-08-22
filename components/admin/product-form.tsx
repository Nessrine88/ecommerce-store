'use client';

import { productDefaultValues } from '@/lib/constants';
import { insertProductSchema, updateProductsSchema } from '@/lib/validators';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import slugify from 'slugify';
import { UploadButton } from '@/lib/uploadthing';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: (type === 'Update'
      ? zodResolver(updateProductsSchema)
      : zodResolver(insertProductSchema)) as any,
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  });

  const onSubmit = async (values: z.infer<typeof insertProductSchema>) => {
    // CREATE
    if (type === 'Create') {
      const res = await createProduct(values);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push('/admin/products');
      }
      return;
    }

    // UPDATE
    if (type === 'Update') {
      if (!productId) {
        router.push('/admin/products');
        return;
      }
      const res = await updateProduct({ ...values, id: productId });
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push('/admin/products');
      }
    }
  };
const images = form.watch('images')
  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Enter product slug" className="pl-8" {...field} />
                    <button
                      type="button"
                      onClick={() =>
                        form.setValue(
                          'slug',
                          slugify(form.getValues('name'), { lower: true })
                        )
                      }
                      className="absolute right-2 top-2.5 text-sm text-blue-600"
                    >
                      Generate
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'category'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'brand'>;
            }) => (
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

        <div className="flex flex-col gap-5 md:flex-row">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'price'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock */}
          <FormField
            control={form.control}
            name="stock"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'stock'>;
            }) => (
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

        <div className="upload-field flex flex-col gap-5 md:flex-row">
          {/* Images */}
            <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Image</FormLabel>
                <Card>
                  <CardContent className='spaace-y-2 min-h-48'>
                    <div className="flex-start space-x-2">
                     {images.map((image:string)=>(

                      <Image key={image} src={image} alt = 'product image' width={100} height={100} />

                     ))}
                     <FormControl>
                      <UploadButton endpoint={'imageUploader'} onClientUploadComplete={(res: {url:string}[]) => {
                        form.setValue('images', [...images, res[0].url])
                      }}
                      />
                      {/* onUploadError = {(error: Error)=> {
                        toast.error(error.message)
                      }} */}
                     </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

      

        <div>
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'description'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
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
        </div>

        <div>
          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;