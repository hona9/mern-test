import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    deliveryInfo: {
      firstName: String,
      lastName: String,
      email: String,
      address: String,
      phone: String,
    },
    paymentMethod: String,

    totalPrice: Number,
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
