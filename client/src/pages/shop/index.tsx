import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import { Product } from "./product";

import "./styles.css";
import { useGetProducts } from "../../hooks/useGetProducts";

export const ShopPage = () => {
  const [cookies, ] = useCookies(["access_token"]);

  const { products, loading } = useGetProducts();

  if (!cookies.access_token) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="shop">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="products">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};