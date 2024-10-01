import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, 'address is required'],
        },
        city: {
            type: String,
            required: [true, 'city is required'],
        },
        country: {
            type: String,
            required: [true, 'country is required'],
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, 'name is required'],
            },
            price: {
                type: Number,
                required: [true, 'price is required'],
            },
            // quantity: {
            //     type: Number,
            //     required: [true, 'quantity is required'],
            // },
            image: {
                type: String,
                required: [true, 'image is required'],
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'product is required'],
            }
        }
    ],
    paymentMethod: {
        type: String,
        enum: ['COD', 'Online'],
        default: 'COD',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user is required'],
    },
    paidAt: Date,
    paymentInfo: {
        id: String,
        status: String,
    },
    itemPrice: {
        type: Number,
        required: [true, 'item price is required'],
    },
    tax: {
        type: Number,
        required: [true, 'tax is required'],
    },
    shippingCost: {
        type: Number,
        required: [true, 'shipping cost is required'],
    },
    totalAmount: {
        type: Number,
        required: [true, 'total amount is required'],
    },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered'],
        default: 'Processing',
    },
    deliveredAt: Date,
}, { timestamps: true });

export const orderModel = mongoose.model('Order', orderSchema);
export default orderModel;