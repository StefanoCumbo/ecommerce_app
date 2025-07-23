import { Link } from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faShoppingCart} from '@fortawesome/free-solid-svg-icons'
import { useContext } from "react";
import { IShopContext, ShopContext } from "../context/shop-context";
import "./styles.css";


export const Navbar = () => {

    const {availableMoney, isAuthenticated,setIsAuthenticated} = useContext<IShopContext>(ShopContext)



    const logout = ()=>{
        
        setIsAuthenticated(false)

    }

    return ( 
        <div className="navbar">
            <div className="navbarTitle">
                <h1> Stef Tech Shop</h1>

            </div>

            <div className="navbar-links">
                {isAuthenticated && (
                <>
                    <Link to="/"> Shop</Link>
                    <Link to="/purchased-items"> Purchases</Link>
                    <Link to="/checkout"> <FontAwesomeIcon icon={faShoppingCart}/></Link>
                    <Link to="/auth"></Link>
                    <Link to="/register" onClick={logout}>Logout</Link>
                    <span> ${availableMoney.toFixed(2)}</span>

                </>
                )}


                

            </div>

        </div>
     );
}
 
