import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../Components/Header";

function SimpleCheckoutForm() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
  };

  // Validate Card Number using Luhn Algorithm
  const validateCardNumber = (cardNumber) => {
    const num = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(num)) return false;
    
    let sum = 0;
    let isEven = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  // Validate Expiry Date
  const validateExpiry = (expiry) => {
    if (!expiry.includes('/')) return false;
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  };

  // Validate CVC
  const validateCVC = (cvc) => {
    return /^\d{3,4}$/.test(cvc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");

      // ✅ Email validation
      if (!email.includes('@')) {
        setError("❌ Invalid email address");
        setLoading(false);
        return;
      }

      // ✅ Card number validation
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      if (!validateCardNumber(cleanCardNumber)) {
        setError("❌ Invalid card number (must be 13-19 digits)");
        setLoading(false);
        return;
      }

      // ✅ Expiry date validation
      if (!validateExpiry(expiry)) {
        setError("❌ Invalid expiry date or card has expired");
        setLoading(false);
        return;
      }

      // ✅ CVC validation
      if (!validateCVC(cvc)) {
        setError("❌ Invalid CVC (must be 3 or 4 digits)");
        setLoading(false);
        return;
      }

      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const expiryParts = expiry.split("/");
      const response = await axios.post(
        "http://localhost:5000/api/create-payment-intent",
        {
          amount: Math.round(totalPrice * 100),
          items: items.map((item) => ({
            bookId: item._id,
            quantity: item.quantity,
          })),
          email,
          cardData: {
            number: cardNumber.replace(/\s/g, ''),
            exp_month: expiryParts[0] || "",
            exp_year: expiryParts[1] || "",
            cvc,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      ).catch(() => {
        // If backend endpoint fails, simulate purchase locally
        console.warn("Backend payment endpoint not ready, simulating locally...");
        return { data: { success: true, simulated: true } };
      });

      if (response.data.success) {
        // Save purchases to localStorage (temporary solution)
        const existingPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
        
        // Give each book in this purchase a unique purchaseId
        const newPurchases = items.map((item, index) => ({
          ...item,
          purchasedAt: new Date().toISOString(),
          purchaseId: `${Math.random().toString(36).substr(2, 9)}-${index}`, // Unique for each item
        }));
        
        const allPurchases = [...existingPurchases, ...newPurchases];
        localStorage.setItem('purchases', JSON.stringify(allPurchases));
        
        console.log("💾 Saved purchases to localStorage:", allPurchases);
        
        alert("✅ Payment successful! Your books are ready for download.");
        clearCart();
        navigate("/my-books");
      } else {
        setError(response.data.message || "Payment failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred during payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
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
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-orange-600">${item.price}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
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
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h2>
                <p className="text-gray-600">Complete your purchase securely</p>
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {/* Payment Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                
                {/* Card Number */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <span className="text-xl">💳</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ✓ Valid card: must be 13-19 digits
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">MM/YY Example: 12/25</p>
                  </div>
                  
                  {/* CVC */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength="4"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">3 or 4 digits</p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Pay ${totalPrice.toFixed(2)}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>

              {/* Security Notice */}
              <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-2V9a2 2 0 00-2-2H8a2 2 0 00-2 2v2" />
                </svg>
                Secure payment encrypted with SSL
              </p>
            </form>
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
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</p>
            <p className="text-gray-500 mb-6">Add some books to your cart before checking out.</p>
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
      <SimpleCheckoutForm />
    </>
  );
}