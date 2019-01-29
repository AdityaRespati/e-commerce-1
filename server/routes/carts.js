const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')
const isLogin = require('../middlewares/isLogin')

router.get('/mycart', isLogin, cartController.findMyCart )
router.put('/', isLogin, cartController.addToCart)
router.delete('/', isLogin, cartController.deleteCard)

module.exports = router