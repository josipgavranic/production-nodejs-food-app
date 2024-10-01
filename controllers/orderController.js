import Stripe from "stripe";
import { orderModel } from "../models/orderModel.js";
import { productModel } from "../models/productModel.js";
import { getDataUri } from "../utils/Feature.js";
import cloudinary from 'cloudinary';
import { stripe } from "../server.js";

// create order
export const createOrderController = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCost,
            totalAmount
        } = req.body;
        // create order
        const order = new orderModel({
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCost,
            totalAmount,
            user: req.user._id
        });
        // quantity update
        for (let i = 0; i < orderItems.length; i++) {
            const product = await productModel.findById(orderItems[i].product);
            product.quantity -= orderItems[i].quantity;
            // save
            await product.save();
        }
        // save
        await order.save();

        res.status(201).send({
            success: true,
            message: 'Order created successfully',
            order
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Create Order API',
            error
        });
    }
}
// get my orders
export const getMyOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user._id });
        // validation
        if (!orders) {
            return res.status(404).send({
                success: false,
                message: 'No orders found',
            });
        }
        res.status(200).send({
            success: true,
            message: 'My Orders',
            orders
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Orders API',
            error
        });
    }
}
// get order by id
export const getOrderByIdController = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        // validation
        if (!order)
        {
            return res.status(404).send({
                success: false,
                message: 'Order not found',
            });
        }
        res.status(200).send({
            success: true,
            message: 'Order Details',
            order
        });
    }
        catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            return res.status(500).send({
                success: false,
                message: 'Invalid Order ID',
            });
        }
        res.status(500).send({
            success: false,
            message: 'Error in Get Order API',
            error
        });
    }
}
// accept payment
export const paymentController = async (req, res) => {
    try {
        // get amount
        const { totalAmount } = req.body;
        // valdation
        if (!totalAmount) {
            return res.status(404).send({
                success: false,
                message: 'Amount is required',
            });
        }
        const { client_secret } = await stripe.paymentIntents.create({
            amount: Number(totalAmount * 100),
            currency: 'chf'
        })
        res.status(200).send({
            success: true,
            client_secret
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Payment API',
            error
        });
    }
}
// get all orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).send({
            success: true,
            message: 'All Orders',
            totalOrders: orders.length,
            orders
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Orders API',
            error
        });
    }
}
// update order status
export const updateOrderStatusController = async (req, res) => {
    try {
        // find order
        const order = await orderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).send({
                success: false,
                message: 'Order not found',
            });
        }
        if (order.orderStatus === 'Processing')
            order.orderStatus = 'Shipped';
        else if (order.orderStatus === 'Shipped')
        {
            order.orderStatus = 'Delivered';
            order.deliveredAt = Date.now();
        }
        else
        {
            return res.status(500).send({
                success: false,
                message: 'Order already delivered',
            });
        }
        // save
        await order.save();
        res.status(200).send({
            success: true,
            message: 'Order Status Updated'
        });
    }
    catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            return res.status(500).send({
                success: false,
                message: 'Invalid Order ID',
            });
        }
        res.status(500).send({
            success: false,
            message: 'Error in Update Order Status API',
            error
        });
    }
}