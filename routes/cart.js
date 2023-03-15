const express=require('express')
const router=express.Router()
const {
    getCart,
    updateCart,
    createCart,
    deleteCart,placeOrder
} =require('../controllers/cart')

router.route('/').post(createCart).get(getCart)
router.route('/:id').patch(updateCart).delete(deleteCart).get(placeOrder)

module.exports=router