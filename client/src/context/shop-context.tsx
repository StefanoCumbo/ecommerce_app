import { createContext, useEffect, useState, useCallback } from "react";
import { useGetProducts } from "../hooks/useGetProducts";
import { IProduct } from "../models/interfaces";
import axios from "axios";
import { useGetToken } from "../hooks/useGetToken";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

const apiURL = process.env.REACT_APP_API_URL;

export interface IShopContext {
    addToCart: (itemId: string) => void;
    removeFromCart: (itemId: string) => void;
    updateCartItemCount: (newAmount: number, itemId: string) => void;
    getCartItemCount: (itemId: string) => number;
    getTotalCartAmount: () => number;
    checkout: () => void;
    availableMoney: number;
    purchasedItems: IProduct[];
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const defaultVal: IShopContext = {
    addToCart: () => null,
    removeFromCart: () => null,
    updateCartItemCount: () => null,
    getCartItemCount: () => 0,
    getTotalCartAmount: () => 0,
    checkout: () => null,
    availableMoney: 0,
    purchasedItems: [],
    isAuthenticated: false,
    setIsAuthenticated: () => null,
};

export const ShopContext = createContext<IShopContext>(defaultVal);

export const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
    const [availableMoney, setAvailableMoney] = useState<number>(0);
    const { products } = useGetProducts();
    const { headers } = useGetToken();
    const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([]);
    const [cookies, setCookies] = useCookies(["access_token"]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(cookies.access_token != null);

    const navigate = useNavigate();

    const fetchAvailableMoney = useCallback(async () => {
        try {
            const result = await axios.get(`${apiURL}/user/available-money/${localStorage.getItem("userID")}`, { headers });
            setAvailableMoney(result.data.availableMoney);
        } catch (err) {
            toast.error("ERROR: Something went wrong");
        }
    }, [headers]);

    const fetchPurchasedItems = useCallback(async () => {
        try {
            const result = await axios.get(`${apiURL}/product/purchased-items/${localStorage.getItem("userID")}`, { headers });
            setPurchasedItems(result?.data?.purchasedItems);
        } catch (err) {
            toast.error("ERROR: Something went wrong");
        }
    }, [headers]);

    const getCartItemCount = (itemId: string): number => {
        return cartItems[itemId] || 0;
    };

    const addToCart = (itemId: string) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));
    };

    const removeFromCart = (itemId: string) => {
        if (!cartItems[itemId]) return;
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1,
        }));
    };

    const updateCartItemCount = (newAmount: number, itemId: string) => {
        if (newAmount < 0) return;
        setCartItems((prev) => ({
            ...prev,
            [itemId]: newAmount,
        }));
    };

    const getTotalCartAmount = (): number => {
        return Object.keys(cartItems).reduce((total, itemId) => {
            const itemInfo = products.find((product) => product._id === itemId);
            return total + (cartItems[itemId] * (itemInfo?.price || 0));
        }, 0);
    };

    const checkout = async () => {
        const body = { customerID: localStorage.getItem("userID"), cartItems };
        try {
            await axios.post(`${apiURL}/product/checkout`, body, { headers });
            setCartItems({});
            fetchAvailableMoney();
            fetchPurchasedItems();
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAvailableMoney();
            fetchPurchasedItems();
        }
    }, [isAuthenticated, fetchAvailableMoney, fetchPurchasedItems]);

    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.clear();
            setCookies("access_token", null);
        }
    }, [isAuthenticated, setCookies]);

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
        setIsAuthenticated,
    };

    return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};