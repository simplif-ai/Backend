const assert = require('assert');
const app = require('./../app.js');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);


describe('Calendar Endpoint', () => {
    /**
    * @param: req = {googleToken, event}
    * an event object should follow this format: 
      var event = {
          'summary': 'Google I/O 2015',
          'location': '800 Howard St., San Francisco, CA 94103',
          'description': 'A chance to hear more about Google\'s developer products.',
          'start': {
            'dateTime': '2015-05-28T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles',
          },
          'end': {
            'dateTime': '2015-05-28T17:00:00-07:00',
            'timeZone': 'America/Los_Angeles',
          },
          'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
          ],
          'attendees': [
            {'email': 'lpage@example.com'},
            {'email': 'sbrin@example.com'},
          ],
          'reminders': {
            'useDefault': false,
            'overrides': [
              {'method': 'email', 'minutes': 24 * 60},
              {'method': 'popup', 'minutes': 10},
            ],
          },
        };
    * @return: res = {success, eventID, err?}
    */

  it('Should return success and an eventID when parameters are correct', (done) => {
    //the text to send to request
    let req = {
     "googleToken": {
        "access_token": "ya29.GlwVBZWktuY6zaPMjCaKKM1ey0hs78zQU37JkLemi_qR23maayoZGRnQvc6Xe97raJLBvL0dgs6sgk760W_j-SyHacc4aCyp2eCCO16-nEzrwb4VBvk5RahbkFLXiA",
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjkwM2VkMTIwOTRkNjk3MGEzNDNiOWY5MzAzZjU0Nzg5MGE1NTFmZTgifQ.eyJhenAiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEyMTE0NTcyNjY0MzQ5MjQ4MzkiLCJlbWFpbCI6InNkYmxhdHpAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJuMW41Mll2ZXAydDZWQjhmMXU3RjJnIiwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUxMjE3MTkxNywiZXhwIjoxNTEyMTc1NTE3fQ.E5pYXPc2z1hOoduRS77gYTYVaETRYiqLaRrkLlp5_1LjZZVkVTPt1OnI6FXw2rzGPsF17aEhLdk7acecN5ksgdV6_0BKheJ8X_XHOJ0nX7fQrGcbyaPR5FCakXv-N62PNUPCHXtgTB8ULu2tPQqxmuhagGDHlCSM5q3RqaDmX7xNOfFu_tyDmc6NuIB6Zugfq1XilubD1R4-MTnrCeVWI3yheJ9ZnzRzM_rDWB8AecrOZeG9CHj-Gbk8eLJD1CVFATYjiZr9SlQi_-3k88EXpA0Z0Bs_rknnKTjK_StDFutOWpl5bhideHNwXXXUzGexWmxHl9OsmZpRH7tvfbXmKQ",
        "token_type": "Bearer",
        "expiry_date": 1512175508186
    },
      "event" : {
            "summary": "Example Event from Simplif.ai",
            "description": "This is an example!",
            "start": {
              "dateTime": "2017-11-28T09:00:00-07:00",
              "timeZone": "America/Indianapolis"
            },
            "end": {
              "dateTime": "2017-11-28T17:00:00-07:00",
              "timeZone": "America/Indianapolis"
            }
        }
    };

    let reqtext = JSON.stringify(req);
    chai.request(app)
    .post('/createGoogleEvent')
    .set('content-type', 'text/plain')
    .send(reqtext)
    .end((err, res)=>{
        //console.log("error: ", err);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('eventID');
      res.body.should.have.property('success').eql(true);
      done();
    });

  });

  it("Should return false when token not possed in", (done) => {
    //the text to send to request
    let req = {
      "event" : {
            "summary": "Example Event from Simplif.ai",
            "description": "This is an example!",
            "start": {
              "dateTime": "2017-11-28T09:00:00-07:00",
              "timeZone": "America/Indianapolis"
            },
            "end": {
              "dateTime": "2017-11-28T17:00:00-07:00",
              "timeZone": "America/Indianapolis"
            }
        }
      };
    let reqtext = JSON.stringify(req);
    chai.request(app)
    .post('/createGoogleEvent')
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