import { Router } from 'express';
import ProductDaoMongo from '../dao/ProductDAO.js';

const router = Router();
const productDao = new ProductDaoMongo();

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productDao.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener productos en tiempo real:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/products', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;

        const result = await productDao.getProducts({ limit, page, sort, query });

        res.render('products', {
            ...result,
            query,
            sort
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/purchase-success', (req, res) => {
    res.render('purchase-success');
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await product.getProductById(req.params.pid);

        if (!product) {
            return res.status(404).render('404', { message: 'Producto no encontrado' });
        }

        res.render('productDetail', { product });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});



export default router;
