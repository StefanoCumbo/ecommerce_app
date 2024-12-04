"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true, min: [1, 'Price of product should be above 1'] },
    description: { type: String, required: true },
    imageURL: { type: String, required: true },
    stockQuantity: { type: Number, required: true, min: [0, 'stock cant be below 0'] }
});
exports.productModel = (0, mongoose_1.model)("product", productSchema);
