// src/app/checkout/page.tsx
"use client";

import { useCartStore } from "@/hooks/use-cart-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function CheckoutPage() {
    const [isMounted, setIsMounted] = useState(false);
    const { items, clearCart } = useCartStore();
    const router = useRouter();

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        city: '',
        province: '',
        postalCode: '',
    });

    useEffect(() => {
        setIsMounted(true);
        // Redirect to home if cart is empty on mount
        if (items.length === 0) {
            router.push('/');
        }
    }, [items, router]);

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        alert("Submitting Form... (Next step: connect to API)");
        // In the next step, we will send this data to our server API
        console.log({
            cartItems: items,
            customerDetails: formData,
            totalAmount: subtotal
        });
    };

    if (!isMounted) {
        return <main className="container mx-auto px-4 py-8 text-center">Loading...</main>;
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Shipping Form */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="customerName" placeholder="Full Name" required className="w-full p-2 border rounded" onChange={handleInputChange} />
                        <input type="email" name="customerEmail" placeholder="Email" required className="w-full p-2 border rounded" onChange={handleInputChange} />
                        <input type="tel" name="customerPhone" placeholder="Phone Number" required className="w-full p-2 border rounded" onChange={handleInputChange} />
                        <input type="text" name="shippingAddress" placeholder="Full Address (Street, Number, etc.)" required className="w-full p-2 border rounded" onChange={handleInputChange} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" name="city" placeholder="City / Regency" required className="p-2 border rounded" onChange={handleInputChange} />
                            <input type="text" name="province" placeholder="Province" required className="p-2 border rounded" onChange={handleInputChange} />
                            <input type="text" name="postalCode" placeholder="Postal Code" required className="p-2 border rounded" onChange={handleInputChange} />
                        </div>
                        <button type="submit" className="hidden">Submit</button> 
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="rounded-lg border bg-gray-50 p-6 sticky top-28">
                        <h2 className="text-xl font-semibold mb-4">Your Order</h2>
                        <ul className="space-y-4 mb-6">
                            {items.map(item => (
                                <li key={item.id} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium text-gray-800">{item.name} x{item.quantity}</p>
                                        <p className="text-gray-500">{Object.values(item.selectedVariants).join(', ')}</p>
                                    </div>
                                    <p className="font-mono text-gray-800">IDR {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-base font-medium">
                                <p>Order Total</p>
                                <p>IDR {subtotal.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                Place Order & Proceed to Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
