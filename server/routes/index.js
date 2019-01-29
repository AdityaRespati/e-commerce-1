var express = require('express');
var router = express.Router();
var userRoute = require('../routes/users')
var productRoute = require('../routes/products')
var cartRoute = require('../routes/carts')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/users', userRoute)
router.use('/products', productRoute)
router.use('/carts', cartRoute)

module.exports = router;
