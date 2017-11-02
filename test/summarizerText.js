//const assert = require('assert');
const app = require('./../app.js')
//const mocha = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
//let json2plain = require('json2plain');
let should = chai.should();

chai.use(chaiHttp);

//Test summarizer api test 
describe('Summarizer test api', () => {
	
  it('You should return text', (done) => {
    //the text to send to request
    let req = {
      "text": "Test 1 summarizer api"
    };
    let reqtext = JSON.stringify(req);
    chai.request(app)
    .post('/summarizertext')
    .set('content-type', 'text/plain')
    .send(reqtext)
    .end((err, res)=>{
        //console.log("body: ", res.text);
      let textjson = JSON.parse(res.text);
        //setTimeout(done, 100000);
      res.should.have.status(200);
      textjson.should.be.a('object');
      textjson.should.have.property('success').eql(true);
      textjson.should.have.property('text');
      done();
    });

  });
});
