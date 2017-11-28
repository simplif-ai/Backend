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
        "access_token": "ya29.GlwSBZwV4eFhH6-YMsOYy-OH8-a9iz0xemuxF8gpigt26AVweVhihCV8CXiRNUC4rJKgB019Gdzv34DVjwiWAMVz5RohoT_F8EcN7NWLlTvoek_e5ck0b2bUruXteQ",
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVlM2I5MzgxMGY2OTQzZWFiYmI3N2Q1ZTJjMzM1ODRlZGU3NjZjZGMifQ.eyJhenAiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEyMTE0NTcyNjY0MzQ5MjQ4MzkiLCJlbWFpbCI6InNkYmxhdHpAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiI3VUZMWUM1ZVpUd1c0Rm9UN0ZITndRIiwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUxMTg4NDY4NCwiZXhwIjoxNTExODg4Mjg0fQ.AWSMtsncm6BGhEknrpCAmRmcdMt5QSeJgkotryLN51DedjRP_NZTd3Eigh3UIaYMDscJO3QiXmH6jJnbLty2rSzMAsU5JaGfFv2lXl8NnTWi1sLu6VDCf6EhNapXMka7kkjVkTizZFQWvvvSGNoLENxVgKMCR6OIbeAJ9g2-4-s1AL7ckLW6aMMZ4iq27wGJMKmQQTicmEddhuUuW8-unwvCsIh2atBNrcuQrLsvyjGIf6yIxS6YX8xPYSqE1ciOJJsOMlYJY_XNyJUOBvNmZvtnEzlLiwY-e5TQEkcxneuYAgeCoW_enrOqRggNCJz35FsMKCDxEIaBPLCUT4olew",
        "token_type": "Bearer",
        "expiry_date": 1511888272466
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