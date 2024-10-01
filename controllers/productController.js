import { productModel } from "../models/productModel.js";
import { getDataUri } from "../utils/Feature.js";
import cloudinary from 'cloudinary';

// get all products
export const getAllProductsController = async (req, res) => {
    const { keyword, category } = req.query;
    try {
        const products = await productModel.find({
            name: {
                $regex: keyword ? keyword : '',
                $options: 'i'
            },
            //category: category ? category : undefined,
        })
        .populate('category');
        res.status(200).send({
            success: true,
            message: 'All Products',
            totalProducts: products.length,
            products
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Products API',
            error
        });
    }
}
// get top products
export const getTopProductsController = async (req, res) => {
    try {
        const products = await productModel.find({})
        .sort({
            rating: -1
        })
        .limit(3);
        res.status(200).send({
            success: true,
            message: 'Top Products',
            products
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Top Products API',
            error
        });
    }
}
// get product by id
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) 
        {
            res.status(404).send({
                success: false,
                message: 'Product Not Found',
            });
        }
        res.status(200).send({
            success: true,
            message: 'Single Product',
            product
        })
    }
    catch (error) {
        console.log(error);
        if (error.name === "CastError") 
        {
            res.status(500).send({
                success: false,
                message: 'Invalid ID',
            });
        }
        res.status(500).send({
            success: false,
            message: 'Error in Get Single Product API',
            error
        });
    }
}
// create product
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, quantity } = req.body;
        // validation
        if (!name || !description || !price || !quantity)
        {
            return res.status(500).send({
                success: false,
                message: 'Please fill all the fields',
            });            
        }
        // image check
        if (!req.file)
        {
            return res.status(500).send({
                success: false,
                message: 'Please select an image',
            });
        }
        const file = getDataUri(req.file);
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        await productModel.create({
            name, description, price, quantity, images:[image]
        });
        res.status(201).send({
            success: true,
            message: 'Product Created Successfully',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Create Product API',
            error
        });
    }
}
// update product
export const updateProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        // validation
        if (!product)
        {
            return res.status(404).send({
                success: false,
                message: 'Product Not Found',
            });
        }
        const { name, description, price, quantity, category } = req.body;
        // validation and update
        if (name)
            product.name = name;
        if (description)
            product.description = description;
        if (price)
            product.price = price;
        if (quantity)
            product.quantity = quantity;
        if (category)
            product.category = category;

        // save
        await product.save();
        
        res.status(200).send({
            success: true,
            message: 'Product Updated Successfully',
            product
        });
    }
    catch (error) {
        console.log(error);
        if (error.name === "CastError") 
        {
            res.status(500).send({
                success: false,
                message: 'Invalid ID',
            });
        }
        res.status(500).send({
            success: false,
            message: 'Error in Update Product API',
            error
        });
    }
}
// update product image
export const updateProductImageController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        // validation
        if (!product)
        {
            return res.status(404).send({
                success: false,
                message: 'Product Not Found',
            });
        }
        // image check
        if (!req.file)
        {
            return res.status(404).send({
                success: false,
                message: 'Please select an image',
            });
        }
        
        const file = getDataUri(req.file);
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        // update
        product.images.push(image);
        // save
        await product.save();
        res.status(200).send({
            success: true,
            message: 'Product Image Updated Successfully',
            product
        });
    }
    catch (error) {
        console.log(error);
        if (error.name === "CastError")
        {
            res.status(500).send({
                success: false,
                message: 'Invalid ID',
            });
        }
        res.status(500).send({
            success: false,
            message: 'Error in Update Product Image API',
            error
        });
    }
}
// delete product image
export const deleteProductImageController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        // validation
        if (!product)
        {
            return res.status(404).send({
                success: false,
                message: 'Product Not Found',
            });
        }

        // image check
        const id = req.query.id;
        if (!id)
        {
            return res.status(404).send({
                success: false,
                message: 'Product Image Not Found',
            });
        }

        let exist = -1;
        product.images.forEach((image, index) => {
            if (image.public_id === id)
            {
                exist = index;
            }
        });

        if (exist < 0)
        {
            return res.status(404).send({
                success: false,
                message: 'Product Image Not Found',
            });
        }

        // delete
        await cloudinary.v2.uploader.destroy(product.images[exist].public_id);
        product.images.splice(exist, 1);

        // save
        await product.save();

        res.status(200).send({
            success: true,
            message: 'Product Image Deleted Successfully'
        });
    }
    catch (error) {
        console.log(error);
        if (error.name === "CastError")
        {
            res.status(500).send({
                success: false,
                message: 'Invalid ID',
            });
        }
        res.status(500).send({
            success: false,
            message: 'Error in Delete Product Image API',
            error
        });
    }
}
// delete product
export const deleteProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        // validation
        if (!product)
        {
            return res.status(404).send({
                success: false,
                message: 'Product Not Found',
            });
        }

        // delete images
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }
        // delete
        await product.deleteOne();

        res.status(200).send({
            success: true,
            message: 'Product Deleted Successfully'
        });
    }
    catch (error) {
        console.log(error);
        if (error.name === "CastError")
        {
            res.status(500).send({
                success: false,
                message: 'Invalid ID',
            });
        }
        res.status(500).send({
            success: false,
            message: 'Error in Delete Product API',
            error
        });
    }
}
// review product
export const createProductReviewController = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        // find product
        const product = await productModel.findById(req.params.id);
        // validation
        if (!product)
        {
            return res.status(404).send({
                success: false,
                message: 'Product Not Found',
            });
        }
        // check previous reviews
        const isReviewed = product.reviews.find((review) => 
            review.user === req.user._id
        );
        // validation
        if (isReviewed)
        {
            return res.status(404).send({
                success: false,
                message: 'Product Already Reviewed',
            });
        }
        // create review
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }
        // push review
        product.reviews.push(review);
        // update number of reviews
        product.numOfReviews = product.reviews.length;
        product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        // save
        await product.save();
        res.status(200).send({
            success: true,
            message: 'Review Added Successfully'
        });
    }
    catch (error) {
        console.log(error);
        if (error.name === "CastError")
        {
            res.status(500).send({
                success: false,
                message: 'Invalid ID',
            });
        }
        res.status(500).send({
            success: false,
            message: 'Error in Review Product API',
            error
        });
    }
}