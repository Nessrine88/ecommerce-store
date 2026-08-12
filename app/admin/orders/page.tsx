import { auth } from "@/auth";
import { getAllOrders } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";

export const metadata:Metadata = {
    title: 'Admin Orders'
}
const AdminOrdersPage = async(props:{searchParams: Promise <{page:string} >} ) => {

    const {page = '1'} = await props.searchParams;
    const session = await auth();
    if(session?.user?.role !== 'admin') {throw new Error('User is not authorized ')}

    const orders = await getAllOrders({
        page: Number(page),
        limit:2
    })
   
  return (
       <div className="space-y-2">
        <h2 className="font-bold my-10">Orders</h2>
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
                    {orders.data.map((order)=>(
                        <TableRow key={order.id}>
                            <TableCell>
                                {formatId(order.id)}
                            </TableCell>
                            <TableCell>
                                {formatDateTime(order.createdAt).datetime}
                            </TableCell>
                            <TableCell>{formatCurrency(order.totalPrice)} </TableCell>
                            <TableCell>{order.isDelivered  && order.deliveredAt ? formatDateTime(order.deliveredAt).datetime : 'Not Paid' } </TableCell>
                            <TableCell>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).datetime : 'Not Paid' } </TableCell>
                            <TableCell>
                                <Link href={`/order/${order.id}`} >
                                    <Button variant='outline' size='sm'>
                                        Details
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {
                orders.totalPages >=1 && (
                    <Pagination page= {Number(page) || 100} totalPages={orders.totalPages} />
                )
            }
        </div>

    </div>
  )
}

export default AdminOrdersPage