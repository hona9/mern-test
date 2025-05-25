import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { assets } from "../assets/assets";

const Payment = () => {
  const { delivery_fee, getCartAmount } = useContext(ShopContext);
  const [formData, setformData] = useState({
    amount: "0",
    total_amount: "0",
    transaction_uuid: uuidv4(),
    product_service_charge: "0",
    product_delivery_charge: "0",
    tax_amount: "0",
    product_code: "EPAYTEST",
    success_url: "http://localhost:5173/paymentsuccess",
    failure_url: "http://localhost:5173/paymentfailure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });

  // generate signature function
  const generateSignature = (
    total_amount,
    transaction_uuid,
    product_code,
    secret
  ) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
    return hashedSignature;
  };

  // Update amounts whenever cart changes
  useEffect(() => {
    const cartAmount = getCartAmount();
    const totalAmount = cartAmount === 0 ? 0 : cartAmount;

    setformData((prev) => ({
      ...prev,
      amount: cartAmount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      total_amount: totalAmount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    }));
  }, [getCartAmount]);

  // Update signature whenever relevant fields change
  useEffect(() => {
    const { total_amount, transaction_uuid, product_code, secret } = formData;
    const hashedSignature = generateSignature(
      total_amount,
      transaction_uuid,
      product_code,
      secret
    );

    setformData((prev) => ({ ...prev, signature: hashedSignature }));
  }, [formData.total_amount, formData.transaction_uuid, formData.product_code]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex justify-center mb-8">
            <img src={assets.esewa_logo} alt="eSewa" className="h-12" />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Complete Your Payment
          </h2>

          <form
            action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
            method="POST"
            className="space-y-6"
          >
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs. {formData.amount}</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-lg font-bold text-green-600">
                  Rs. {formData.total_amount}
                </span>
              </div>
            </div>

            <input
              type="hidden"
              id="amount"
              name="amount"
              value={formData.amount}
              required
            />
            <input
              type="hidden"
              id="total_amount"
              name="total_amount"
              value={formData.total_amount}
              required
            />
            <input
              type="hidden"
              id="tax_amount"
              name="tax_amount"
              value={formData.tax_amount}
              required
            />
            <input
              type="hidden"
              id="transaction_uuid"
              name="transaction_uuid"
              value={formData.transaction_uuid}
              required
            />
            <input
              type="hidden"
              id="product_code"
              name="product_code"
              value={formData.product_code}
              required
            />
            <input
              type="hidden"
              id="product_service_charge"
              name="product_service_charge"
              value={formData.product_service_charge}
              required
            />
            <input
              type="hidden"
              id="product_delivery_charge"
              name="product_delivery_charge"
              value={formData.product_delivery_charge}
              required
            />
            <input
              type="hidden"
              id="success_url"
              name="success_url"
              value={formData.success_url}
              required
            />
            <input
              type="hidden"
              id="failure_url"
              name="failure_url"
              value={formData.failure_url}
              required
            />
            <input
              type="hidden"
              id="signed_field_names"
              name="signed_field_names"
              value={formData.signed_field_names}
              required
            />
            <input
              type="hidden"
              id="signature"
              name="signature"
              value={formData.signature}
              required
            />

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Pay with eSewa
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Secure payment powered by eSewa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
