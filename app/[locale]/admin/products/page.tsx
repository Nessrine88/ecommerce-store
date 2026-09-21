import { Link } from "@/navigation";
import {
  deleteProduct,
  getAllProducts,
} from "@/lib/actions/product.actions";
import {
  formatCurrency,
  formatId,
} from "@/lib/utils";
import { Button } from "@/app/[locale]/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/[locale]/components/ui/table";
import Pagination from "@/app/[locale]/components/shared/pagination";
import DeleteDialog from "@/app/[locale]/components/shared/delete-dialog";

const AdminProductsPage = async (props: {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string;
    query?: string;
    category?: string;
  }>;
}) => {
  const { locale } = await props.params;

  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";

  const products = await getAllProducts({
    query: searchText,
    page,
    category,
    locale,
  });

  return (
    <div className="space-y-2">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-bold">
            Products
          </h1>

          {searchText && (
            <div>
              Filtered by{" "}
              <i>
                &quot;{searchText}&quot;
              </i>{" "}
              <Link href="/admin/products">
                <Button
                  variant="outline"
                  size="sm"
                >
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Button
          variant="default"
          className="my-5"
        >
          <Link href="/admin/products/create">
            Create Product
          </Link>
        </Button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead className="text-right">
                PRICE
              </TableHead>
              <TableHead>
                CATEGORY
              </TableHead>
              <TableHead>STOCK</TableHead>
              <TableHead>RATING</TableHead>
              <TableHead className="w-[100px]">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.data.map(
              (product) => (
                <TableRow
                  key={product.id}
                >
                  <TableCell>
                    {formatId(
                      product.id
                    )}
                  </TableCell>

                  <TableCell>
                    {product.name}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(
                      product.price
                    )}
                  </TableCell>

                  <TableCell>
                    {product.categoryId}
                  </TableCell>

                  <TableCell>
                    {product.stock}
                  </TableCell>

                  <TableCell>
                    {product.rating}
                  </TableCell>

                  <TableCell className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Link
                        href={`/admin/products/${product.id}`}
                      >
                        Edit
                      </Link>
                    </Button>

                    <div className="rounded-sm bg-red-700">
                      <DeleteDialog
                        id={product.id}
                        action={deleteProduct}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>

      {products.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={
            products.totalPages
          }
        />
      )}
    </div>
  );
};

export default AdminProductsPage;