import { createContext, useCallback, useEffect, useState } from "react"
import { useGetProducts } from "../hooks/useGetProducts";
import { IProduct } from "../models/interfaces";
import axios from "axios";
import { useGetToken } from "../hooks/useGetToken";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { ProductErrors } from "../models/errors";

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

const reactAPI = process.env.REACT_APP_API_URL


export const ShopContextProvider = (props)=>{

    const [cartItems, setCartItems] = useState<{string: number} | {}>({})
    const [availableMoney, setAvailableMoney] = useState<number>(0);
    const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([])
    const [cookies, setCookies] = useCookies(["access_token"])
    const [isAuthenticated, setIsAuthenticated]= useState<boolean>(cookies.access_token != null)


    const navigate = useNavigate();
    const {products, fetchProducts} = useGetProducts();
    const {headers} = useGetToken();




    const fetchAvailableMoney = useCallback( async()=>{
        try {
            const result = await axios.get(`${reactAPI}/user/available-money/${localStorage.getItem("userID")}`, 
            {headers}
        )
        setAvailableMoney(result.data.availableMoney)
            
        } catch (err) {
            toast.error("ERROR:  Something went wrong")
            
        }
    } ,[headers,setAvailableMoney])



    const fetchPurchasedItems = useCallback(async()=>{
        try {
            const result = await axios.get(`${reactAPI}/product/purchased-items/${localStorage.getItem("userID")}`, 
            {headers}
        )
        setPurchasedItems(result.data.purchasedItems)
            
        } catch (err) {
            toast.error("ERROR:  Something went wrong")
            
        }
    }, [headers,setPurchasedItems])

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


    const checkout = async () => {
        const body = { customerID: localStorage.getItem("userID"), cartItems };
        try {
          const res = await axios.post(`${reactAPI}/product/checkout`, body, { headers });
          setCartItems({});
          setPurchasedItems(res.data.purchasedItems);
          fetchAvailableMoney();
          fetchProducts();
          fetchPurchasedItems();
          navigate("/");
        } catch (err) {
          let errorMessage = "";
          switch (err.response?.data?.type) {
            case ProductErrors.NO_PRODUCT_FOUND:
              errorMessage = "No product found";
              break;
            case ProductErrors.NO_AVAILABLE_MONEY:
              errorMessage = "Not enough money";
              break;
            case ProductErrors.NOT_ENOUGH_STOCK:
              errorMessage = "Not enough stock";
              break;
            default:
              errorMessage = "Something went wrong";
          }
          toast.error("ERROR: " + errorMessage);
        }
      };

    useEffect(()=>{
        if(isAuthenticated){
            fetchAvailableMoney();
            fetchPurchasedItems();

        }
        

    },[isAuthenticated, fetchAvailableMoney, fetchPurchasedItems]);

    useEffect(()=>{
        if(!isAuthenticated){
            localStorage.clear();
            setCookies("access_token", null)
        }


    }, [isAuthenticated, setCookies])


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