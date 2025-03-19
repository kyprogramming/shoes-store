import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMyCart } from "@/lib/actions/cart.action";
import { getUserById } from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import Image from 'next/image';
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import PlaceOrderForm from "./place-order-form";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Place Order"
}

const PaceOrderPage = async () => {
    const cart = await getMyCart();
    const headersList = await headers();
    const callbackUrl = headersList.get('next-url');

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) redirect(`/sign-in?callbackUrl=${callbackUrl}`);
    const user = await getUserById(userId);
    const userAddress = user.address as ShippingAddress;
    if (!cart || cart.items.length === 0) redirect('/cart');
    if (!userAddress) redirect('/shipping-address');
    if (!user.paymentMethod) redirect('/payment-method');

    return (
        <>
            <CheckoutSteps current={3} />
            <h1 className="py-4 text-2xl font-bold">Place Order</h1>
            <div className="grid md:grid-cols-3 md:gap-5">
                {/* left  */}
                <div className="md:col-span-2 overflow-x-auto space-y-4">
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Shipping Address</h2>
                            <p>{userAddress.fullName}</p>
                            <p>
                                {userAddress.streetAddress}, {userAddress.city} {' '}
                                {userAddress.postalCode}, {userAddress.country} {' '}
                            </p>
                            <div className="mt-3">
                                <Link href='/shipping-address'>
                                    <Button variant='outline'>Edit</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Payment Method</h2>
                            <p>{user.paymentMethod}</p>
                            <div className="mt-3">
                                <Link href='/payment-method'>
                                    <Button variant='outline'>Edit</Button>
                                </Link>
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
                                    {cart.items.map((item) => (
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
                                            <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
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
                                <div>{formatCurrency(cart.itemsPrice)}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div>Tax</div>
                                <div>{formatCurrency(cart.taxPrice)}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div>Shipping</div>
                                <div>{formatCurrency(cart.shippingPrice)}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div>Total</div>
                                <div>{formatCurrency(cart.totalPrice)}</div>
                            </div>
                            <PlaceOrderForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default PaceOrderPage;