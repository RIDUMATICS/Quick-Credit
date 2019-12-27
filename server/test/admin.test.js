/* eslint-disable no-undef */
import chai from 'chai';
import request from 'supertest';
import chaiHttp from 'chai-http';
import faker from 'faker';
import bcrypt from 'bcryptjs';
import { User as Admin } from '../models';
import app from '../app';

const authAdmin = request.agent(app);
const authUser = request.agent(app);

chai.use(chaiHttp);
chai.should();

const savedAdmin = {
  email: faker.internet.email().toLowerCase(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  address: faker.address.streetAddress(),
};

const user = {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  address: faker.address.streetAddress(),
};

const newAdmin = {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  address: faker.address.streetAddress(),
};

describe('Authentication Route', () => {
  describe('Admin', () => {
    before(async () => {
      // runs before all tests in this block
      await Admin.create({
        ...savedAdmin,
        password: await bcrypt.hash(savedAdmin.password, 10),
        signMethod: 'local',
        status: 'verified',
        isAdmin: true,
      });
    });

    before((done) => {
      authUser
        .post('/api/v1/auth/signup')
        .send(user)
        .end(() => {
          done();
        });
    });

    it('should throw an error if email does not exist (incorrect)', (done) => {
      request(app)
        .post('/api/v1/admin/auth/login')
        .send({ email: 'unknownuser@gmail.com', password: savedAdmin.password })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('The email and password you entered did not match our records. Please double-check and try again.');
          done();
        });
    });

    it('should throw an error if password is incorrect', (done) => {
      request(app)
        .post('/api/v1/auth/login')
        .send({ email: savedAdmin.email, password: 'unknownPasswordisGood' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('The email and password you entered did not match our records. Please double-check and try again.');
          done();
        });
    });

    // authAdmin will login manage its own JWT_token
    it('should login a admin if exist', (done) => {
      authAdmin
        .post('/api/v1/admin/auth/login')
        .send(savedAdmin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data').should.be.a('object');
          res.body.data.should.have.property('admin').should.be.a('object');
          res.body.data.admin.should.have.property('email').eql(savedAdmin.email.toLowerCase());
          res.body.data.admin.should.have.property('firstName').eql(savedAdmin.firstName);
          res.body.data.admin.should.have.property('lastName').eql(savedAdmin.lastName);
          done();
        });
    });

    it('should throw error if try to create a new admin without login', (done) => {
      request(app)
        .post('/api/v1/admin/auth/signup')
        .send(newAdmin)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should throw error if non-admin try to create a new admin', (done) => {
      authUser
        .post('/api/v1/admin/auth/signup')
        .send(newAdmin)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Only admin can access');
          done();
        });
    });

    it('should throw an error if admin already exists', (done) => {
      authAdmin
        .post('/api/v1/admin/auth/signup')
        .send(savedAdmin)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(409);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Email has already been taken.');
          done();
        });
    });

    it('should signup a new admin', (done) => {
      authAdmin
        .post('/api/v1/admin/auth/signup')
        .send(newAdmin)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('data').should.be.a('object');
          res.body.data.should.have.property('admin').should.be.a('object');
          res.body.data.admin.should.have.property('email').eql(newAdmin.email.toLowerCase());
          res.body.data.admin.should.have.property('firstName').eql(newAdmin.firstName);
          res.body.data.admin.should.have.property('lastName').eql(newAdmin.lastName);
          done();
        });
    });
  });
});
