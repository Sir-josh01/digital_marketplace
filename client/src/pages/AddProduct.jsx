import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import './AddProduct.css';

const AddProduct = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    vendor: "",
    description: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/add_product.php`, form);
      alert("Product Added with ID: " + res.data.id);
      setForm({ title: "", price: "", vendor: "", description: "" }); // Clear form
    } catch (err) {
      alert("Error adding product", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px", color: "white" }}>
      <h2>Add New Product</h2>
      <input
        type="text"
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Price"
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Vendor"
        onChange={(e) => setForm({ ...form, vendor: e.target.value })}
      />
      <textarea
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="text"
        placeholder="Image URL (e.g. https://...)"
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />
      {form.image && <img src={form.image} alt="preview" style={{width: '100px', borderRadius: '8px'}} />}
      <button type="submit">Upload to Marketplace</button>
    </form>
  );
};
// https://unsplash.com/photos/a-sea-lion-rests-on-rocks-near-the-water-2DU2aKncj8w

export default AddProduct;
