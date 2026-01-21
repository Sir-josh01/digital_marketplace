import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./AddProduct.css";

const AddProduct = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    vendor: "",
    description: "",
    image: "",
    category: "Graphics",
    format: "ZIP",
    size: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/add_product.php`, form);
      if (res.data.message) {
        console.log("product added sharp!!");  
      }
      alert("Product Added!");
      // FIXED: Resetting all fields including image
 
      setForm({ title: "", price: "", vendor: "", description: "", image: "", category: "Graphics", format: "ZIP", size: "" });
    } catch (err) {
      alert("Error adding product", err);
    }
  };

  return (
    <div className="admin-container">
      {" "}
      {/* Added the wrapper from your CSS */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>Add New Product</h2>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Vendor"
          value={form.vendor}
          onChange={(e) => setForm({ ...form, vendor: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        {form.image && (
          <div className="preview-box">
            <img
              src={form.image}
              alt="preview"
              style={{ width: "100%", borderRadius: "8px", marginTop: "10px" }}
            />
          </div>
        )}

        <select 
          value={form.category} 
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="admin-input"
        >
          <option value="Graphics">Graphics</option>
          <option value="Templates">Templates</option>
          <option value="Software">Software</option>
          <option value="E-books">E-books</option>
        </select>

        <input 
          type="text" 
          placeholder="Format (e.g. PDF, ZIP, PNG)" 
          value={form.format}
          onChange={(e) => setForm({ ...form, format: e.target.value })} 
        />

        <input 
          type="text" 
          placeholder="Size (e.g. 10MB)" 
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })} 
        />

        <button type="submit">Upload to Marketplace</button>
      </form>
    </div>
  );
};

export default AddProduct;