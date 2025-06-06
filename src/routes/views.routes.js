import { Router } from 'express';
import ProductDaoMongo from '../DAO/productDAO.js';

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

export default router;
