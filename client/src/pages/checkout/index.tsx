import { useContext } from "react";
import { useGetProducts } from "../../hooks/useGetProducts";
import { IProduct } from "../../models/interfaces";
import { IShopContext, ShopContext } from "../../context/shop-context";
import { CartItem } from "./cart-item";
import { useNavigate } from "react-router-dom";

import "./styles.css" ;

export const CheckoutPage = () => {
    const navigate = useNavigate()
    const {products} = useGetProducts();

    const {getCartItemCount, getTotalCartAmount, checkout} = useContext<IShopContext>(ShopContext)
    const totalAmount = getTotalCartAmount();
    return ( 
        <div className="cart">
            <div>
                <h1>
                    Your cart Items
                </h1>
            </div>
            <div className="cart">
                
                {products.map((product: IProduct )=>{
                    if (getCartItemCount(product._id) !== 0 ){
                        return <CartItem product={product}/>

                    }
                    return null ;
                })}
            </div> 
            {totalAmount > 0 ? (
            <div className="checkout">
                <p>Subtotal: ${totalAmount}</p>
                <button onClick={()=> navigate("/")}> Continue Shopping</button>
                <button onClick={checkout}> Checkout</button>
            </div>
            ) : (<h1> No items in cart!</h1>)}


        </div>
     );
}
 
