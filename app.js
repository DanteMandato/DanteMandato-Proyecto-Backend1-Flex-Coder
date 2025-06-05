import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import cartsRouter from './src/routes/carts.routes.js';
import productsRouter from './src/routes/products.routes.js';
import ProductManager from './src/managers/ProductManager.js';
import viewsRouter from './src/routes/views.routes.js';
/*import mongoose from 'mongoose';*/

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
app.set('views', path.join(_dirname, 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const productManager = new ProductManager('./src/data/products.json');


io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    socket.emit('productList', await productManager.getProducts());

    socket.on('addProduct', async (data) => {
        await productManager.addProduct(data);
        io.emit('productList', await productManager.getProducts());
    });

    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        io.emit('productList', await productManager.getProducts());
    });
});

/*
mongoose.connect("mongodb+srv://dantemandato69:9VAN0UAv7YeHZyJ3@cluster1.dtlu23a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1")
.then(() => {
    console.log("Conectado a la base de datos de MongoDB Atlas");
})
.catch((error) => {
    console.error("Error al conectar a la base de datos", error);
});
*/


httpServer.listen(PORT, () => 
    console.log('Servidor en http://localhost:3000'));
