import { Metadata } from "next";
import { deleteOrder, getMyOrders } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";

export const metadata: Metadata = {
  title: "My Orders",
};

const OrdersPage = async (props: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page } = await props.searchParams;

  const currentPage = Number(page) || 1;

  const orders = await getMyOrders({
    page: currentPage,
  });

  return (
    <div className="space-y-2">
      <h2 className="my-10 font-bold">Orders</h2>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                {/* ID */}
                <TableCell>
                  {formatId(order.id)}
                </TableCell>

                {/* DATE */}
                <TableCell>
                  {formatDateTime(order.createdAt).datetime}
                </TableCell>

                {/* TOTAL */}
                <TableCell>
                  {formatCurrency(order.totalPrice)}
                </TableCell>

                {/* PAID */}
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).datetime
                    : "Not Paid"}
                </TableCell>

                {/* DELIVERED */}
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).datetime
                    : "Not Delivered"}
                </TableCell>

                {/* ACTIONS */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/order/${order.id}`}
                      className="text-sm hover:underline"
                    >
                      Details
                    </Link>

                    <DeleteDialog
                      id={order.id}
                      action={deleteOrder}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        {orders.totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={orders.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;