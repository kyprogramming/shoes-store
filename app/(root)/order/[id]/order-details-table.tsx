'use client';
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from 'next/image';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { OrderItem } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OrderDetailsTable = ({ order }: { order: any }) => {
    const { id,
        shippingAddress,
        orderitems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isDelivered,
        isPaid,
        paidAt,
        deliveredAt
    } = order;
    return (<>
        <h1 className="py-4 text-2xl font-bold">Order - {formatId(id)}</h1>
        <div className="grid md:grid-cols-3 md:gap-5">
            {/* left  */}
            <div className="md:col-span-2 overflow-x-auto space-y-4">
                <Card>
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-xl pb-4">Shipping Address</h2>
                        <p>{shippingAddress.fullName}</p>
                        <p>
                            {shippingAddress.streetAddress}, {shippingAddress.city} {' '}
                            {shippingAddress.postalCode}, {shippingAddress.country} {' '}
                        </p>
                        <div className="mt-3">
                            {isDelivered ? (
                                <Badge variant='secondary'>
                                    Delivered at {formatDateTime(deliveredAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant='destructive'>
                                    Not Delivered
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-xl pb-4">Payment Method</h2>
                        <p>{paymentMethod}</p>
                        <div className="mt-3">
                            {isPaid ? (
                                <Badge variant='secondary'>
                                    Paid at {formatDateTime(paidAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant='destructive'>
                                    Not paid
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-xl pb-4">Order Items</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderitems.map((item: OrderItem) => (
                                    <TableRow key={item.slug}>
                                        <TableCell className="flex items-center">
                                            <Link href={`/product/${item.slug}`} className="flex items-center">
                                                <Image src={item.image} alt={item.name} width={50} height={50} />
                                                <span className="px-2">{item.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-center gap-2">
                                            <span className="px-2">{item.qty}</span>
                                        </TableCell>
                                        <TableCell className="text-right">{formatCurrency(String(item.price))}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            {/* right */}
            <div>
                <Card>
                    <CardContent className='p-4 gap-4 space-y-4'>
                        <div className='flex justify-between'>
                            <div>Items</div>
                            <div>{formatCurrency(itemsPrice)}</div>
                        </div>
                        <div className='flex justify-between'>
                            <div>Tax</div>
                            <div>{formatCurrency(taxPrice)}</div>
                        </div>
                        <div className='flex justify-between'>
                            <div>Shipping</div>
                            <div>{formatCurrency(shippingPrice)}</div>
                        </div>
                        <div className='flex justify-between'>
                            <div>Total</div>
                            <div>{formatCurrency(totalPrice)}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </>);
}

export default OrderDetailsTable;