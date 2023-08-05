// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [editProductId, setEditProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProductId) {
        await axios.put(`/api/products/${editProductId}`, formData);
        setEditProductId(null);
      } else {
        await axios.post('/api/products', formData);
      }
      setFormData({ name: '', description: '', price: '' });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
    });
    setEditProductId(product._id);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', description: '', price: '' });
    setEditProductId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <div>
      <h1>Product List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          placeholder="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editProductId ? 'Update Product' : 'Add Product'}
        </button>
        {editProductId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <div className='list'>
            <h3>Name<span> {product.name}</span></h3>
            <h3>Description<span> {product.description}</span></h3>
            <h3>Price<span> ${product.price}</span></h3>
            </div>
            <div className='buttons'>
            <button onClick={() => handleEdit(product)}>Update</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default App;
