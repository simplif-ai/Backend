//const assert = require('assert');
const app = require('./../app.js');
//const mocha = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
//let json2plain = require('json2plain');
let should = chai.should();

chai.use(chaiHttp);

//Test addfeedback 
describe('addfeedback', () => {
  it('You should return success: true', (done) => {
    //the text to send to request
    let req = {
      "email": "leinam@gmail.com",
      "feedback": "Hello world!!"
    };
    let reqtext = JSON.stringify(req);
    chai.request(app)
      .post('/addfeedback')
      .set('content-type', 'text/plain')
      .send(reqtext)
      .end((err, res) => {
        //console.log("error: ", err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        done();
      });

  });
});

//Test viewfeedback 
describe('viewfeedback', () => {
    it('You should return success: true', (done) => {
      //the text to send to request
      let req = {};
      let reqtext = JSON.stringify(req);
      chai.request(app)
        .post('/viewfeedback')
        .set('content-type', 'text/plain')
        .send(reqtext)
        .end((err, res) => {
          //console.log("error: ", err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('userID');
          res.body.should.have.property('name');
          res.body.should.have.property('feedback');
          done();
        });
    });
  });

  //Test emailReminder 
describe('emailReminder', () => {
    it('You should return success: true', (done) => {
      //the text to send to request
      let req = {
        "email": "leinam@gmail.com",
        "dataString": "2017/11/30 01:43:00",
        "message": "This is a reminder"
      };
      let reqtext = JSON.stringify(req);
      chai.request(app)
        .post('/emailReminder')
        .set('content-type', 'text/plain')
        .send(reqtext)
        .end((err, res) => {
          //console.log("error: ", err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          done();
        });
  
    });
  });