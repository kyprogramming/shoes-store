'use server';

import { auth, signIn, signOut } from "@/auth";
import { paymentMethodSchema, shippingAddressSchema, signInFormSchema, signUpFormSchema } from "../validator";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { handleError } from "../utils";
import { PaymentMethod, ShippingAddress } from "@/types";

// Sign in user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        })

        await signIn('credentials', user);

        return {success: true, message: 'Signed in successfully'}

    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {success: false, message: 'Invalid email or password'}
    }
 }


// Sign out user
export async function signOutUser() {
    await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
    try {

        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        });

        const plainPassword = user.password;
        user.password = hashSync(plainPassword, 10);

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            }
        });


        await signIn('credentials', {
            email: user.email,
            password: plainPassword
        });

        return { success: true, message: 'User registered successfully' }


    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: handleError(error) } 
    }

}

export async function getUserById(userId: string) {
    const user = await prisma.user.findFirst({
        where: { id: userId }
    });
    if (!user) throw new Error('User not found');
    return user;
}


export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id }
        });
        if (!currentUser) throw new Error('User not found');

        const address = shippingAddressSchema.parse(data);
        await prisma.user.update({
            where: { id: currentUser.id },
            data: { address },
        });
        return {
            success: true,
            message: 'User address updated successfully'
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: handleError(error) } 
    }
}

export async function updateUserPaymentMethod(data: PaymentMethod) {
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id }
        });
        if (!currentUser) throw new Error('User not found');

        const paymentMethod = paymentMethodSchema.parse(data);
        await prisma.user.update({
            where: { id: currentUser.id },
            data: { paymentMethod: paymentMethod.type },
        });
        return {
            success: true,
            message: 'User payment method updated successfully'
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: handleError(error) }
    }
}