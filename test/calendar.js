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
        "access_token": "ya29.GlwRBdiFTNOR7-eKvicG10ghLS3YAiHGzZAp8GLz6dUsp2zcG8tK8ZWlHlopfAmtivNFBfVnw6nObh6Ryw24LLcdJZOWw4Xte5cvfUG4sg7d4o6ZAY90sC6aSaieAA",
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNmMjI5MTE3MGEzNmUyNTliYmY2NmY1MjE0NjhhZDJjNGU5YTYxZGUifQ.eyJhenAiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEyMTE0NTcyNjY0MzQ5MjQ4MzkiLCJlbWFpbCI6InNkYmxhdHpAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJBZXF5Si1lRzRyX1VVUHB0dkJBZjNRIiwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUxMTgzMDg5OSwiZXhwIjoxNTExODM0NDk5fQ.g3FzZb0kdwdIOpdJxOE7JMQ8WzYpkyCqJ24v2qfeNn9xuigB_3SwZsl-L8kHdEMGhp99D3hbOCIGd52NmnyctkuXr6rhkdKj9ft-320rKYWG7gEy5WgqHHvEvba-DWaCogHZoF1czhfYiukp_f0MN_WR1KUjEJajgU_auIqX3xYVkCkjgM9FeDLNSlbG5UQSP0AOE7uaubgRItTbJZ5oBU3HUZxCp0M2CL40kGcjcKiXTzJyz53r1LQ3r6lBQFf4LbuIB2ReBPt6N7LsvO5qAgdfYbw7BmFz4Ws-_QiAxypFNZXaIexxHz36rEv2m4OOqugZUVjVX8dVzWFCbYdGzw",
        "token_type": "Bearer",
        "expiry_date": 1511834480498
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
        };
    };

    let reqtext = JSON.stringify(req);
    chai.request(app)
    .post('/feedback')
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