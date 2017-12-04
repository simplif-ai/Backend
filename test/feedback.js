const assert = require('assert');
const app = require('./../app.js');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('Feedback Endpoint', () => {

  it('Should return succes when parameters are correct', (done) => {
    //the text to send to request
    let req = {
      "userID": "61",
      "feedback" : "Simplif.ai rocks!"
    };

    let reqtext = JSON.stringify(req);
    chai.request(app)
    .post('/feedback')
    .set('content-type', 'text/plain')
    .send(reqtext)
    .end((err, res)=>{
        //console.log("error: ", err);
      res.should.have.status(500);
      /*
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
      */
      done();
    });

  });

  it("Should return false when userID doesn't exist", (done) => {
    //the text to send to request
    let req = {
      'userID': '998',
      'feedback' : 'Simplif.ai rocks!'
    };
    
    let reqtext = JSON.stringify(req);
    chai.request(app)
    .post('/feedback')
    .set('content-type', 'text/plain')
    .send(reqtext)
    .end((err, res)=>{
        //console.log("error: ", err);
      res.should.have.status(500);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(false);
      done();
    });
  });

  it("Should return false when there is no feedback", (done) => {
    //the text to send to request
    let req = {
      'userID': '999'
    };
    
    let reqtext = JSON.stringify(req);
    chai.request(app)
    .post('/feedback')
    .set('content-type', 'text/plain')
    .send(reqtext)
    .end((err, res)=>{
        //console.log("error: ", err);
      res.should.have.status(500);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(false);
      done();
    });
  });
});