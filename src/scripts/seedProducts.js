import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../models/Product.model.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const seedProducts = [
    {
        title: 'Shampoo sólido de lavanda',
        description: 'Ideal para cuero cabelludo sensible',
        price: 1500,
        code: 'SHAMP001',
        stock: 20,
        category: 'higiene',
        thumbnails: ['shampoo1.jpg']
    },
    {
        title: 'Acondicionador sólido de coco',
        description: 'Nutre profundamente y deja el cabello suave',
        price: 1700,
        code: 'ACOND001',
        stock: 15,
        category: 'higiene',
        thumbnails: ['acondicionador1.jpg']
    },
    {
        title: 'Desodorante natural',
        description: 'Sin aluminio, con aceites esenciales',
        price: 1200,
        code: 'DEO001',
        stock: 10,
        category: 'cuidado personal',
        thumbnails: ['desodorante.jpg']
    },
    {
        title: 'Agua Micelar',
        description: 'Limpia impurezas y maquillaje.',
        price: 950,
        code: 'AGMI001',
        stock: 15,
        category: 'limpieza',
        thumbnails: ['aguamicelar.jpg']
    },
    {
        title: 'Bálsamo labial',
        description: 'Protección y suavidad para labios.',
        price: 500,
        code: 'BAL001',
        stock: 15,
        category: 'cuidado personal',
        thumbnails: ['balsamolabial.jpg']
    },
    {
        title: 'Serum Facial',
        description: 'Mejora la elasticidad y humecta.',
        price: 1500,
        code: 'SERFAC001',
        stock: 15,
        category: 'cosmetica',
        thumbnails: ['serumfacial.jpg']
    },
    {
        title: 'Tónica Facial',
        description: 'Cierra poros y refresca la piel.',
        price: 900,
        code: 'TONFAC001',
        stock: 15,
        category: 'cosmetica',
        thumbnails: ['tonicafacial.jpg']
    },
    {
        title: 'Gel contorno de ojos',
        description: 'Reduce ojeras y bolsas.',
        price: 1350,
        code: 'GELOJ001',
        stock: 15,
        category: 'cosmetica',
        thumbnails: ['gelcontornoojos.jpg']
    },
    {
        title: 'Gel limpieza facial',
        description: 'Limpieza suave para pieles sensibles.',
        price: 1000,
        code: 'GELFAC001',
        stock: 15,
        category: 'limpieza',
        thumbnails: ['gelfacial.jpg']
    },
    {
        title: 'Aceite corporal',
        description: 'Humecta y suaviza la piel.',
        price: 1250,
        code: 'ACCO001',
        stock: 15,
        category: 'limpieza',
        thumbnails: ['aceitecorporal1.jpg']
    }
];

const insertSeedData = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        await ProductModel.deleteMany({});
        await ProductModel.insertMany(seedProducts);
        console.log('🌱 Productos insertados correctamente');
        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error al insertar productos:', error);
    }
};

insertSeedData();
