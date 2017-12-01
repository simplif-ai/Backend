//const assert = require('assert');
const app = require('./../app.js');
//const mocha = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
//let json2plain = require('json2plain');
let should = chai.should();

chai.use(chaiHttp);

//Test addcollaborators 
describe('addcollaborators', () => {
  it('You should return success: true', (done) => {
    //the text to send to request
    let req = {
      "noteID": "27",
      "userEmail": "test@gmail.com",
      "colabEmail": "leinam@gmail.com"
    };
    let reqtext = JSON.stringify(req);
    chai.request(app)
      .post('/addcollaborators')
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

//Test getCollaborators 
describe('getcollaborators', () => {
  it('You should return success: true', (done) => {
    //the text to send to request
    let req = {
      "userEmail": "leinam@gmail.com",
      "noteID": "19"
    };
    let reqtext = JSON.stringify(req);
    chai.request(app)
      .post('/getcollaborators')
      .set('content-type', 'text/plain')
      .send(reqtext)
      .end((err, res) => {
        //console.log("error: ", err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        //res.body.should.have.property('colabEmail');
        //res.body.should.have.property('name');
        done();
      });
  });
});

//Test deletecollaborators 
describe('deletecollaborators', () => {
  it('You should return success: true', (done) => {
    //the text to send to request
    let req = {
      "colabEmail": "leinam@gmail.com",
      "noteID": "12"
    };
    let reqtext = JSON.stringify(req);
    chai.request(app)
      .post('/deletecollaborators')
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
