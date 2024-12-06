import axios from "axios";
import { useEffect, useState, useCallback } from "react";

export const useGetProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const reactAPI = process.env.REACT_APP_API_URL;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${reactAPI}/product`);
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [reactAPI]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, fetchProducts };
};