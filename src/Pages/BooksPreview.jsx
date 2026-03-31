import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import Cookies from "js-cookie";

export default function BooksPreview() {
  const [books, setBooks] = useState([]);
  const Go = useNavigate();
  const { addToCart } = useCartStore();
  const [addedBooks, setAddedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/books");
        setBooks(res.data.books);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleAddToCart = (book) => {
    // Check if user is logged in
    const token = Cookies.get("token");
    if (!token) {
      Go("/login");
      return;
    }

    addToCart(book);
    setAddedBooks([...addedBooks, book._id]);
    setTimeout(() => {
      setAddedBooks(prev => prev.filter(id => id !== book._id));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-500 text-lg">No books available yet.</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for new additions!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Book Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing books from our curated collection. Find your next great read today!
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book, index) => (
            <div
              key={book._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gray-100 h-64">
                <img
                  src={`http://localhost:5000/uploads/${book.image}`}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Price Badge */}
                <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  ${book.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {book.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {book.description.length > 120
                    ? book.description.substring(0, 120) + "..."
                    : book.description}
                </p>

                {/* Meta Information */}
                {book.author && (
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {book.author}
                  </p>
                )}

                {book.category && (
                  <p className="text-xs text-orange-500 mb-4 inline-block bg-orange-50 px-2 py-1 rounded-full">
                    {book.category}
                  </p>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(book)}
                  className={`w-full mt-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 ${
                    addedBooks.includes(book._id)
                      ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {addedBooks.includes(book._id) ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}