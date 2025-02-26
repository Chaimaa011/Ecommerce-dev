import express from 'express';
import Product from '../models/product.js'; 
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import cloudinary from 'cloudinary';

const router = express.Router();

// إعداد multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// إضافة منتج جديد
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, price, stock, category, subCategory, sizes, date, bestseller } = req.body;
    if (!name || !description || !price || !stock) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate price and stock are positive numbers
    if (price <= 0 || stock < 0) {
      return res.status(400).json({ message: 'Invalid price or stock value' });
    }
    
    // معالجة الصورة باستخدام Promise
    let imageUrl = '';
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      image: imageUrl,
      category,
      subCategory,
      sizes: sizes ? JSON.parse(sizes) : [],
      date,
      bestseller: bestseller === 'true'
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  }
});

// تحديث منتج
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, price, stock, category, subCategory, sizes, date, bestseller } = req.body;
    
    let imageUrl = '';
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock !== undefined ? stock : product.stock;
    product.image = imageUrl || product.image;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
    product.date = date || product.date;
    product.bestseller = bestseller !== undefined ? (bestseller === 'true') : product.bestseller;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
});

// الحصول على جميع المنتجات
// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    console.log('Products found:', products); // للتأكد من البيانات
    res.json(products); // لاحظي أننا كنرجعو products مباشرة، بدون { products }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
});

// الحصول على منتج واحد
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
});

// حذف منتج
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;