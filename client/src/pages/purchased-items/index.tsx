import { useContext } from "react";
import { IShopContext, ShopContext } from "../../context/shop-context";
import { useGetProducts } from "../../hooks/useGetProducts";

import "./styles.css";

export const PurchasedItemsPage = () => {
  const { purchasedItems, addToCart, getCartItemCount } = useContext<IShopContext>(ShopContext);
  const { loading } = useGetProducts();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="purchased-items-page">
      <h1>Previously Purchased</h1>
      <div className="purchased-items">
        {purchasedItems.map((item) => {
          const count = getCartItemCount(item._id);
          return (
            <div className="item" key={item._id}>
              <h3>{item.productName}</h3>
              <img src={item.imageURL} alt={item.productName} />
              <p>${item.price}</p>
              <button onClick={() => addToCart(item._id)}>
                Purchase Again {count > 0 && <> ({count})</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};