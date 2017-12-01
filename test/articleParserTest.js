//const assert = require('assert');
const app = require('./../app.js');
//const mocha = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
//let json2plain = require('json2plain');
let should = chai.should();

chai.use(chaiHttp);

//Test addcollaborators 
describe('Article Parsing Endpoint', () => {
  it('When a valid URL is passed in, the summarized text should be returned', (done) => {
    //the text to send to request
    let req = {
      "URL": "http://www.bbc.com/news/world-us-canada-42159139"
    };
    let reqtext = JSON.stringify(req);
    chai.request(app)
      .post('/parseURL')
      .set('content-type', 'text/plain')
      .send(reqtext)
      .end((err, res) => {
        let textjson = JSON.parse(res.text);
        console.log(textjson);
        console.log(textjson.success);
        res.should.have.status(200);
        textjson.should.be.a('object');
        textjson.should.have.property('success').eql(true);
        textjson.should.have.property('text');
        done();
      });

  });

  it('When an invalid URL is passed in, the summarizer should fail', (done) => {
    //the text to send to request
    let req = {
      "URL": ""
    };
    let reqtext = JSON.stringify(req);
    chai.request(app)
      .post('/parseURL')
      .set('content-type', 'text/plain')
      .send(reqtext)
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });

  });
});
