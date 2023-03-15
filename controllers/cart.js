const Cart = require("../models/Cart");
const Product=require('../models/Product')
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
} = require("../errors");
const { Promise } = require("mongoose");

const getCart=async (req,res)=>{
    const cartItems =await Cart.find({ userId: req.user.userId });
    if (!cartItems) {
        throw new NotFoundError(`No cart for user`);
      }
    res.status(StatusCodes.OK).json({cartItems: cartItems[0].products, count: cartItems[0].products.length });
}

const createCart=async (req,res)=>{
    const cart = await Cart.create({userId:req.user.userId,products:[]});
    res.status(StatusCodes.CREATED).json({ cart });
}

const updateCart=async (req,res)=>{
    const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          userId:req.user.userId,
          products:req.body.products
        },
        { new: true }
      );
      if(!updatedCart){
        throw new NotFoundError(`No job with id :${req.params.id}`);
      }
      res.status(200).json(updatedCart);
    
}

const deleteCart=async(req,res)=>{
    const cart=await Cart.findByIdAndUpdate(req.params.id,{products:[]}, { new: true });
    if(!cart){
        throw new NotFoundError(`No job with id :${req.params.id}`);
    }
    res.status(StatusCodes.OK).send();
}

const placeOrder=async(req,res)=>{
  let cartItems =await Cart.find({ userId: req.user.userId });
  if (!cartItems) {
      throw new NotFoundError(`No cart for user`);
    }
    cartItems=cartItems[0].products;
    let products=[]
    products=await Promise.all(cartItems.map(async(el)=>{p= await Product.findById(el.productId).select('price')
    return el.quantity*p.price
  }))

    total=products.reduce((a,e)=>a+e,0)
    res.status(200).json({cartItems,total});
}

module.exports={
    getCart,
    updateCart,
    createCart,
    deleteCart,
    placeOrder
}