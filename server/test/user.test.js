/* eslint-disable no-undef */
import chai from 'chai';
import request from 'supertest';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../app';
import generateToken from '../helper/generateToken';

const agent = request.agent(app);

chai.use(chaiHttp);
chai.should();

const user = {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  address: faker.address.streetAddress(),
};

describe('Authentication Route', () => {
  describe('User', () => {
    it('should signup a new user', (done) => {
      request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('data').should.be.a('object');
          res.body.data.should.have.property('user').should.be.a('object');
          res.body.data.user.should.have.property('email').eql(user.email.toLowerCase());
          res.body.data.user.should.have.property('firstName').eql(user.firstName);
          res.body.data.user.should.have.property('lastName').eql(user.lastName);
          done();
        });
    });

    it('should throw an error if user already exists', (done) => {
      request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(409);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('Email has already been taken.');
          done();
        });
    });
    // agent will login manage its own JWT_token
    it('should login a user if exist', (done) => {
      agent
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data').should.be.a('object');
          res.body.data.should.have.property('user').should.be.a('object');
          res.body.data.user.should.have.property('email').eql(user.email.toLowerCase());
          res.body.data.user.should.have.property('firstName').eql(user.firstName);
          res.body.data.user.should.have.property('lastName').eql(user.lastName);
          done();
        });
    });

    it('should throw an error if email does not exist (incorrect)', (done) => {
      request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'unknownuser@gmail.com', password: user.password })
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
        .send({ email: user.email, password: 'unknownPasswordisGood' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('The email and password you entered did not match our records. Please double-check and try again.');
          done();
        });
    });

    it('should reset password if previous password is correct', (done) => {
      agent
        .patch('/api/v1/reset-password')
        .send({ previousPassword: user.password, newPassword: faker.internet.password() })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('string').eql('Successfully Reset Password.');
          done();
        });
    });

    it('should return error if previous password is not correct', (done) => {
      agent
        .patch('/api/v1/reset-password')
        .send({ previousPassword: 'wrongPassword', newPassword: faker.internet.password() })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string').eql('The previous password you entered did not match our records. Please double-check and try again.');
          done();
        });
    });
    describe('User forgot password test', () => {
      it('should send a 404 Error if email doesn\'t exist', (done) => {
        request(app)
          .post('/api/v1/forgot-password')
          .send({ email: 'unknownemail@unknown.com' })
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(404);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string').eql('The email you entered did not match our records. Please double-check and try again.');
            done();
          });
      });

      it('should send a password reset mail', (done) => {
        request(app)
          .post('/api/v1/forgot-password')
          .send({ email: user.email })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(200);
            res.body.should.have.property('data');
            res.body.data.should.be.a('string').eql('We have e-mailed your password reset link');
            done();
          });
      }).timeout(10000);

      it('should reset user password', (done) => {
        const token = generateToken(user, 3600); // ExpiresIn 3600s === 1 day
        request(app)
          .patch(`/api/v1/forgot-password/${token}`)
          .send({ newPassword: faker.internet.password() })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(200);
            res.body.should.have.property('data');
            res.body.data.should.be.a('string').eql('Your password has been reset successfully');
            done();
          });
      });

      it('should return an error when passed non-existing user', (done) => {
        const token = generateToken({ email: 'unknownemail@email.com' }, 3600); // ExpiresIn 3600s === 1 day
        request(app)
          .patch(`/api/v1/forgot-password/${token}`)
          .send({ newPassword: faker.internet.password() })
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(404);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string').eql('The email you entered did not match our records. Please double-check and try again.');
            done();
          });
      });

      it('should return an error when passed an invalid reset token', (done) => {
        request(app)
          .patch('/api/v1/forgot-password/myFakeToken1234')
          .send({ newPassword: faker.internet.password() })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(400);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string').eql('Invalid reset token');
            done();
          });
      });

      it('should return an error when passed expired token', (done) => {
        const token = generateToken(user, -3600); // ExpiresIn -3600s === 1 day before
        request(app)
          .patch(`/api/v1/forgot-password/${token}`)
          .send({ newPassword: faker.internet.password() })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(400);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string').eql('Expired reset link');
            done();
          });
      });
    });

    // logout is secured route which can only be accessed by login user ( agent )
    it('should logout a user if user have login', (done) => {
      agent
        .get('/api/v1/auth/logout')
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });

    it('should return Unauthorized if user have login', (done) => {
      request(app)
        .get('/api/v1/auth/logout')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
