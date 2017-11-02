//const assert = require('assert');
const app = require('./../app.js');
//const mocha = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
//let json2plain = require('json2plain');
let should = chai.should();

chai.use(chaiHttp);

//Test addcollaborators 
describe('addCollaborators', () => {
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
