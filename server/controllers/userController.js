require('dotenv').config()
const User = require('../models/User')
const Cart = require('../models/Cart')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class userController {
  static register(req, res, next) {
    User
      .create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
      .then(user => {
        res
          .status(201)
          .json({
            message: "registration success",
            data: user
          })

        let emptycart = {
          userId: user._id
        }
        return Cart.create(emptycart)
      })
      .then(cart => {
        console.log("success create cart")
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

  static login(req, res, next) {

    User
      .findOne({
        email: req.body.email
      })
      .then(user => {
        if (user) {
          if (bcrypt.compareSync(req.body.password, user.password)) {

            let token = jwt.sign({
              email: user.email
            }, process.env.JWT_SECRET)

            res
              .status(200)
              .json({
                message: "sign in success",
                access_token: token
              })
        } else {
            res
              .status(404)
              .json({
                message: "email/password not found"
              })
          }
        } else {
          res
            .status(404)
            .json({
              message: "email not registered"
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

}


module.exports = userController