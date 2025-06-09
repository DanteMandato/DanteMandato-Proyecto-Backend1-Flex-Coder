# 🛒 Proyecto Backend - E-commerce de Cosmética Natural

Este es un proyecto backend desarrollado con **Node.js**, **Express**, **MongoDB** y **Handlebars**, que simula una tienda online de cosmética natural. Permite gestionar productos, carritos de compra, compras y usuarios, con funcionalidades completas y persistencia en base de datos.

## 🚀 Características principales

- CRUD completo de productos con filtros, paginación y ordenamiento.
- Sistema de carritos de compra.
- Visualización de productos y carrito en vistas con Handlebars.
- Finalización de compra con SweetAlert y selección de método de pago.
- Arquitectura profesional con DAOs, rutas, controladores y modelos.
- Uso de MongoDB como base de datos con Mongoose.

---

## 📂 Estructura del proyecto

📦 src
┣ 📂 controllers
┣ 📂 dao
┣ 📂 models
┣ 📂 routes
┣ 📂 views
┣ 📂 utils
┣ 📄 app.js
┗ 📄 .env

---

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo

2. Instalar dependencias:
npm install

3. Crear un archivo .env en la raíz con la siguiente información:
PORT=8080
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/ecommerce

4. Iniciar el servidor:
npm start

🧪 Rutas principales
🔹 Productos
. GET /api/products: Listado de productos con filtros, orden, paginación.

. POST /api/products: Agregar nuevo producto.

. PUT /api/products/:pid: Editar producto.

. DELETE /api/products/:pid: Eliminar producto.

🔹 Carritos
. POST /api/carts: Crear carrito.

. GET /api/carts/:cid: Ver carrito por ID.

. POST /api/carts/:cid/products/:pid: Agregar producto al carrito.

. DELETE /api/carts/:cid/products/:pid: Eliminar producto del carrito.

. DELETE /api/carts/:cid: Vaciar carrito.

. POST /api/carts/purchase/:cid: Finalizar compra.

👀 Vista de usuario
Vistas con Handlebars:
. /products: Vista de catálogo de productos.

. /carts/:cid: Vista del carrito con opción de eliminar, vaciar o finalizar compra.

. Uso de SweetAlert para mejorar la experiencia de compra.

🧠 Tecnologías utilizadas
. Node.js

. Express.js

. MongoDB + Mongoose

. Handlebars

. SweetAlert2

. dotenv

. method-override

. nodemon (entorno de desarrollo)

🙌 Autor

< Dante Mandato >