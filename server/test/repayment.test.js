/* eslint-disable no-undef */
import chai from 'chai';
import request from 'supertest';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import faker from 'faker';
import { User as Admin } from '../models';
import app from '../app';


const authAdmin = request.agent(app);
const authUser = request.agent(app);

chai.use(chaiHttp);
chai.should();

const user = {
  email: 'johndoe@gmail.com',
  password: 'password',
};

const savedAdmin = {
  email: faker.internet.email().toLowerCase(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  address: faker.address.streetAddress(),
};

describe('Loan Route', () => {
  describe('routes: User /loans', () => {
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
      authAdmin
        .post('/api/v1/admin/auth/login')
        .send(savedAdmin)
        .end(() => {
          done();
        });
    });

    before((done) => {
      authUser
        .post('/api/v1/auth/login')
        .send(user)
        .end(() => {
          done();
        });
    });

    it('should throw error if an unauthorized user try to post loan repayment', (done) => {
      request(app)
        .post('/api/v1/loans/1/repayments')
        .send({ amount: 250000 })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should throw error if non-admin try to post loan repayment', (done) => {
      authUser
        .post('/api/v1/loans/1/repayments')
        .send({ amount: 250000 })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Only admin can access');
          done();
        });
    });

    it('should throw error if loanId is not found', (done) => {
      authAdmin
        .post('/api/v1/loans/1001/repayments')
        .send({ amount: 250000 })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Loan not found');
          done();
        });
    });

    it('should post loan repayment transaction', (done) => {
      authAdmin
        .post('/api/v1/loans/1/repayments')
        .send({ amount: 262500 })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          done();
        });
    });

    it('should throw error if there is no outstanding payment', (done) => {
      authAdmin
        .post('/api/v1/loans/1/repayments')
        .send({ amount: 250000 })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('No outstanding payment');
          done();
        });
    });

    it('should create a new loan record', (done) => {
      const newLoan = { tenor: 10, amount: 250000 };
      authUser
        .post('/api/v1/loans')
        .send(newLoan)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });

    it('should throw error if loanId is not found', (done) => {
      authUser
        .get('/api/v1/loans/1001/repayments')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Loan not found');
          done();
        });
    });

    it('should throw error if user is unauthorized', (done) => {
      request(app)
        .get('/api/v1/loans/1/repayments')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should get loan repayment history', (done) => {
      authUser
        .get('/api/v1/loans/1/repayments')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          done();
        });
    });
  });
});
