import { categoryModel } from "../models/categoryModel.js";
import { productModel } from "../models/productModel.js";

// create category
export const createCategoryController = async (req, res) => {
    try {
        const { category } = req.body;
        if (!category) 
        {
            return res.status(404).send({
                success: false,
                message: 'Category is required',
            });
        }
        const exist = await categoryModel.findOne({ category });
        if (exist)
        {
            return res.status(404).send({
                success: false,
                message: 'Category already exist',
            });
        }
        // create
        const categoryData = new categoryModel({ category });
        // save
        await categoryData.save();
        res.status(201).send({
            success: true,
            message: 'New Category Created',
            categoryData
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Category API',
            error
        });
    }
}
// update category
export const updateCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        // validation
        if (!category)
        {
            return res.status(404).send({
                success: false,
                message: 'Category Not Found',
            });
        }
        // update
        const { updateCategory } = req.body;
        // finde product in category
        const products =  await productModel.find({ category: category._id });
        // update product category
        for (let i = 0; i < products.length; i++) {
            products[i].category = updateCategory;
            // save
            await products[i].save();
        }

        // update category
        if (updateCategory)
            category.category = updateCategory;

        // save
        await category.save({ category: updateCategory });
        res.status(200).send({
            success: true,
            message: 'Category Updated',
            category
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update Category API',
            error
        });
    }
}
// get all categories
export const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: 'All Categories',
            totalCat: categories.length,
            categories
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Categories API',
            error
        });
    }
}
// delete category
export const deleteCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        // validation
        if (!category)
        {
            return res.status(404).send({
                success: false,
                message: 'Category Not Found',
            });
        }
        // find products in category
        const products = await productModel.find({ category: category._id });
        // update product category
        for (let i = 0; i < products.length; i++) {
            products[i].category = undefined;
            // save
            await products[i].save();
        }

        // delete
        await category.deleteOne();
        res.status(200).send({
            success: true,
            message: 'Category Deleted Successfully'
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
            message: 'Error in Delete Category API',
            error
        });
    }
}