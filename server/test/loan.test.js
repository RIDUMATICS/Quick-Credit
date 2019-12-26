/* eslint-disable no-unused-vars */
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
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  address: faker.address.streetAddress(),
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
        .post('/api/v1/auth/signup')
        .send(user)
        .end(() => {
          done();
        });
    });

    it('should throw error if an unauthorized user tries to make a loan request', (done) => {
      request(app)
        .post('/api/v1/loans')
        .send({ tenor: 10, amount: 250000 })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should throw error if an unverified user tries to make a loan request', (done) => {
      authUser
        .post('/api/v1/loans')
        .send({ tenor: 10, amount: 250000 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Account has not been verified');
          done();
        });
    });

    it('should throw error if an unauthorized user try to verify a user', (done) => {
      request(app)
        .patch(`/api/v1/users/${user.email}/verify`)
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should throw error if non-admin try to verify a user', (done) => {
      authUser
        .patch(`/api/v1/users/${user.email}/verify`)
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Only admin can access');
          done();
        });
    });

    it('should throw error if an invalid email is passed for verification', (done) => {
      authAdmin
        .patch('/api/v1/users/unknownemail@gmail.com/verify')
        .send()
        .end((err, res) => {
          console.log(res.body);
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('The email you entered did not match our records. Please double-check and try again.');
          done();
        });
    });

    it('should verify user', (done) => {
      authAdmin
        .patch(`/api/v1/users/${user.email}/verify`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data').should.be.a('object');
          res.body.data.should.have.property('user').should.be.a('object');
          res.body.data.user.should.have.property('email').eql(user.email.toLowerCase());
          res.body.data.user.should.have.property('firstName').eql(user.firstName);
          res.body.data.user.should.have.property('lastName').eql(user.lastName);
          res.body.data.user.should.have.property('address').eql(user.address);
          res.body.data.user.should.have.property('status').eql('verified');
          done();
        });
    });

    it('should throw error if an invalid tenor is passed', (done) => {
      authUser
        .post('/api/v1/loans')
        .send({ tenor: 100, amount: 250000 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Tenor is between 1 to 12 months');
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
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('data').should.be.a('object');
          res.body.data.should.have.property('loan').should.be.a('object');
          res.body.data.loan.should.have.property('id');
          res.body.data.loan.should.have.property('user').eql(user.email.toLowerCase());
          res.body.data.loan.should.have.property('createdOn');
          res.body.data.loan.should.have.property('status').eql('pending');
          res.body.data.loan.should.have.property('repaid').eql(false);
          res.body.data.loan.should.have.property('tenor').eql(newLoan.tenor);
          res.body.data.loan.should.have.property('amount').eql(newLoan.amount);
          res.body.data.loan.should.have.property('paymentInstallment');
          res.body.data.loan.should.have.property('balance');
          res.body.data.loan.should.have.property('interest');
          res.body.data.loan.should.have.property('updatedAt');
          res.body.data.loan.should.have.property('createdAt');
          done();
        });
    });

    it('should throw error if user have a pending loan and try to request a new loan', (done) => {
      authUser
        .post('/api/v1/loans')
        .send({ tenor: 10, amount: 250000 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Still have a pending loan');
          done();
        });
    });

    it('should throw an error if unauthorized user try to approve or reject a loan', (done) => {
      request(app)
        .patch('/api/v1/loans/10001')
        .send({ status: 'approved' })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });


    it('should throw error if loan record is not found', (done) => {
      authAdmin
        .patch('/api/v1/loans/10001')
        .send({ status: 'approved' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Loan not found');
          done();
        });
    });

    it('should throw error if invalid status is passed', (done) => {
      authAdmin
        .patch('/api/v1/loans/1')
        .send({ status: 'wrongStatus' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Status not supported');
          done();
        });
    });

    it('should reject a user loan', (done) => {
      authAdmin
        .patch('/api/v1/loans/1')
        .send({ status: 'rejected' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data').should.be.a('object');
          res.body.data.should.have.property('loan').should.be.a('object');
          res.body.data.loan.should.have.property('id');
          res.body.data.loan.should.have.property('user').eql(user.email.toLowerCase());
          res.body.data.loan.should.have.property('createdOn');
          res.body.data.loan.should.have.property('status').eql('rejected');
          res.body.data.loan.should.have.property('repaid').eql(false);
          res.body.data.loan.should.have.property('tenor');
          res.body.data.loan.should.have.property('amount');
          res.body.data.loan.should.have.property('paymentInstallment');
          res.body.data.loan.should.have.property('balance');
          res.body.data.loan.should.have.property('interest');
          res.body.data.loan.should.have.property('updatedAt');
          res.body.data.loan.should.have.property('createdAt');
          done();
        });
    });

    it('should approve a user loan', (done) => {
      authAdmin
        .patch('/api/v1/loans/1')
        .send({ status: 'approved' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data').should.be.a('object');
          res.body.data.should.have.property('loan').should.be.a('object');
          res.body.data.loan.should.have.property('id');
          res.body.data.loan.should.have.property('user').eql(user.email.toLowerCase());
          res.body.data.loan.should.have.property('createdOn');
          res.body.data.loan.should.have.property('status').eql('approved');
          res.body.data.loan.should.have.property('repaid').eql(false);
          res.body.data.loan.should.have.property('tenor');
          res.body.data.loan.should.have.property('amount');
          res.body.data.loan.should.have.property('paymentInstallment');
          res.body.data.loan.should.have.property('balance');
          res.body.data.loan.should.have.property('interest');
          res.body.data.loan.should.have.property('updatedAt');
          res.body.data.loan.should.have.property('createdAt');
          done();
        });
    });

    it('should throw error if user have a unpaid loan and try to request a new loan', (done) => {
      authUser
        .post('/api/v1/loans')
        .send({ tenor: 10, amount: 250000 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Still have an unpaid loan');
          done();
        });
    });

    it('should return all loan requests made by a user', (done) => {
      authUser
        .get('/api/v1/loans/user')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('should get all loans', (done) => {
      authAdmin
        .get('/api/v1/loans')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('should get all repaid loans', (done) => {
      authAdmin
        .get('/api/v1/loans?status=approved&repaid=true')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('should get all unpaid loans', (done) => {
      authAdmin
        .get('/api/v1/loans?status=approved&repaid=false')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('should throw error if non-admin try get all loan', (done) => {
      authUser
        .get('/api/v1/loans')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Only admin can access');
          done();
        });
    });

    it('should throw error if unauthorized user try get all loan', (done) => {
      request(app)
        .get('/api/v1/loans')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should throw error if invalid status is passed', (done) => {
      authAdmin
        .get('/api/v1/loans?status=wrongStatus&repaid=true')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Query not supported');
          done();
        });
    });

    it('should throw error if invalid repaid is passed', (done) => {
      authAdmin
        .get('/api/v1/loans?status=approved&repaid=yes')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Query not supported');
          done();
        });
    });

    it('should get loan by Id', (done) => {
      authAdmin
        .get('/api/v1/loans/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          done();
        });
    });

    it('should throw error if loan record is not found', (done) => {
      authAdmin
        .get('/api/v1/loans/10001')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Loan not found');
          done();
        });
    });

    it('should throw error if non-admin try get loan by Id', (done) => {
      authUser
        .get('/api/v1/loans')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Only admin can access');
          done();
        });
    });

    it('should throw error if unauthorized user try get loan by Id ', (done) => {
      request(app)
        .get('/api/v1/loans')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
