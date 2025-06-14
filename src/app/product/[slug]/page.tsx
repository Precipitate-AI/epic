// src/app/product/[slug]/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useCartStore } from '@/hooks/use-cart-store'; // <-- IMPORTED THE CART STORE

// --- Interfaces (No changes) ---
interface Variant {
    id: string;
    name: string;
    value: string;
}
interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    createdAt: Date;
    updatedAt: Date;
    variants: Variant[];
}
type GroupedVariants = { [key: string]: string[] };
type SelectedVariants = { [key: string]: string };

export default function ProductPage({ params }: { params: { slug: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImage, setCurrentImage] = useState<string>('');
    const [groupedVariants, setGroupedVariants] = useState<GroupedVariants>({});
    const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({});
    
    // <-- GETTING THE addItem FUNCTION FROM THE STORE
    const { addItem } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/product/${params.slug}`);
                if (!response.ok) throw new Error('Product not found');
                const data: Product = await response.json();
                setProduct(data);
                setCurrentImage(data.images[0]);
                const variants: GroupedVariants = data.variants.reduce((acc, variant) => {
                    if (!acc[variant.name]) acc[variant.name] = [];
                    acc[variant.name].push(variant.value);
                    return acc;
                }, {} as GroupedVariants);
                setGroupedVariants(variants);
            } catch (err) {
                setError('Failed to load product.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.slug]);

    const handleVariantSelect = (name: string, value: string) => {
        setSelectedVariants(prev => ({ ...prev, [name]: value }));
    };

    const isAddToCartDisabled = Object.keys(groupedVariants).length !== Object.keys(selectedVariants).length;

    if (loading) return <div className="container mx-auto p-8 text-center">Loading product...</div>;
    if (error || !product) return <div className="container mx-auto p-8 text-center text-red-500">{error || 'Product could not be found.'}</div>;

    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Image Gallery Section */}
                <div>
                    <div className="aspect-square w-full overflow-hidden rounded-lg border">
                        <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex space-x-2 mt-4">
                        {product.images.map((img) => (
                            <button key={img} onClick={() => setCurrentImage(img)} className={`w-20 h-20 rounded-md overflow-hidden border-2 transition ${currentImage === img ? 'border-blue-600' : 'border-transparent'}`}>
                                <img src={img} alt={`${product.name} thumbnail`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info and Actions Section */}
                <div className="flex flex-col space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
                    <p className="text-3xl text-gray-800">IDR {product.price.toLocaleString('id-ID')}</p>
                    <div className="prose max-w-none text-gray-600"><p>{product.description}</p></div>

                    {/* Variant Display */}
                    <div className="space-y-4 pt-4">
                        {Object.entries(groupedVariants).map(([name, values]) => (
                            <div key={name}>
                                <h3 className="text-sm font-medium text-gray-900">{name}: <span className="font-semibold">{selectedVariants[name]}</span></h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {values.map((value) => (
                                        <button key={value} onClick={() => handleVariantSelect(name, value)} className={`px-4 py-2 text-sm border rounded-lg transition-colors duration-200 ${selectedVariants[name] === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add to Cart Button */}
                    <div className="pt-6">
                        <button
                            // <-- MODIFIED onClick HANDLER
                            onClick={() => {
                                if (!product) return;
                                addItem({
                                    productId: product.id,
                                    name: product.name,
                                    image: product.images[0],
                                    price: product.price,
                                    selectedVariants: selectedVariants,
                                });
                                // Optional: Add a visual confirmation later
                                alert('Added to cart!');
                            }}
                            disabled={isAddToCartDisabled}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {isAddToCartDisabled ? 'Select Options' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
