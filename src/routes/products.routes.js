import { Router } from 'express';
import ProductModel from '../models/Product.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const {
            limit = 10,
            page = 1,
            sort,
            category,
            stock
        } = req.query;

        const query = {};
        if (category) query.category = category;
        if (stock === 'true') query.stock = { $gt: 0 };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined
        };

        const result = await ProductModel.paginate(query, options);

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            currentPage: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await ProductModel.create(req.body);
        res.status(201).json({ status: 'success', product: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updated = await ProductModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', product: updated });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const deleted = await ProductModel.findByIdAndDelete(req.params.pid);
        if (!deleted) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
