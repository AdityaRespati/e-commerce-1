var express = require('express');
var router = express.Router();
var productController = require('../controllers/productController')
var isLogin = require('../middlewares/isLogin')

router.get('/', isLogin, productController.getAll)
router.post('/', isLogin, productController.create)
router.get('/search', isLogin, productController.getAll)
router.get('/:id', isLogin, productController.getOne)
router.put('/:id',isLogin, productController.update)
router.delete('/:id', isLogin, productController.delete)

module.exports = router