import orderModel from "../models/orderModel.js";

const placeOrder = async (req, res) => {
  try {
    const user = req.user;
    const { items, customerDetails, paymentMethod, totalAmount, delivery_fee } =
      req.body;
    console.log(items);
    const payload = {
      user: user._id,
      items,
      deliveryInfo: {
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        email: customerDetails.email,
        address: `${customerDetails.street}, ${customerDetails.city}, ${customerDetails.state}`,
        phone: customerDetails.mobile,
      },
      paymentMethod,
      totalPrice: Number(Number(totalAmount) + Number(delivery_fee)),
    };

    const order = await orderModel.create(payload);

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .populate([{ path: "user", select: "name email" }, { path: "items" }])
      .lean();

    if (orders.length < 0) {
      throw Error("No Orders found!");
    }

    const ordersToSend = orders.map((order) => ({
      ...order,
      items: Object.values(order.items),
    }));

    res.status(200).json({ success: true, orders: ordersToSend });
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};

const getUserOrders = async (req, res) => {
  try {
    const user = req.user;
    const orders = await orderModel
      .find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("items")
      .lean();

    if (orders.length <= 0) {
      return res.sendStatus(400);
    }

    const ordersToSend = orders.map((order) => ({
      ...order,
      items: Object.values(order.items),
    }));

    return res.status(200).json({ success: true, orders: ordersToSend });
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export { placeOrder, getAllOrders, getUserOrders };
