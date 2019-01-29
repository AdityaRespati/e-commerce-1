
const Cart = require('../models/Cart')

class cartController {

  static addToCart(req, res, next) {
    let productId = req.body.productId

    Cart
      .findOne({ userId: req.user })
      .then(cart => {
        var quantityIndex = 0
        var isExist = false
        cart.products.forEach((product, index) => {
          if(product.productId == productId){
            isExist = true
            quantityIndex = index
          }
        })

        if(!isExist){
          cart.products.push({
            productId: productId,
            quantity: 1
          })
        } else{
          cart.products[quantityIndex].quantity++
        }

        cart.save()
        console.log(cart)
        res
          .status(201)
          .json({
            msg: "add to cart success", 
            cart
          })
      })
      .catch(err => {
        res
          .status(404)
          .json({
            message: "not found",
            err
          })
      })
  }

  static findMyCart(req, res, next) {
    Cart
      .findOne({ userId: req.user })
      .then(cart => {
        res
          .status(200)
          .json({
            message: "get data success",
            data: cart
          })
      })
      .catch(err => {
        res
          .status(404)
          .json({
            message: "not found",
            err
          })
      })
  }

  static deleteCard(req, res, next) {
    Cart
      .findOneAndDelete({ userId: req.user })
      .then(cart => {
        res
          .status(200)
          .json({
            msg: "success delete cart",
            cart
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            msg: "internal server error",
            err
          })
      })
  }
}

module.exports = cartController