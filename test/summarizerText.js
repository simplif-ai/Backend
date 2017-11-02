// const assert = require('assert');
// const app = require('./../app.js')
// const mocha = require('mocha');
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// var json2plain = require('json2plain');
// let should = chai.should();

// chai.use(chaiHttp);

// //Test summarizer api test 
// describe('Summarizer test api', () => {
	
//   it('You should return text', (done) => {
//     //the text to send to request
//     var req = {
//         "text": "Test 1 summarizer api"
//     }
//     var reqtext = JSON.stringify(req);
//     chai.request(app)
//     .post('/summarizertext')
//     .set('content-type', 'text/plain')
//     .send(reqtext)
//     .end((err, res)=>{
//         //console.log("error: ", err);
//         timeout(10000)
//         res.should.have.status(200);
//         res.body.should.be.a('object');
//         res.body.should.have.property('success').eql(true);
//         res.body.should.have.property('text');
//         done();
//     });

//   });
// });
