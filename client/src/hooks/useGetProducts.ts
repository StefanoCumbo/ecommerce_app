import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify";
import { useGetToken } from "./useGetToken";
import { IProduct } from "../models/interfaces";
import { IShopContext, ShopContext } from "../context/shop-context";


const apiURL = process.env.REACT_APP_API_URL


export const useGetProducts = ()=>{
    const [products, setProducts] = useState<IProduct[]>([]);
    const {headers} = useGetToken()
    const {isAuthenticated} = useContext<IShopContext>(ShopContext)


    const fetchProducts = async()=>{


        try {
            const fetchedProducts = await axios.get(`${apiURL}/product`, {headers});
            setProducts(fetchedProducts.data.products)
            
        } catch (error) {
            toast.error("ERROR: Something went wrong")

            
        }
    }

    useEffect(()=>{ 
        if(isAuthenticated){
            fetchProducts();


        }


    },[isAuthenticated, fetchProducts])


    return {products};
}