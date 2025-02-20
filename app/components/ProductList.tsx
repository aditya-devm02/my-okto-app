import React from "react";
import { products } from "../data/products";

export default function ProductList({ addToCart }) {
  return (
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
  );
} 