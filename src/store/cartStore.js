import { create } from 'zustand';

// Cart store using Zustand
export const useCartStore = create((set) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],
  
  // Add item to cart
  addToCart: (book) => set((state) => {
    const exists = state.items.find(item => item._id === book._id);
    let newItems;
    
    if (exists) {
      newItems = state.items.map(item =>
        item._id === book._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...state.items, { ...book, quantity: 1 }];
    }
    
    localStorage.setItem('cart', JSON.stringify(newItems));
    return { items: newItems };
  }),

  // Remove item from cart
  removeFromCart: (bookId) => set((state) => {
    const newItems = state.items.filter(item => item._id !== bookId);
    localStorage.setItem('cart', JSON.stringify(newItems));
    return { items: newItems };
  }),

  // Update quantity
  updateQuantity: (bookId, quantity) => set((state) => {
    const newItems = state.items.map(item =>
      item._id === bookId ? { ...item, quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(newItems));
    return { items: newItems };
  }),

  // Clear cart
  clearCart: () => set(() => {
    localStorage.removeItem('cart');
    return { items: [] };
  }),

  // Get total price
  getTotalPrice: () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
}));
