const app = require('./../app.js');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

//Test resetPassword  
describe('Prefers Email Updates', () => {
	
  it('Should return true when a user is given', (done) => {
    //the text to send to request
    let req = {
      "userID": "61",
      "prefersEmailUpdates": "0"
    };
    let reqtext = JSON.stringify(req);
    chai.request(app)
    .post('/prefersEmailUpdates')
    .set('content-type', 'text/plain')
    .send(reqtext)
    .end((err, res)=>{
        //console.log("error: ", err);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
      done();
    });

  });

  it('Should return false when a user is not given', (done) => {
    //the text to send to request
    let req = {
      "userID": "-1",
      "prefersEmailUpdates": "0"
    };
    let reqtext = JSON.stringify(req);
    chai.request(app)
    .post('/prefersEmailUpdates')
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
});
