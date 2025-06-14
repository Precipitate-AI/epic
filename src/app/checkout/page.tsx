// src/app/checkout/page.tsx
"use client";

import { useCartStore } from "@/hooks/use-cart-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const [isMounted, setIsMounted] = useState(false);
    const { items, clearCart } = useCartStore();
    const router = useRouter();
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '', customerEmail: '', customerPhone: '',
        shippingAddress: '', city: '', province: '', postalCode: '',
    });

    useEffect(() => {
        setIsMounted(true);
        if (items.length === 0 && isMounted) {
            router.push('/');
        }
    }, [items, router, isMounted]);

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartItems: items,
                    customerDetails: formData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If the API returns an error
                throw new Error(data.error || 'Something went wrong');
            }

            // On success, Midtrans provides a redirect_url
            if (data.redirect_url) {
                // Clear the cart *before* redirecting
                clearCart();
                // Redirect the user to the Midtrans payment page
                window.location.href = data.redirect_url;
            }

        } catch (error) {
            console.error('Failed to process payment:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
            setLoading(false);
        }
    };
    
    if (!isMounted) return <main className="container mx-auto px-4 py-8 text-center">Loading...</main>;

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Input fields remain the same, so they are omitted here for brevity. Just ensure they use onChange={handleInputChange} */}
                        <input type="text" name="customerName" placeholder="Full Name" required className="w-full p-2 border rounded-md" onChange={handleInputChange} value={formData.customerName} />
                        <input type="email" name="customerEmail" placeholder="Email" required className="w-full p-2 border rounded-md" onChange={handleInputChange} value={formData.customerEmail} />
                        <input type="tel" name="customerPhone" placeholder="Phone Number (e.g., 08123456789)" required className="w-full p-2 border rounded-md" onChange={handleInputChange} value={formData.customerPhone} />
                        <input type="text" name="shippingAddress" placeholder="Full Address (Street, Number, etc.)" required className="w-full p-2 border rounded-md" onChange={handleInputChange} value={formData.shippingAddress} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" name="city" placeholder="City / Regency" required className="p-2 border rounded-md" onChange={handleInputChange} value={formData.city} />
                            <input type="text" name="province" placeholder="Province" required className="p-2 border rounded-md" onChange={handleInputChange} value={formData.province} />
                            <input type="text" name="postalCode" placeholder="Postal Code" required className="p-2 border rounded-md" onChange={handleInputChange} value={formData.postalCode} />
                        </div>
                    </form>
                </div>
                <div className="lg:col-span-1">
                    <div className="rounded-lg border bg-gray-50 p-6 sticky top-28">
                        <h2 className="text-xl font-semibold mb-4">Your Order</h2>
                        <ul className="space-y-4 mb-6">
                            {/* Order summary list remains the same */}
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
                             <div className="flex justify-between text-base font-medium"><p>Order Total</p><p>IDR {subtotal.toLocaleString('id-ID')}</p></div>
                        </div>
                        <div className="mt-6">
                            <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {loading ? 'Processing...' : 'Place Order & Proceed to Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
