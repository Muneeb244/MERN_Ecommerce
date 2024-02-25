import { asyncMiddleware } from "../middlewares/asyncMidleware.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidatesCache } from "../utils/features.js";
//Revalidate on New,Update,Delete product, New Order
export const getLatestProducts = asyncMiddleware(async (req, res, next) => {
    let products = [];
    if (myCache.has("latest-product"))
        products = JSON.parse(myCache.get("latest-product"));
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latest-product", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
//Revalidate on New,Update,Delete product, New Order
export const getAllCategories = asyncMiddleware(async (req, res, next) => {
    let categories = [];
    if (myCache.has("categories"))
        categories = JSON.parse(myCache.get("categories"));
    else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({
        success: true,
        categories,
    });
});
//Revalidate on New,Update,Delete product, New Order
export const getAdminProducts = asyncMiddleware(async (req, res, next) => {
    let products = [];
    if (myCache.has("all-products"))
        products = JSON.parse(myCache.get("all-products"));
    else {
        products = await Product.find({});
        myCache.set("all-products", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
//Revalidate on New,Update,Delete product, New Order
export const getSingleProduct = asyncMiddleware(async (req, res, next) => {
    const id = req.params.id;
    let product;
    if (myCache.has(`product-${id}`))
        product = JSON.parse(myCache.get(`product-${id}`));
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler("product not found", 404));
        myCache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
export const newProduct = asyncMiddleware(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please add photo", 400));
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log("deleted");
        });
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    await invalidatesCache({ product: true });
    return res.status(201).json({
        success: true,
        message: "Product created successfully",
    });
});
export const updateProduct = asyncMiddleware(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Product Not Found", 404));
    if (photo) {
        rm(product.photo, () => {
            console.log("Old Photo Deleted from update");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    await invalidatesCache({ product: true, productId: String(product._id) });
    return res.status(200).json({
        success: true,
        message: "Product Updated Successfully",
    });
});
export const deleteProduct = asyncMiddleware(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("product not found", 404));
    rm(product.photo, () => {
        console.log("Photo deleted");
    });
    await product.deleteOne();
    await invalidatesCache({ product: true, productId: String(product._id) });
    return res.status(200).json({
        success: true,
        message: "product deleted successfully",
    });
});
export const getAllProducts = asyncMiddleware(async (req, res) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price),
        };
    if (category)
        baseQuery.category = category;
    const productsPromise = Product.find(baseQuery)
        .sort(sort ? { price: sort === "asc" ? 1 : -1 } : undefined)
        .limit(limit)
        .skip(skip);
    const [products, filteredOnlyProducts] = await Promise.all([
        productsPromise,
        Product.find(baseQuery),
    ]);
    const totalPage = Math.ceil(filteredOnlyProducts.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPage,
    });
});
