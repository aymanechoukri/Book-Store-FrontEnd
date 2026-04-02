import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../Components/Header";

export default function MyBooks() {
  const navigate = useNavigate();
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const token = Cookies.get("token");

  const fetchPurchasedBooks = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/my-books", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      
      // If backend returns empty but localStorage has data, use localStorage
      if (res.data.books && res.data.books.length > 0) {
        console.log("✅ Books from backend:", res.data.books);
        setPurchasedBooks(res.data.books);
      } else {
        const localPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
        console.log("💾 Backend empty, using localStorage:", localPurchases);
        setPurchasedBooks(localPurchases);
      }
    } catch (err) {
      console.error("Error fetching books from backend:", err);
      // Fallback: Load from localStorage (temporary solution)
      const localPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
      console.log("💾 Using localStorage fallback:", localPurchases);
      setPurchasedBooks(localPurchases);
      
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Add a small delay to ensure data is saved from checkout
    const timer = setTimeout(() => {
      fetchPurchasedBooks();
    }, 300);

    // Listen for storage changes (when purchase is made in another tab/window)
    const handleStorageChange = (e) => {
      if (e.key === 'purchases') {
        console.log("📢 Storage updated, refreshing books...");
        fetchPurchasedBooks();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [token, navigate, fetchPurchasedBooks]);

  const handleDownload = async (pdfUrl, filename, bookId) => {
    try {
      setDownloadingId(bookId);
      const token = Cookies.get("token");
      
      // Check localStorage first (always available)
      const localPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
      const purchased = localPurchases.some(item => item._id === bookId);
      
      // If not in localStorage, try backend verification
      if (!purchased) {
        try {
          const purchaseCheckRes = await axios.post(
            "http://localhost:5000/api/verify-purchase",
            { bookId },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          
          if (!purchaseCheckRes.data.verified) {
            alert("❌ You don't have access to this book!");
            return;
          }
        } catch {
          // Backend verification failed (404 or unavailable)
          console.warn("Backend verification not available, checking localStorage only...");
          alert("❌ You don't have access to this book!");
          return;
        }
      }

      // Proceed with download
      const res = await fetch(pdfUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        Cookies.remove("token");
        navigate("/login");
        return;
      }

      if (res.status === 403) {
        alert("❌ You don't have permission to download this file!");
        return;
      }

      if (!res.ok) {
        throw new Error("Download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      
      alert("✅ Download completed successfully!");
    } catch (err) {
      console.error("Download error:", err);
      alert("❌ Download error: " + err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">Loading your library...</p>
          </div>
        </div>
      </>
    );
  }

  if (purchasedBooks.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-lg">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mb-2">No books purchased yet</p>
            <p className="text-gray-500 mb-6">Start your reading journey by buying your first book!</p>
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
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Library</h1>
                <p className="text-gray-600">
                  {purchasedBooks.length} {purchasedBooks.length === 1 ? 'book' : 'books'} in your collection
                </p>
              </div>
              <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                📚 Purchased Books
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {purchasedBooks.map((book) => (
              <div
                key={book.purchaseId || book._id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-100 h-64">
                  <img
                    src={`http://localhost:5000/uploads/${book.image}`}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ${book.price}
                  </div>
                  {/* Download Badge */}
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    📄 PDF Available
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {book.description.length > 100
                      ? book.description.substring(0, 100) + "..."
                      : book.description}
                  </p>

                  {/* Purchase Date (if available) */}
                  {book.purchasedAt && (
                    <p className="text-xs text-gray-400 mb-3 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Purchased: {new Date(book.purchasedAt).toLocaleDateString()}
                    </p>
                  )}

                  {/* Download Button */}
                  <button
                    onClick={() =>
                      handleDownload(
                        `http://localhost:5000/uploads/${book.pdf}`,
                        `${book.title}.pdf`,
                        book._id
                      )
                    }
                    disabled={downloadingId === book._id}
                    className={`w-full mt-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 ${
                      downloadingId === book._id
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {downloadingId === book._id ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download PDF
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          {purchasedBooks.length > 0 && (
            <div className="mt-12 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Stats</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{purchasedBooks.length}</p>
                  <p className="text-sm text-gray-600">Total Books</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    ${purchasedBooks.reduce((sum, book) => sum + book.price, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {purchasedBooks.filter(book => book.category).length}
                  </p>
                  <p className="text-sm text-gray-600">Categories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {new Date().getFullYear()}
                  </p>
                  <p className="text-sm text-gray-600">Year</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}