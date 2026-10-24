import { Metadata } from "next";
import { deleteOrder, getMyOrders } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Link } from "@/navigation";

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
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1a3f2e] via-[#12281d] to-[#0a1711] text-white transition-colors duration-300 dark:bg-none dark:bg-black dark:text-zinc-100 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Orders</h2>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5 dark:bg-zinc-900">
                <TableRow className="border-b border-white/10 hover:bg-transparent dark:border-zinc-800">
                  <TableHead className="text-white/70 dark:text-zinc-400">ID</TableHead>
                  <TableHead className="text-white/70 dark:text-zinc-400">DATE</TableHead>
                  <TableHead className="text-white/70 dark:text-zinc-400">TOTAL</TableHead>
                  <TableHead className="text-white/70 dark:text-zinc-400">PAID</TableHead>
                  <TableHead className="text-white/70 dark:text-zinc-400">DELIVERED</TableHead>
                  <TableHead className="text-white/70 dark:text-zinc-400">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.data.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/5 dark:border-zinc-800/60 dark:hover:bg-zinc-900/50"
                  >
                    {/* ID */}
                    <TableCell className="font-medium text-emerald-300 dark:text-emerald-400">
                      {formatId(order.id)}
                    </TableCell>

                    {/* DATE */}
                    <TableCell className="text-white/80 dark:text-zinc-300">
                      {formatDateTime(order.createdAt).datetime}
                    </TableCell>

                    {/* TOTAL */}
                    <TableCell className="font-semibold text-white dark:text-zinc-100">
                      {formatCurrency(order.totalPrice)}
                    </TableCell>

                    {/* PAID */}
                    <TableCell>
                      {order.isPaid && order.paidAt ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800/40">
                          {formatDateTime(order.paidAt).datetime}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-medium text-rose-300 dark:bg-rose-950/60 dark:text-rose-400 dark:border dark:border-rose-800/40">
                          Not Paid
                        </span>
                      )}
                    </TableCell>

                    {/* DELIVERED */}
                    <TableCell>
                      {order.isDelivered && order.deliveredAt ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800/40">
                          {formatDateTime(order.deliveredAt).datetime}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border dark:border-amber-800/40">
                          Not Delivered
                        </span>
                      )}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/order/${order.id}`}
                          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                          Details
                        </Link>

                        <DeleteDialog id={order.id} action={deleteOrder} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION */}
          {orders.totalPages > 1 && (
            <div className="border-t border-white/10 bg-black/10 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <Pagination page={currentPage} totalPages={orders.totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;