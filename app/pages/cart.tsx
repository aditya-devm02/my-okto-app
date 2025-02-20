import React from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  const handleRemoveFromCart = (index: number) => {
    const updatedCartItems = cartItems.filter((_: any, i: number) => i !== index);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    router.reload();
  };

  const total = cartItems.reduce((sum: number, item: any) => sum + item.price, 0);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cartItems.map((item: any, index: number) => (
            <li key={index} className="flex justify-between mb-2">
              <span>{item.name}</span>
              <span>${item.price}</span>
              <button onClick={() => handleRemoveFromCart(index)} className="text-red-500">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-lg font-semibold mt-4">Total: ${total.toFixed(2)}</p>
    </div>
  );
} 