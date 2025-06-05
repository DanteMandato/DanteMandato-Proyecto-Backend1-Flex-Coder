import { Router } from 'express'
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');


router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        await productManager.addProduct(newProduct);
        res.status(201).json({ message: 'Producto agregado exitosamente' });
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = req.body;
        await productManager.updateProduct(pid, updatedProduct);
        res.status(200).json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        if (error.message === 'Producto no encontrado para actualizar') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await productManager.deleteProduct(pid);
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        if (error.message === 'Producto no encontrado para eliminar') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }
});

export default router;
