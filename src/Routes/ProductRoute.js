import express from 'express'
const router = express.Router()
import Product from '../Models/Product.js'
// get
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
// post 
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json({ message: "Product added successfully", product });

    }
    catch (err) {
        console.error("Error while saving product:", err);
        res.status(500).json({ error: err.message });

    }
})
// PUT update product
router.put("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Product updated successfully", product });
    } catch (err) {
        res.status(500).json({ error: "Failed to update product" });
    }
});

// DELETE product
router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete product" });
    }
});
// find single product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export default router