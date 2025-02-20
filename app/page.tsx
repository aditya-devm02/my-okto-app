"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LoginButton } from "@/app/components/LoginButton";
import GetButton from "@/app/components/GetButton";
import { getAccount, useOkto } from '@okto_web3/react-sdk';
import { products } from "@/app/data/products"; // Import products directly
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
        const updatedCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    };

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

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

            {/* Product List */}
            <div className="grid grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border p-4">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                        <h2 className="text-xl font-bold">{product.name}</h2>
                        <p>{product.description}</p>
                        <p className="text-lg font-semibold">${product.price}</p>
                        <button
                            onClick={() => addToCart(product)}
                            className="mt-2 bg-blue-500 text-white px-4 py-2"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {/* Cart Display */}
            <div className="border p-4 mt-6 w-full">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index} className="flex justify-between">
                                <span>{item.name}</span>
                                <span>${item.price}</span>
                                <button onClick={() => removeFromCart(index)} className="text-red-500">
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
            </div>
        </main>
    );
}