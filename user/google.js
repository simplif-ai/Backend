/**
 * Google file, houses endpoints for Google logic
 */
module.exports = function (app) {
    var utility = require('./../utility');
    var connection = utility.connection;
    var GoogleAuth = utility.GoogleAuth;
    var hash = utility.hash;
    const googledrive = require('../src/Google/quickstart.js')


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
    //allows the user to create a Google Calendar event
    app.post('/createGoogleEvent', function(req, res) {
       //function createCalendarEvent(token, event, callback) {

        try {
          var body = JSON.parse(req.body);
          var googleToken = body.googleToken;
          var event = body.event;
        } catch (error) {
          res.status(500).send({success: false, eventID: null, error: err});
          return;
        }

        googledrive.createCalendarEvent(googleToken, event, function(success, eventID, error) {
            if (!success || error != null || eventID == null) {
              res.status(500).send({success: false, eventID: null, error: error});
            } else {
              res.status(200).send({success: true, eventID: eventID, error: error});
            }
        });
    });

    /**
    * @param: req = {googleCode}
    * @return: res = {authorizeURL, success, googleToken}
    */
    //allows the user to login to Google API
    app.post('/loginToGoogle', function(req, res) {
      try {
        var body = JSON.parse(req.body);
      } catch (error) {
        res.status(500).send({success: false, error: "No body found"});
        return;
      }

      try {
        var googleCode = body.googleCode;
      } catch (error) {
        res.status(500).send({success: false, error: "No Google code provided"});
        return;
      }

      //if I was given a googleCode, try to create a token out of it
      googledrive.authenticateUser(googleCode, function(success, authorizeURL, googleToken) {
        if (success) {
            res.status(200).send({success:true, googleToken: googleToken});
        } else {
          //return the authorizeURL
            res.status(500).send({success:false, authorizeURL: authorizeURL});
        }
      });
      
    });

    /**
    * Exports the summary to the user's google drive
    * @param: req = {title, text, googleToken}
    * @return: res = {success}
    */
    app.post('/exportToDrive', function (req, res) {
      try {
        var body = JSON.parse(req.body);
        var title = body.title;
        var text = body.text;
        var googleToken = body.googleToken;
      } catch(error) {
          res.status(500).send({success: false, error: error});
          return;
      }

    //(title, text, auth)
      googledrive.upload(title, text, googleToken, function(error, file) {
        if (error) {
          res.status(500).send({fileID: file, error: error});
        } else {
          res.status(200).send({fileID: file.id});
        }
      });
    });

    /**
    * Adds the collaborator to the fileID
    * @param: req = {googleToken, fileID, collaboratorEmail}
    * @return: res = {success, error}
    */
    //function addCollaborator(token, fileId, collaboratorEmail, callback) {
    app.post('/addCollaborator', function (req, res) {
      try {
        var body = JSON.parse(req.body);
        var fileID = body.fileID;
        var collaboratorEmail = body.collaboratorEmail;
        var googleToken = body.googleToken;
      } catch(error) {
          res.status(500).send({success: false, error: error});
          return;
      }

      //TODO: store the collaborator's email in our database
      googledrive.addCollaborator(googleToken, fileID, collaboratorEmail, function(error) {
        if (error != null) {
          res.status(200).send({success: true});
        } else {
          res.status(500).send({success: false, error: error});
        }
      });
    });

    /**
    * Gets the Google profile picture thumbnail
    * @param: req = {googleToken, email}
    * @return: res = {error?, profilePictureURL}
    */
    app.post('/getGoogleProfilePicture', function (req, res) {
       try {
        var body = JSON.parse(req.body);
        var email = body.email;
        var googleToken = body.googleToken;
      } catch(error) {
          res.status(500).send({success: false, error: error});
          return;
      }

      googledrive.getProfilePicture(googleToken, email, function(err, url) {
        console.log(url);
          if (err != null) {
            res.status(500).send({error: err});
          } else {
            res.status(200).send({error: null, profilePictureURL: url});
          }
      });
    });

    /**
    * Creates a folder inside the base Simplif.ai folder
    * @param: req = {name, googleToken}
    * @return: res = {success, error?}
    */
    app.post('/createFolder', function (req, res) {
     try {
        var body = JSON.parse(req.body);
        var name = body.name;
        var googleToken = body.googleToken;
      } catch(error) {
          console.log(error);
          res.status(500).send({success: false, error: error});
          return;
      }

    //(name, token, callback) 
      googledrive.createFolder(name, googleToken, function(err, fileID) {
        if (err) {
          res.status(500).send({fileID: fileID, error: err});
        } else {
          res.status(200).send({fileID: fileID});
        }
      });
    });
}