import { createContext, useEffect, useState } from "react"
import { useGetProducts } from "../hooks/useGetProducts";
import { IProduct } from "../models/interfaces";
import axios from "axios";
import { useGetToken } from "../hooks/useGetToken";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

export interface IShopContext{
    addToCart: (itemId: string) => void;
    removeFromCart: (itemId: string) => void;
    updateCartItemCount: (newAmount: number,itemId: string) => void
    getCartItemCount: (itemId: string) => number;
    getTotalCartAmount: () => number;
    checkout: ()=> void;
    availableMoney: number;
    purchasedItems: IProduct[];
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean)=> void

}
const defaultVal: IShopContext = {
    addToCart: ()=> null,
    removeFromCart: ()=> null,
    updateCartItemCount: ()=> null,
    getCartItemCount: ()=> 0,
    getTotalCartAmount: ()=> 0,
    checkout: ()=> null,
    availableMoney: 0 ,
    purchasedItems: [],
    isAuthenticated: false,
    setIsAuthenticated: ()=> null

}

export const ShopContext = createContext<IShopContext>(defaultVal)


export const ShopContextProvider = (props)=>{

    const [cartItems, setCartItems] = useState<{string: number} | {}>({})
    const [availableMoney, setAvailableMoney] = useState<number>(0);
    const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([])
    const [cookies, setCookies] = useCookies(["access_token"])
    const [isAuthenticated, setIsAuthenticated]= useState<boolean>(cookies.access_token != null)


    const navigate = useNavigate();
    const {products, fetchProducts} = useGetProducts();
    const {headers} = useGetToken();




    const fetchAvailableMoney = async()=>{
        try {
            const result = await axios.get(`http://localhost:3001/user/available-money/${localStorage.getItem("userID")}`, 
            {headers}
        )
        setAvailableMoney(result.data.availableMoney)
            
        } catch (err) {
            toast.error("ERROR:  Something went wrong")
            
        }
    }
    const fetchPurchasedItems = async()=>{
        try {
            const result = await axios.get(`http://localhost:3001/product/purchased-items/${localStorage.getItem("userID")}`, 
            {headers}
        )
        setPurchasedItems(result.data.purchasedItems)
            
        } catch (err) {
            toast.error("ERROR:  Something went wrong")
            
        }
    }

    const getCartItemCount = (itemId: string): number=>{
        if(itemId in cartItems){
            return cartItems[itemId]
        }

        return 0
    }

    const addToCart = (itemId: string)=>{
        if(!cartItems[itemId]){
            setCartItems((prev)=> ({...prev, [itemId]: 1 }))
        }
        else{
            setCartItems((prev)=> ({...prev, [itemId]: prev[itemId] + 1}))
        }

    } 
//////////////////////////////////////Explaination of addToCart Function///////////////////////////////////////////////////////////// 
//                                                                                                                                 //
//     If cartItems[itemId] is undefined (meaning the item doesn't exist in the cart),                                             //
//      setCartItems updates the state, using the previous state prev.                                                             //
//      ...prev spreads the previous state into a new object, ensuring that all existing items in the cart are preserved.          //
//     [itemId]: 1 adds the new item to the cart with a quantity of 1.
//
//     If cartItems[itemId] is defined (the item already exists in the cart), this block executes.
//     Again, setCartItems uses the prev state.
//     { ...prev, [itemId]: prev[itemId] + 1 } creates a new state object:
//
//      ...prev copies all the existing items.
//
//      [itemId]: prev[itemId] + 1 updates the quantity of the specified item by incrementing it by 1.                                                        //
//                                                                                                                                 //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   





const removeFromCart = (itemId: string)=>{
    if (!cartItems[itemId] ) return;
    if(cartItems[itemId] === 0 ) return;
    if(cartItems[itemId]){
        setCartItems((prev)=> ({...prev, [itemId]: prev[itemId] -1}))
    }

}


    

    const updateCartItemCount = (newAmount: number, itemId: string)=>{
        if(newAmount < 0 ) return ; 
        setCartItems((prev)=> ({...prev, [itemId]: newAmount}))
    };

    const getTotalCartAmount = (): number =>{

        let totalAmount = 0;
        for (const item in cartItems){
            let itemInfo: IProduct = products.find((product)=> product._id === item)
            
            totalAmount += cartItems[item] * itemInfo.price

            
        }
        return totalAmount;
    }


    const checkout = async()=>{
        const body = {customerID: localStorage.getItem("userID"), cartItems}
        try {
            await axios.post("http://localhost:3001/product/checkout", body, {
                headers,
            });
            setCartItems({})
            fetchProducts();
            fetchAvailableMoney();
            fetchPurchasedItems();
            navigate("/")
            
        } catch (err) {
            toast.error("ERROR: Could not process payment...not enough funds")
        }
    }

    useEffect(()=>{
        if(isAuthenticated){
            fetchAvailableMoney();
            fetchPurchasedItems();

        }
        

    },[isAuthenticated]);

    useEffect(()=>{
        if(!isAuthenticated){
            localStorage.clear();
            setCookies("access_token", null)
        }


    }, [isAuthenticated])


    const contextValue: IShopContext = {
        addToCart,
        removeFromCart,
        updateCartItemCount,
        getCartItemCount,
        getTotalCartAmount,
        checkout,
        availableMoney,
        purchasedItems,
        isAuthenticated,
        setIsAuthenticated
    };

    return (
    <ShopContext.Provider value={contextValue}>
        {props.children}
    </ShopContext.Provider>
    )
}