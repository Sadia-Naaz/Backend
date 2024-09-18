const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); // Ensure your server exports app
const User = require('../models/User');
const { expect } = chai;

chai.use(chaiHttp);

describe('Authentication', () => {
  before(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', (done) => {
    chai.request(server)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should login a user', (done) => {
    chai.request(server)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });
});

describe('Queue Management', () => {
  it('should enqueue a request', (done) => {
    chai.request(server)
      .post('/enqueue')
      .set('Authorization', 'Bearer <token>') // Replace with valid token
      .send({ userId: 1, message: 'Test request' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('msg', 'Request enqueued successfully');
        done();
      });
  });
});
