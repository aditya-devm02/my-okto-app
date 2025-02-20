import React from "react";

export default function Cart({ cartItems, removeFromCart }) {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="border p-4">
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
  );
} 