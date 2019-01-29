const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../app')
const clearUser = require('../helpers/clearUser')

chai.use(chaiHttp)

describe('User tests', function () {

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

  describe('POST /users', function () {
    it('email & username should be unique', function (done) {
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
          expect(res).to.have.status(500)
          expect(res.body.err.name).to.be.equal('ValidationError')
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

  describe('POST /users/login', function () {
    it('should return an object with "email not registered" message ', function (done) {
      var userLogin = {
        email: "User2@mail.com",
        password: "987654321"
      }

      chai
        .request(app)
        .post('/users/login')
        .send(userLogin)
        .end(function (err, res) {
          expect(res.body.message).to.equal('email not registered')
          done()
        })
    })
  })

  describe('POST /users/login', function () {
    it('should return an object with "email/password not found" message ', function (done) {
      var userLogin = {
        email: "user1@mail.com",
        password: "987654321"
      }

      chai
        .request(app)
        .post('/users/login')
        .send(userLogin)
        .end(function (err, res) {
          expect(res.body.message).to.equal('email/password not found')
          done()
        })
    })
  })

  after(function (done) {
    clearUser(done)
  })

})
