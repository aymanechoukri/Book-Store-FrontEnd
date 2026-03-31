import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import Header from "../Components/Header";
import Cookies from "js-cookie";

export default function Books() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("default");
  const { addToCart } = useCartStore();
  const [addedBooks, setAddedBooks] = useState([]);

  const filterAndSortBooks = useCallback(() => {
    let filtered = [...books];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(book => book.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(book => book.price <= parseFloat(priceRange.max));
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Default sorting by newest or original order
        break;
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedCategory, priceRange, sortBy]);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchTerm, selectedCategory, priceRange, sortBy, filterAndSortBooks]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data.books);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(res.data.books.map(book => book.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (book) => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }
    addToCart(book);
    setAddedBooks([...addedBooks, book._id]);
    setTimeout(() => {
      setAddedBooks(prev => prev.filter(id => id !== book._id));
    }, 2000);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("default");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">Loading books...</p>
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">All Books</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of amazing books. Find your next great read today!
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Books
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, author..."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-1/2 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-1/2 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title-asc">Title: A to Z</option>
                  <option value="title-desc">Title: Z to A</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                Found {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
              </p>
              <button
                onClick={clearFilters}
                className="text-orange-600 hover:text-orange-700 text-sm font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-gray-500 text-lg">No books found matching your criteria</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-orange-600 hover:text-orange-700 font-semibold"
              >
                Clear filters and try again
              </button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gray-100 h-64 cursor-pointer" onClick={() => navigate(`/book/${book._id}`)}>
                    <img
                      src={`http://localhost:5000/uploads/${book.image}`}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      ${book.price}
                    </div>
                    {/* Category Badge */}
                    {book.category && (
                      <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {book.category}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    
                    {book.author && (
                      <p className="text-sm text-gray-500 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {book.author}
                      </p>
                    )}

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {book.description.length > 100
                        ? book.description.substring(0, 100) + "..."
                        : book.description}
                    </p>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(book)}
                      className={`w-full mt-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 ${
                        addedBooks.includes(book._id)
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg"
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
          )}
        </div>
      </div>
    </>
  );
}