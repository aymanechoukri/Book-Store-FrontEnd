import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddBooks() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null); // 👈 PDF
  const [preview, setPreview] = useState("");
  const Go = useNavigate();

  // handle text inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // handle image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // handle PDF
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    setPdf(file);
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image!");
      return;
    }

    if (!pdf) {
      alert("Please select a PDF!");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("price", form.price);
    data.append("description", form.description);
    data.append("category", form.category);
    data.append("image", image);
    data.append("pdf", pdf); // 👈 مهم

    try {
      const res = await axios.post("http://localhost:5000/api/books", data, {
        withCredentials: true, // 👈 مهم إذا عندك auth
      });

      console.log(res.data);
      alert("Book added successfully!");

      setForm({ title: "", price: "", description: "", category: "" });
      setImage(null);
      setPdf(null);
      setPreview("");
      Go("/dashboard/books");

    } catch (err) {
      console.error(err);
      alert("Error adding book: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl sm:text-3xl bungee-regular text-[#2563EB] mb-6">
        Add Book
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-40 object-cover rounded"
          />
        )}

        {/* PDF */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfChange}
          className="w-full"
        />

        {pdf && (
          <p className="text-sm text-gray-600">
            Selected PDF: {pdf.name}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Add Book
        </button>
      </form>
    </div>
  );
}