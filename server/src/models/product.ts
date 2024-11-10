import {Schema, model} from 'mongoose'



export interface IProduct{
    productName: string;
    price: number;
    description: string;
    imageURL: string;
    stockQuantity: number;
}


const productSchema = new Schema<IProduct>({
    productName: {type: String, required: true},
    price: {type: Number, required: true, min: [1, 'Price of product should be above 1']},
    description: {type: String, required: true},
    imageURL: {type: String, required: true},
    stockQuantity: {type: Number, required: true, min: [0, 'stock cant be below 0']}
})


export const productModel = model<IProduct>("product", productSchema);