import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../Components/Header";

function CheckoutFormContent() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [_loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const renderPayPalButtons = useCallback(() => {
    if (!window.paypal) {
      console.log("PayPal SDK not ready");
      return;
    }

    const container = document.getElementById("paypal-button-container");
    if (!container) return;

    window.paypal
      .Buttons({
        createOrder: async () => {
          try {
            setLoading(true);
            console.log("📝 Creating PayPal order...");

            const token = Cookies.get("token");
            if (!token) {
              navigate("/login");
              return;
            }

            const paymentData = {
              books: items.map((item) => ({
                bookId: item._id,
                quantity: item.quantity,
              })),
            };

            console.log("📤 Sending to backend:", paymentData);

            const response = await axios.post(
              "http://localhost:5000/api/create-paypal-order",
              paymentData,
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              },
            );

            console.log("💰 Backend Response:", response.data);

            if (!response.data.success) {
              throw new Error(
                response.data.message || "Failed to create order",
              );
            }

            return response.data.paypalOrderId;
          } catch (err) {
            console.error("❌ Error creating order:", err);
            setError(err.message || "Failed to create PayPal order");
            throw err;
          } finally {
            setLoading(false);
          }
        },

        onApprove: async (data) => {
          try {
            setLoading(true);
            console.log("✅ Order approved, capturing payment...");

            const token = Cookies.get("token");

            const response = await axios.post(
              "http://localhost:5000/api/capture-paypal-order",
              { paypalOrderId: data.orderID },
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              },
            );

            console.log("💳 Payment captured:", response.data);

            if (response.data.success && response.data.status === "COMPLETED") {
              // Save purchases to localStorage
              const existingPurchases =
                JSON.parse(localStorage.getItem("purchases")) || [];
              const timestamp = Date.now();
              const randomStr = Math.random().toString(36).substr(2, 5);

              const newPurchases = items.map((item, index) => ({
                ...item,
                purchasedAt: new Date().toISOString(),
                purchaseId: `${timestamp}-${randomStr}-${item._id}-${index}`,
                paypalOrderId: data.orderID,
              }));
              localStorage.setItem(
                "purchases",
                JSON.stringify([...existingPurchases, ...newPurchases]),
              );

              alert(
                "✅ Payment successful! Your books are ready for download.",
              );
              clearCart();
              navigate("/my-books");
            }
          } catch (err) {
            console.error("❌ Error capturing payment:", err);
            setError(err.message || "Failed to capture payment");
          } finally {
            setLoading(false);
          }
        },

        onError: (err) => {
          console.error("❌ PayPal error:", err);
          setError("Payment error. Please try again.");
          setLoading(false);
        },
      })
      .render("#paypal-button-container");
  }, [items, navigate, clearCart]);

  // Load PayPal script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=AZZ6kyxfUd_DH6SqisSQlRGCDMxqGUTjYD2dxToAn9ZgexmrKkG_nSn_6Cd7W-nxspp31sW53VEI1Nj5&currency=USD&intent=capture&vault=false&components=buttons`;
    script.async = true;
    script.onload = () => {
      setPaypalLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Render buttons when deps change
  useEffect(() => {
    if (paypalLoaded && window.paypal) {
      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = "";
        renderPayPalButtons();
      }
    }
  }, [items, totalPrice, paypalLoaded, renderPayPalButtons]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Items Preview */}
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3 pb-3 border-b">
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-orange-600">
                        ${item.price}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"}
                    )
                  </span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Checkout
                </h2>
                <p className="text-gray-600">Pay securely with PayPal</p>
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              {/* PayPal Button */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Payment Method
                </label>
                {paypalLoaded ? (
                  <div id="paypal-button-container" className="w-full"></div>
                ) : (
                  <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Loading PayPal...</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                💳 Powered by PayPal | Your payment is secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const { items } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-lg">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </p>
            <p className="text-gray-500 mb-6">
              Add some books to your cart before checking out.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-linear-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
      <CheckoutFormContent />
    </>
  );
}
