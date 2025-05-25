import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const { placeOrder } = useContext(ShopContext);
  const dataQuery = search.get("data");
  const [data, setData] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (dataQuery) {
      try {
        const resData = atob(dataQuery);
        const resObject = JSON.parse(resData);
        console.log("Payment Response:", resObject);
        setData(resObject);

        // Place order if payment is successful and order hasn't been placed yet
        if (resObject.status === "COMPLETE" && !orderPlaced) {
          const customerDetails = JSON.parse(
            localStorage.getItem("customerDetails")
          );
          console.log("Customer Details:", customerDetails);

          if (customerDetails) {
            // Add a small delay to ensure all data is ready
            setTimeout(() => {
              placeOrder(customerDetails, "esewa")
                .then(() => {
                  setOrderPlaced(true);
                  // Clear customer details from localStorage
                  localStorage.removeItem("customerDetails");
                  toast.success("Order placed successfully!");
                })
                .catch((error) => {
                  console.error("Error placing order:", error);
                  toast.error("Failed to place order. Please contact support.");
                });
            }, 1000);
          } else {
            toast.error("Customer details not found. Please contact support.");
          }
        }
      } catch (error) {
        console.error("Error processing payment data:", error);
        toast.error("Error processing payment data");
      }
    }
  }, [dataQuery, placeOrder, orderPlaced]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <img
                src={assets.paymentCheck}
                alt="Success"
                className="w-8 h-8"
              />
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Payment Successful!
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Thank you for your payment. Your transaction has been completed
              successfully.
            </p>

            <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Transaction Amount</span>
                <span className="font-medium text-lg">
                  Rs. {data.total_amount}
                </span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-medium">{data.transaction_uuid}</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-green-600 font-medium mb-4">
                {orderPlaced
                  ? "Order placed successfully!"
                  : "Processing your order..."}
              </p>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Thank you for choosing our service</p>
              <p className="mt-1">
                A confirmation email has been sent to your registered email
                address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
