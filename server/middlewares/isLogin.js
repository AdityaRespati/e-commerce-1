const User = require('../models/User')
const jwtVerify = require('../helpers/jwt')

module.exports = (req, res, next) => {
    try {
      let token = req.headers.token

      if (token) {
        let decoded = jwtVerify(token)
        
        User  
        .findOne({ email: decoded.email })
        .then(user => {
          if (user) {
            req.user = user._id
            next()
          } else {
            res
            .status(400)
            .json({
              msg: "wrong username/password",
              decoded
            })
          }
        })
      } else {
        res
          .status(400)
          .json({ msg: "invalid token" })
      }

    } catch (error) {
      res
        .status(500)
        .json({
          msg: "internal server error on middleware",
          error
        })
    }
  }