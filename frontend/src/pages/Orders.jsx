import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from "react-toastify";
import axios from "axios";

const Orders = () => {
  const token = localStorage.getItem("token");

  const { currency } = useContext(ShopContext);
  const [listProducts, setListProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/orders/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setListProducts(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListProducts();
  }, []);

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <Title title="My Orders" />
      {listProducts.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        listProducts.map((order) =>
          order.items.flatMap((product) =>
            Object.entries(product.sizes)
              .filter(([_, qty]) => qty > 0)
              .map(([size, qty]) => (
                <div
                  key={`${order._id}-${product._id}-${size}`}
                  className="flex flex-col gap-4 py-4 text-gray-700 border-t border-b md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-6 text-sm">
                    <img
                      className="w-16 sm:w-20"
                      src={product.image[0]}
                      alt={product.name}
                    />
                    <div>
                      <p className="font-medium sm:text-base">{product.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                        <p className="text-lg">
                          {currency}&nbsp;
                          {(product.price * qty).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p>Size:&nbsp;{size}</p>
                        <p>Quantity:&nbsp;{qty}</p>
                      </div>
                      <p className="text-sm text-gray-400">
                        Date:&nbsp;
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between md:w-1/2">
                    <div className="flex items-center gap-2">
                      <p className="h-2 bg-green-500 rounded-full min-w-2"></p>
                      <p className="text-sm md:text-base">Ready for Shipping</p>
                    </div>
                  </div>
                </div>
              ))
          )
        )
      )}
    </div>
  );
};

export default Orders;
