import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-lg">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</p>
            <p className="text-gray-500 mb-6">Looks like you haven't added any books to your cart yet.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Browse Books
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Image */}
                    <div className="sm:w-32 h-40 flex-shrink-0">
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                          {item.description.length > 80
                            ? item.description.substring(0, 80) + "..."
                            : item.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-orange-600 font-bold text-lg">
                            ${item.price}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-gray-400 text-sm">
                              × {item.quantity}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-lg bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-2 text-gray-600 hover:text-orange-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-2 text-gray-600 hover:text-orange-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-gray-500 text-sm">Subtotal</p>
                          <p className="font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button (Mobile) */}
              <div className="lg:hidden">
                <button
                  onClick={clearCart}
                  className="w-full border-2 border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-50 transition-all duration-200"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Including VAT</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-3"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 mb-3"
                >
                  Continue Shopping
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-red-600 py-2 rounded-lg font-semibold hover:text-red-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </button>

                {/* Payment Methods */}
                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center mb-3">Secure payment methods</p>
                  <div className="flex justify-center gap-2">
                    <span className="text-2xl">💳</span>
                    <span className="text-2xl">💵</span>
                    <span className="text-2xl">🪙</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Section (Optional) */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">You might also like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.slice(0, 4).map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow p-3 text-center hover:shadow-md transition">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                  <p className="text-orange-600 font-bold text-sm">${item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}