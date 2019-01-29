const Product = require('../models/Product')

class productController {
  static create(req, res, next) {

    Product
      .create({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock
      })
      .then(product => {
        res
          .status(201)
          .json({
            message: "product posted succesfully",
            data: product
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: "internal server error",
            err
          })
      })
  }

  static getAll(req, res, next) {
    let query = {}

    if (req.query.q) {
      query = {
        name: {
          $regex: '.*' + req.query.q + '.*',
          $options: "i"
        }
      }
    }

    Product
      .find(query)
      .then(products => {
        if (products.length) {
          res
            .status(200)
            .json({
              message: "get data success",
              data: products
            })
        } else {
          res
            .status(404)
            .json({
              message: "data not found"
            })
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: "internal server error",
            err
          })
      })
  }

  static getOne(req, res, next) {

    Product
      .findOne({ _id: req.params.id })
      .then(product => {
        res
          .status(200)
          .json({
            message: "get data success",
            data: product
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: "internal server error",
            err
          })
      })
  }

  static update(req, res, next) {
    Product
      .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then(updatedProduct => {
        res
          .status(200)
          .json({
            message: "udpate data success",
            data: updatedProduct
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: "internal server error",
            err
          })
      })
  }

  static delete(req, res, next) {
    Product
      .findOneAndDelete({ _id: req.params.id })
      .then(product => {
        res
          .status(200)
          .json({
            message: "delete success",
            data: product
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: "internal server error",
            err
          })
      })
  }

}

module.exports = productController