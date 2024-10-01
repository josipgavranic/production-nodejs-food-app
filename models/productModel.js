import mongoose from 'mongoose';

// review model
const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    rating: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user is required']
    },
    comment: {
        type: String
    }
}, { timestamps: true });

// product model
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    description: {
        type: String,
        required: [true, 'description is required'],
    },
    price: {
        type: Number,
        required: [true, 'price is required'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    quantity: {
        type: Number,
        required: [true, 'quantity is required'],
    },
    images: [
        {
            public_id: String,
            url: String,
        }
    ],
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });


export const productModel = mongoose.model('Products', productSchema);
export default productModel;