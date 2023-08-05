const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const Port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose
  .connect("mongodb://localhost:27017/productApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch((err) => {
    console.error("Error", err.message);
  });

  const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
  });
  
  const Product = mongoose.model('Product', productSchema);

  
  app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
  });
  
  app.post('/api/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  });
  
  app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  });
  
  app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  });
  

app.listen(Port, () => {
  console.log(`app running on port ${Port}`);
});
