import { useContext } from "react";
import {IProduct} from "../../models/interfaces"
import { IShopContext, ShopContext } from "../../context/shop-context";

interface Props{
    product: IProduct;
}



export const Product = ({product}: Props) => {
    const {_id, productName,description,price,stockQuantity,imageURL} = product;


    const {addToCart, getCartItemCount} = useContext<IShopContext>(ShopContext)


    const count = getCartItemCount(_id)
    console.log(count);
    


    return ( 
        <div className="product">
            <img src={imageURL}/>
            <div className="description">
                <h3>{productName}</h3>
                <p> {description}</p>
                <p>${price}</p>

            </div>

            {stockQuantity === 0 ? (
                <div className="stock-quantity">
                {stockQuantity === 0 && <h1> OUT OF STOCK!</h1>}

                 </div> 
            ):
            (
                <button className="addToCartBtn" onClick={()=> addToCart(_id)}> 
                Add To Cart {count > 0 && <> ({count})</>}
                </button>

            )}
           

           

            
        </div>
     );
}
 
