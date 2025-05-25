import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();

  const currency = "Rs.";
  const delivery_fee = 10;

  useEffect(() => {
    try {
      const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));

      // Check if it's a valid object and follows expected format
      if (
        storedCartItems &&
        typeof storedCartItems === "object" &&
        !Array.isArray(storedCartItems)
      ) {
        setCartItems(storedCartItems);
      } else {
        localStorage.removeItem("cartItems"); // Remove corrupted/legacy data
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      localStorage.removeItem("cartItems");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = async (product, size) => {
    if (!size) {
      toast.error("Please Select a Size");
      return;
    } else {
      toast.success("Item Added To The Cart");
    }

    // Clone the current cart
    let cartData = structuredClone(cartItems);

    const productId = product._id; // Assuming product has _id from MongoDB

    if (!cartData[productId]) {
      // If product not in cart, initialize it
      cartData[productId] = {
        ...product,
        sizes: {
          [size]: 1,
        },
      };
    } else {
      // If product exists
      if (cartData[productId].sizes[size]) {
        cartData[productId].sizes[size] += 1;
      } else {
        cartData[productId].sizes[size] = 1;
      }
    }

    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const productId in cartItems) {
      const product = cartItems[productId];
      if (product.sizes) {
        for (const size in product.sizes) {
          const qty = product.sizes[size];
          if (qty > 0) {
            totalCount += qty;
          }
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (quantity === 0) {
        delete cartData[itemId].sizes[size];

        // Remove the product entirely if no sizes left
        if (Object.keys(cartData[itemId].sizes).length === 0) {
          delete cartData[itemId];
        }

        toast.success("Item Removed From The Cart");
      } else {
        cartData[itemId].sizes[size] = quantity;
      }
    }

    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const productId in cartItems) {
      const product = cartItems[productId];
      if (product.sizes) {
        for (const size in product.sizes) {
          const qty = product.sizes[size];
          if (qty > 0) {
            totalAmount += product.price * qty;
          }
        }
      }
    }
    return totalAmount;
  };

  const placeOrder = async (formData, method) => {
    if (Object.keys(cartItems).length === 0) {
      toast.error("Your cart is empty!");
      return Promise.reject("Cart is empty");
    }

    const orderData = {
      id: Date.now(),
      items: cartItems,
      totalAmount: getCartAmount() + delivery_fee,
      delivery_fee,
      paymentMethod: method,
      customerDetails: formData,
      date: new Date().toLocaleString(),
    };

    console.log("Placing order with data:", orderData);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to place an order");
        return Promise.reject("No authentication token");
      }

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Order placed successfully!");
        setCartItems({});
        navigate("/orders");
        return Promise.resolve(response.data);
      } else {
        toast.error("Failed to place order. Please try again.");
        return Promise.reject("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Something went wrong while placing the order.");
      return Promise.reject(error);
    }
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    placeOrder,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
