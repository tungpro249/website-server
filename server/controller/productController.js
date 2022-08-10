const Product = require ("../model/productModel");

const productController = {
  getProduct: async (req, res) => {},
  createProduct: async (req, res) => {
    try {
      const { product_id, category_id, title, price, description, images, quantity } = req.body;
      if (!images) return res.status(400).json({ msg: "Không có ảnh được load." });

      const product = Product.findOne({ product_id });
      if (product) {
        return res.status(400).json({ msg: "Sản phẩm đã tồn tại" });
      }
      const newProduct = new Products({
        product_id,
        category_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        quantity,
      });

      await newProduct.save();
      res.json({ msg: "Đã thêm một sản phẩm." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, res) => {},
  deleteProduct: async (req, res) => {},
};

module.exports = productController;
