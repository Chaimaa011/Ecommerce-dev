import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
  },
  image: {
    type: [String], // Pour stocker plusieurs images
    default: ['https://via.placeholder.com/500'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
  },
  subCategory: {
    type: String,
    required: [true, 'Product subcategory is required'],
  },
  sizes: {
    type: [String], // Tableau des tailles disponibles
    required: [true, 'Product sizes are required'],
  },
  date: {
    type: Number, // Pour le timestamp
    required: [true, 'Product date is required'],
  },
  bestseller: {
    type: Boolean, // Pour indiquer si c'est un bestseller
    default: false,
  },
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
