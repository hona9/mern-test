import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    mobile: "",
  });

  const { placeOrder } = useContext(ShopContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const allFieldsFilled = Object.values(formData).every(
      (val) => val.trim() !== ""
    );
    if (!allFieldsFilled) {
      alert("Please fill all delivery information.");
      return;
    }

    if (method === "cod") {
      // Handle COD flow - just place the order
      placeOrder(formData, method);
    } else if (method === "esewa") {
      // Store customer details in localStorage before redirecting
      localStorage.setItem("customerDetails", JSON.stringify(formData));
      navigate("/payment");
    }
  };

  return (
    <div className="flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t">
      <div className="flex flex-col w-full gap-4 sm:max-w-[480px]">
        <div className="my-3 text-xl sm:text-2xl">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="First Name"
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          type="email"
          placeholder="Email Address"
        />
        <input
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="City"
          />
          <input
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            name="zip"
            value={formData.zip}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="number"
            placeholder="Zip Code"
          />
          <input
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          type="number"
          placeholder="Mobile"
        />
      </div>

      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHODS"} />
          <div className="flex flex-col gap-3 lg:flex-row">
            {["esewa", "cod"].map((mth, idx) => (
              <div
                key={mth}
                onClick={() => setMethod(mth)}
                className="flex items-center gap-3 p-2 px-3 border cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === mth ? "bg-green-600" : ""
                  }`}
                ></p>
                {mth === "cod" ? (
                  <p className="mx-4 text-sm font-medium text-gray-500">
                    CASH ON DELIVERY
                  </p>
                ) : (
                  <img
                    className="h-8 mx-4"
                    src={assets[`${mth}_logo`]}
                    alt={mth}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="w-full mt-8 text-end">
            <button
              onClick={handleSubmit}
              className="px-16 py-3 text-sm text-white bg-black active:bg-gray-800"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
