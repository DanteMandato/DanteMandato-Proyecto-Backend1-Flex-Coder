import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import cartsRouter from './src/routes/carts.routes.js';
import productsRouter from './src/routes/products.routes.js';
import viewsRouter from './src/routes/views.routes.js';
import mongoose from 'mongoose';
import Product from './src/models/Product.js';

dotenv.config();

const PORT = 3000;
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(_dirname, 'src', 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(_dirname, 'src', 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.use(methodOverride('_method'));

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    const products = await Product.find();
    socket.emit('productList', products);

    socket.on('addProduct', async (data) => {
        const newProduct = new Product(data);
        await newProduct.save();
        const updatedProducts = await Product.find();
        io.emit('productList', updatedProducts);
    });

    socket.on('deleteProduct', async (id) => {
        await Product.findByIdAndDelete(id);
        const updatedProducts = await Product.find();
        io.emit('productList', updatedProducts);
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🚀 Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error al conectar MongoDB:', err));

httpServer.listen(PORT, () =>
    console.log(`Servidor en http://localhost:${PORT}`));
