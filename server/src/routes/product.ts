import {Router, Request, Response} from 'express'
import { productModel } from '../models/product'

const router = Router()



router.get("/",  async( _, res: Response): Promise<void> =>{
    try {
        const products = await productModel.find({})
        res.json({products})
         return

        
    } catch (err) {
        res.status(400).json({err})
        
    }
    
})

export {router as productRouter};




