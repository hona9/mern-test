import React, { useEffect, useState } from "react";
import axios from "axios";
import { products } from "../assets/assets"; // adjust path as needed

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        setOrders(response.data.orders);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err.message ||
          "Failed to load orders.";
        setError(msg);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      {orders?.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-4 mb-6 shadow-md bg-white"
          >
            <h3 className="text-lg font-bold mb-2">Order ID: {order._id}</h3>

            {order.user && (
              <div className="mb-2">
                <p>
                  <strong>Ordered By:</strong> {order.user.name ?? "N/A"} (
                  {order.user.email ?? "N/A"})
                </p>
              </div>
            )}
            <hr className="my-4 border-t border-gray-300" />

            <div className="text-lg font-bold mb-2">Delivery Details</div>
            <p>
              <strong>Customer:</strong> {order.deliveryInfo.firstName}{" "}
              {order.deliveryInfo.lastName}
            </p>
            <p>
              <strong>Email:</strong> {order.deliveryInfo.email}
            </p>
            <p>
              <strong>Address:</strong> {order.deliveryInfo.address}
            </p>
            <p>
              <strong>Phone:</strong> {order.deliveryInfo.phone}
            </p>
            <p>
              <strong>Payment:</strong> {order.paymentMethod.toUpperCase()}
            </p>
            <p>
              <strong>Total:</strong> Rs. {order.totalPrice}
            </p>

            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Ordered Products:</h4>
              <ul className="list-disc pl-6">
                {order.items.flatMap((product) =>
                  Object.entries(product.sizes)
                    .filter(([_, qty]) => qty > 0)
                    .map(([size, qty]) => (
                      <li key={`${product._id}-${size}`}>
                        {product.name} — Size: <strong>{size}</strong> ×
                        Quantity: <strong>{qty}</strong> — Price per unit: Rs.{" "}
                        {product.price} — Total: Rs. {product.price * qty}
                      </li>
                    ))
                )}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
