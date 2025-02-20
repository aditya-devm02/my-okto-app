"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LoginButton } from "@/app/components/LoginButton";
import GetButton from "@/app/components/GetButton";
import { getAccount, useOkto } from '@okto_web3/react-sdk';
import ProductList from "@/app/components/ProductList";
import { useRouter } from "next/navigation";

export default function Home() {
    const { data: session } = useSession();
    const oktoClient = useOkto();
    const [cartItems, setCartItems] = useState([]);
    const [popupMessage, setPopupMessage] = useState("");
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

    useEffect(() => {
        if (idToken) {
            handleAuthenticate();
        }
    }, [idToken]);

    const addToCart = (product) => {
        const updatedCartItems = [...cartItems, product];
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        setPopupMessage(`${product.name} added to cart!`);
        setTimeout(() => setPopupMessage(""), 3000);
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

            {/* Horizontal Row for Buttons */}
            <div className="flex space-x-4 mb-4">
                <LoginButton />
                <GetButton title="Okto Log out" apiFn={handleLogout} />
                <GetButton title="getAccount" apiFn={getAccount} />
            </div>

            {/* Popup Message */}
            {popupMessage && (
                <div className="bg-green-500 text-white p-2 rounded mb-4">
                    {popupMessage}
                </div>
            )}

            <ProductList addToCart={addToCart} />
            <button onClick={handleViewCart} className="mt-4 bg-green-500 text-white px-4 py-2">
                View Cart
            </button>
        </main>
    );
}