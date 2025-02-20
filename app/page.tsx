"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LoginButton } from "@/app/components/LoginButton";
import GetButton from "@/app/components/GetButton";
import { getAccount, useOkto } from '@okto_web3/react-sdk';
import ProductList from "@/app/components/ProductList";
import Cart from "@/app/components/Cart";
import { useRouter } from "next/router";

export default function Home() {
    const { data: session } = useSession();
    const oktoClient = useOkto();
    const [cartItems, setCartItems] = useState([]);
    const router = useRouter();
 
    //@ts-ignore
    const idToken = useMemo(() => (session ? session.id_token : null), [session]);
 
    async function handleAuthenticate(): Promise<any> {
        if (!idToken) {
            return { result: false, error: "No google login" };
        }
        const user = await oktoClient.loginUsingOAuth({
            idToken: idToken,
            provider: 'google',
        });
        console.log("Authentication Success", user);
        return JSON.stringify(user);
    }
 
    async function handleLogout() {
        try {
            signOut();
            return { result: "logout success" };
        } catch (error) {
            return { result: "logout failed" };
        }
    }
 
    useEffect(()=>{
        if(idToken){
            handleAuthenticate();
        }
    }, [idToken])

    const addToCart = (product) => {
        setCartItems([...cartItems, product]);
    };

    const removeFromCart = (index) => {
        setCartItems(cartItems.filter((_, i) => i !== index));
    };

    const handleViewCart = () => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        router.push("/cart");
    };

    return (
        <main className="flex min-h-screen flex-col items-center space-y-6 p-12 bg-violet-200">
            <div className="text-black font-bold text-3xl mb-8">E-commerce App</div>
 
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-8">
                <LoginButton />
                <GetButton title="Okto Log out" apiFn={handleLogout} />
                <GetButton title="getAccount" apiFn={getAccount} />
            </div>
            <ProductList addToCart={addToCart} />
            <button onClick={handleViewCart} className="mt-4 bg-green-500 text-white px-4 py-2">
                View Cart
            </button>
            <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
        </main>
    );
}