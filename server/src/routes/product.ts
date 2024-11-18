import {Router, Request, Response} from 'express'
import { productModel } from '../models/product'
import { verifyToken } from './user'
import { UserModel } from '../models/user'
import { ProductErrors, UserErrors } from '../errors'

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




router.post('/checkout', verifyToken,  async(req:Request, res: Response): Promise<void>=>{
    const {customerID, cartItems} = req.body;
    try {

        const user = await UserModel.findById(customerID);

        const productIDs = Object.keys(cartItems)
        const products = await productModel.find({_id:{ $in: productIDs} })
        
        if (!user){
            res.status(400).json({type: UserErrors.NO_USER_FOUND})
            return
        }

        if(products.length !== productIDs.length){
            res.status(400).json({type: ProductErrors.NO_PRODUCT_FOUND})
            return
        }

        let totalPrice = 0;
        for (const i in cartItems){
            const product = products.find((product)=> String(product.id) === i)
            if(!product){
                res.status(400).json({type: ProductErrors.NO_PRODUCT_FOUND})
                return
            }

            if(product.stockQuantity < cartItems[i]){
                res.status(400).json({type: ProductErrors.NOT_ENOUGH_STOCK});
                return
            }

            

            totalPrice += product.price * cartItems[i]

        }
        if (user.availableMoney < totalPrice){
            res.status(400).json({type: ProductErrors.NO_AVAILABLE_MONEY});
            return
        }
        
        user.availableMoney -= totalPrice
        user.purchasedItems.push(...productIDs)

        await user.save()

        await productModel.updateMany(
            {_id: {$in: productIDs}},
            { $inc: {stockQuantity: -1}}
            
        );
        res.json({purchasedItems: user.purchasedItems});
        
        

    } catch (err) {
        res.status(400).json(err);
        return
        
    }
})



router.get("/purchased-items/:customerID",verifyToken, async(req:Request, res:Response)=>{
    const {customerID} = req.params;
    try {

      const user = await UserModel.findById(customerID)
      if(!user){
        res.status(400).json({type: UserErrors.NO_USER_FOUND})
      } 
      const products = await productModel.find({_id: {$in: user.purchasedItems}})
     res.json({purchasedItems: products})
    } catch (err) {
        res.status(500).json({err})
    }
})

export {router as productRouter};




