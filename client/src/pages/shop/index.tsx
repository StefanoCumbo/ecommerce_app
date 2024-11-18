import { useContext } from "react";
import { useGetProducts } from "../../hooks/useGetProducts";
import { Product } from "./product";
import "./styles.css"
import { IShopContext, ShopContext } from "../../context/shop-context";
import { Navigate } from "react-router-dom";
export const ShopPage = () => {

    const {isAuthenticated} = useContext<IShopContext>(ShopContext) 
    const {products} = useGetProducts();


    if(!isAuthenticated){
        return <Navigate to="/auth"/>
    }

    return ( 
        <div className="shop">
            <div className="products">
                {products.map((product)=>(
                     <Product  product={product} />
                ))}

            </div>
            
        </div>
     );
}
 
