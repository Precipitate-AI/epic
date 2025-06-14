// src/app/cart/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useCartStore } from '@/hooks/use-cart-store';
import { X, Plus, Minus } from 'lucide-react'; // <-- Import Plus and Minus
import Link from 'next/link';

export default function CartPage() {
    const [isMounted, setIsMounted] = useState(false);
    // <-- Get the new actions from the store
    const { items, removeItem, increaseQuantity, decreaseQuantity } = useCartStore();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    if (!isMounted) {
        return (
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold tracking-tight mb-8">Loading Your Cart...</h1>
            </main>
        );
    }
    
    if (items.length === 0) {
        return (
             <main className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link href="/" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                    Continue Shopping
                </Link>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2">
                    <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
                        {items.map((item) => (
                            <li key={item.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <h3>{item.name}</h3>
                                            <p className="ml-4">IDR {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500">
                                            {Object.entries(item.selectedVariants).map(([name, value]) => (
                                                <p key={name}>{name}: {value}</p>
                                            ))}
                                            <p className="md:hidden mt-1">Unit Price: IDR {item.price.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                        {/* --- THIS IS THE NEW QUANTITY CONTROL BLOCK --- */}
                                        <div className="flex items-center border border-gray-200 rounded">
                                            <button onClick={() => decreaseQuantity(item.id)} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                                <Minus size={16} />
                                            </button>
                                            <span className="px-3 py-1 text-center text-gray-900 w-12">{item.quantity}</span>
                                            <button onClick={() => increaseQuantity(item.id)} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <div className="flex">
                                            <button onClick={() => removeItem(item.id)} type="button" className="font-medium text-blue-600 hover:text-blue-500">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 sticky top-28">
                        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Subtotal</p>
                                <p className="text-sm font-medium text-gray-900">IDR {subtotal.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <p className="text-base font-medium text-gray-900">Order Total</p>
                                <p className="text-base font-medium text-gray-900">IDR {subtotal.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

