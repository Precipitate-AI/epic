// src/hooks/use-cart-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string; 
    productId: string;
    name: string;
    image: string;
    price: number;
    selectedVariants: { [key: string]: string };
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity' | 'id'>) => void;
    removeItem: (itemId: string) => void;
    clearCart: () => void;
    // --- NEW ACTIONS ---
    increaseQuantity: (itemId: string) => void;
    decreaseQuantity: (itemId: string) => void;
}

const generateItemId = (productId: string, variants: { [key: string]: string }) => {
    const variantKeys = Object.keys(variants).sort();
    const variantString = variantKeys.map(key => `${key}:${variants[key]}`).join('-');
    return `${productId}-${variantString}`;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                const itemId = generateItemId(newItem.productId, newItem.selectedVariants);
                const existingItem = get().items.find(item => item.id === itemId);

                if (existingItem) {
                    get().increaseQuantity(itemId); // Use the new action
                } else {
                    set(state => ({
                        items: [...state.items, { ...newItem, id: itemId, quantity: 1 }],
                    }));
                }
            },
            removeItem: (itemId) => {
                set(state => ({
                    items: state.items.filter(item => item.id !== itemId),
                }));
            },
            clearCart: () => set({ items: [] }),

            // --- IMPLEMENTATION OF NEW ACTIONS ---
            increaseQuantity: (itemId: string) => {
                set(state => ({
                    items: state.items.map(item =>
                        item.id === itemId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                }));
            },
            decreaseQuantity: (itemId: string) => {
                const itemToDecrease = get().items.find(item => item.id === itemId);

                if (itemToDecrease && itemToDecrease.quantity > 1) {
                    // If quantity is more than 1, just decrease it
                    set(state => ({
                        items: state.items.map(item =>
                            item.id === itemId
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                        ),
                    }));
                } else {
                    // If quantity is 1, remove the item completely
                    get().removeItem(itemId);
                }
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
