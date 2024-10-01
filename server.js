import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import colors from 'colors';
import dotenv from 'dotenv';
import run from './config/db.js';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import Stripe from 'stripe';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

// dotenv config
dotenv.config();

// database connection
run();

// stripe config
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

// cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// rest object
const app = express();

// middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// import routes
import testRoutes from './routes/testRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// routes
app.use('/api/v1', testRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/order', orderRoutes);

app.get('/', (req, res) => {
    return res.status(200).send('<h1>welcome to node server</h1>');
})

// port
const PORT = process.env.PORT || 3000;

// listen
app.listen(PORT, '192.168.178.40', () => {
    console.log(`server is running on port ${ PORT } on ${ process.env.NODE_ENV } mode`);
})