const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, "product name can't be empty"]
  }, 
  image: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: [true, "price can't be empty"]
  },
  stock: Number,
  postedAt: {
    type: Date,
    default: new Date
  }
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product

