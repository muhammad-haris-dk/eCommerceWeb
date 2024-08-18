const CartItem = require("../models/cart_Item_Model");
const Cart = require("../models/cart_Model");
const Product = require("../models/product");

const createCart = async (user) => {
  try {
    const cart = new Cart({ user });
    const createdCart = await cart.save();
    return createdCart;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUserCarts = async (userId) => {
  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If no cart found, create a new cart for the user
      cart = new Cart({ user: userId });
      await cart.save(); // Save the newly created cart
    }

    const cartItems = await CartItem.find({ cart: cart._id });

    cart.cartItems = cartItems;

    let totalPrice = 0;
    let discountedPrice = 0;
    let totalItem = 0;

    for (let cartItem of cart.cartItems) {
      totalPrice += cartItem.price;
      discountedPrice += cartItem.discountedPrice;
      totalItem += cartItem.quantity;
    }

    cart.totalPrice = totalPrice;
    cart.totalItem = totalItem;
    cart.discount = totalPrice - discountedPrice;

    return cart; // Return the cart with updated values
  } catch (error) {
    throw new Error(error.message);
  }
};

const addCartItem = async (userId, req) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("No cart found for this user.");
    }
    const product = await Product.findById(req.productId);

    const isPresent = await CartItem.findOne({
      cart: cart._id,
      product: product._id,
      userId: userId,
    });

    if (!isPresent) {
      const cartItem = new CartItem({
        product: product._id,
        cart: cart._id,
        quantity: 1,
        userId,
        price: product.price,
        size: req.size,
        discountedPrice: product.discountedPrice,
      });

      const createdCartItem = await cartItem.save();
      cart.cartItems.push(createdCartItem);
      await cart.save();
      return "Item Added to Cart";
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createCart, addCartItem, findUserCarts };
