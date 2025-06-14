// src/components/CartIcon.tsx
"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from "@/hooks/use-cart-store";
import Link from 'next/link'; // <-- IMPORT LINK

const CartIcon = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { items } = useCartStore();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    if (!isMounted) {
         return (
            <div className="relative flex items-center p-2">
                <ShoppingBag className="h-6 w-6 text-gray-600" />
            </div>
        );
    }

    return (
        // <-- WRAP EVERYTHING IN A LINK TAG
        <Link href="/cart" className="relative flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ShoppingBag className="h-6 w-6 text-gray-600" />
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white font-semibold">
                    {totalItems}
                </span>
            )}
        </Link>
    );
};

export default CartIcon;
