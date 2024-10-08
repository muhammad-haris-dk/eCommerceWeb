const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    orderItems: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "orderItem",
      },
    ],
    orderDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    deliveryDate: {
      type: Date,
    },
    shippingAddress: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
    },
    paymentDetails: {
      paymentMethod: {
        type: String,
      },
      transactionId: {
        type: String,
      },
      paymentId: {
        type: String,
      },
      paymentStatus: {
        type: String,
      },
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalDiscountedPrice: {
      type: Number,
      requied: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      default: "PENDING",
    },
    totalItem: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
