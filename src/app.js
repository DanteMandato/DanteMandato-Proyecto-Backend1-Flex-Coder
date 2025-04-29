import express from 'express';
import producstRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use ('/api/products', producstRouter);
app.use ('/api/carts', cartsRouter);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
}   );
