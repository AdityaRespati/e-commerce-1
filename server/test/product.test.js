const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../app')
const clearProduct = require('../helpers/clearProduct')
const clearUser = require('../helpers/clearUser')

chai.use(chaiHttp)

describe('Product tests', function () {

  var paramsId = ""
  var token = ""

  before(function (done) {
    clearUser(done)
  })

  before(function (done) {
    clearProduct(done)
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

  describe("POST /products", function () {
    it('should return and object with 201 status code', function (done) {
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
          paramsId = res.body.data._id
          expect(res).to.have.status(201)
          expect(res.body.data.name).to.equal("ASUS 717")
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
          console.log(res.body.err.name)
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
          console.log(res.body.err.name)
          expect(res.body.err.name).to.equal('ValidationError')
          done()
        })
    })
  })

  describe("GET /products", function () {
    it('should return all products', function (done) {

      chai
        .request(app)
        .get('/products')
        .set('token', token)
        .end(function (err, res) {
          expect(res).to.have.status(200)
          expect(res.body.data).to.be.an('array')
          expect(res.body.data[0].name).to.equal('ASUS 717')
          done()
        })
    })
  })

  describe("GET /products/:id", function () {
    it('should return an object with status code 200', function (done) {
      chai
        .request(app)
        .get(`/products/${paramsId}`)
        .set('token', token)
        .end(function (err, res) {
          expect(res).to.status(200)
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.name).to.equal('ASUS 717')
          done()
        })
    })

    it('should return an error message "data not found"', function (done) {
      chai
        .request(app)
        .get(`/products/1`)
        .set('token', token)
        .end(function (err, res) {
          expect(res).to.status(500)
          done()
        })
    })
  })

  describe("GET /products/search?q=name", function () {
    it('should return an array with 200 status code', function (done) {
      chai
        .request(app)
        .get(`/products/search?q=ASUS`)
        .set('token', token)
        .end(function (err, res) {
          expect(res).to.have.status(200)
          expect(res.body.data).to.be.an('array')
          expect(res.body.data[0].name).to.equal("ASUS 717")
          done()
        })
    })

    it('should return not found', function (done) {
      chai
        .request(app)
        .get(`/products/search?q=randomnname`)
        .set('token', token)
        .end(function (err, res) {
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe("PUT /products/:id", function () {
    it('should return an object with 200 status code', function (done) {
      let productUpdate = {
        price: 9000000
      }

      chai
        .request(app)
        .put(`/products/${paramsId}`)
        .send(productUpdate)
        .set('token', token)
        .end(function (err, res) {
          expect(res).to.have.status(200)
          expect(res.body.data._id).to.equal(paramsId)
          expect(res.body.data.price).to.equal(9000000)
          done()
        })
    })
  })

  describe("DELETE /products/:id", function () {
    it('should return an object with 200 status code', function (done) {
      chai
        .request(app)
        .delete(`/products/${paramsId}`)
        .set('token', token)
        .end(function (err, res) {
          expect(res).to.have.status(200)
          expect(res.body.data._id).to.equal(paramsId)
          expect(res.body.data.price).to.equal(9000000)
          done()
        })
    })
  })

  after(function (done) {
    clearProduct(done)
  })

  after(function (done) {
    clearUser(done)
  })

})





