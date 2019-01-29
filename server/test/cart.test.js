const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../app')
const clearCart = require('../helpers/clearCart')
const clearUser = require('../helpers/clearUser')
const clearProduct = require('../helpers/clearProduct')

chai.use(chaiHttp)

describe('Cart test', function () {

  var token = ""
  var myProduct1 = {}
  var myProduct2 = {}

  before(function (done) {
    clearUser(done)
  })

  describe('POST /users', function () {
    it('should send an object with 201 status code', function (done) {
      var newUser = {
        username: "user1",
        email: "user1@mail.com",
        password: "123456"
      }

      chai
        .request(app)
        .post('/users')
        .send(newUser)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body.data).to.have.property('_id')
          expect(res.body.data).to.have.property('username')
          expect(res.body.data).to.have.property('email')
          expect(res.body.data).to.have.property('password')
          expect(res.body.data.username).to.equal(newUser.username)
          expect(res.body.data.email).to.equal(newUser.email)
          expect(res.body.data.password).to.not.equal(newUser.password)
          done()
        })
    })
  })

  describe('POST /users/login', function () {
    it('should return an object with 200 status code', function (done) {
      var userLogin = {
        email: "user1@mail.com",
        password: "123456"
      }

      chai
        .request(app)
        .post('/users/login')
        .send(userLogin)
        .end(function (err, res) {
          token = res.body.access_token
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('access_token')
          expect(res.body.access_token).to.be.a('string')
          expect(res.body.message).to.equal('sign in success')
          done()
        })

    })
  })


  before(function (done) {
    clearCart(done)
  })

  before(function (done) {
    clearProduct(done)
  })

  describe("POST /products", function () {
    it('should return success create product', function (done) {
      let newProduct = {
        name: "ASUS 717",
        price: 10000000,
        stock: 43
      }

      chai
        .request(app)
        .post('/products')
        .send(newProduct)
        .set('token', token)
        .end(function (err, res) {
          myProduct1 = { productId: res.body.data._id }
          expect(res).to.have.status(201)
          expect(res.body.data.name).to.equal("ASUS 717")
          expect(res.body.data.price).to.equal(10000000)
          expect(res.body.data.stock).to.equal(43)
          expect(res.body.data.postedAt).to.not.null
          expect(res.body.message).to.equal("product posted succesfully")
          done()
        })
    })

    it('should return success create SECOND product', function (done) {
      var newProduct2 = {
        name: "XIAOMI 717",
        price: 10000000,
        stock: 43
      }

      chai
        .request(app)
        .post('/products')
        .send(newProduct2)
        .set('token', token)
        .end(function (err, res) {
          myProduct2 = { productId: res.body.data._id }
          expect(res).to.have.status(201)
          expect(res.body.data.name).to.equal("XIAOMI 717")
          expect(res.body.data.price).to.equal(10000000)
          expect(res.body.data.stock).to.equal(43)
          expect(res.body.data.postedAt).to.not.null
          expect(res.body.message).to.equal("product posted succesfully")
          done()
        })
    })

    it("should return name validation error", function (done) {
      let newProduct = {
        price: 10000000,
        stock: 43
      }

      chai
        .request(app)
        .post('/products')
        .send(newProduct)
        .set('token', token)
        .end(function (err, res) {
          expect(res.body.err.name).to.equal('ValidationError')
          done()
        })

    })

    it("should return price validation error", function (done) {
      let newProduct = {
        name: "Asus",
        stock: 43
      }

      chai
        .request(app)
        .post('/products')
        .send(newProduct)
        .set('token', token)
        .end(function (err, res) {
          expect(res.body.err.name).to.equal('ValidationError')
          done()
        })
    })
  })

  describe('PUT /carts', function () {
    it('should return success add to empty cart', function (done) {
      chai
        .request(app)
        .put('/carts')
        .send(myProduct1)
        .set('token', token)
        .end(function (err, res) {
          expect(res).to.have.status(201)
          done()
        })
    })

    it('should return success add quantity in cart', function (done) {
      chai
        .request(app)
        .put('/carts')
        .send(myProduct1)
        .set('token', token)
        .end(function (err, res) {
          expect(res).to.have.status(201)
          expect(res.body.cart.products[0].quantity).to.equal(2)
          done()
        })
    })

    it('should return success add a different product to cart', function (done) {
      chai
        .request(app)
        .put('/carts')
        .send(myProduct2)
        .set('token', token)
        .end(function (err, res) {
          expect(res).to.have.status(201)
          expect(res.body.cart.products.length).to.equal(2)
          done()
        })
    })
  })

  describe('POST /carts/mycarts', function () {

    it('findByUserId should be successful', function (done) {
      chai
        .request(app)
        .get('/carts/mycart')
        .set('token', token)
        .end(function (err, res) {
          expect(res).to.have.status(200)
          expect(res.body.data._id).to.be.a('string')
          expect(res.body.data.userId).to.be.a('string')
          expect(res.body.data.products).to.be.an('array')
          done()
        })
    })

  })

  describe('DELETE /carts', function () {
    it('should return success delete card', function(done){
      chai
      .request(app)
      .delete('/carts')
      .set('token', token)
      .end(function (err, res) {
        expect(res).to.have.status(200)
        done()
      })
    })
  })

  after(function (done) {
    clearCart(done)
  })

  after(function (done) {
    clearProduct(done)
  })

  after(function (done) {
    clearUser(done)
  })
})


