import axios from "axios";
import { useEffect, useState } from "react";

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function getBooks() {
      try {
        const res = await axios.get("http://localhost:5000/api/books");
        setBooks(res.data.books || []); // assuming backend returns { books: [...] }
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    }
    getBooks();
  }, []);

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Books Dashboard
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {!books || books.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    No books found
                  </td>
                </tr>
              ) : (
                books.map((book, index) => (
                  <tr
                    key={book._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{book.title}</td>
                    <td className="px-6 py-4">${book.price}</td>
                    <td className="px-6 py-4">{book.category}</td>
                    <td className="px-6 py-4">
                      <img
                        src={`http://localhost:5000/uploads/${book.image}`} // adjust if backend serves images differently
                        alt={book.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}