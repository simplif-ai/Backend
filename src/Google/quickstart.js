var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
const express = require('express');
const googledrive = express();
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/drive'];
var TOKEN_DIR = './src/Google/' + (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

function authenticateUser(code, callback) {
  // Load client secrets from a local file.
  fs.readFile('./src/Google/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }

    // Authorize a client with the loaded credentials, then call the
    // Drive API.
    authorize(JSON.parse(content), code, callback);
  });
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, code, callback) {
  console.log('inside authorize');
  var clientSecret = credentials.client_secret;
  var clientId = credentials.client_id;
  var redirectUrl = credentials.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  getNewToken(oauth2Client, code, callback);
  

  /*
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    //force get a new token:
    //getNewToken(oauth2Client, callback);
    
    //if the user is not authenticated, we need to tell Audrey to get them a new token:
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
    
  });
  */
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, code, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });

  console.log('code is: ' + code);
  if (code == "") {
    //just return the url we need to get the code
    callback(false, authUrl, "");
  } else {
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        callback(true, "", token);
        //storeToken(token);
        //callback(oauth2Client);
      });
  }



  
  /*
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      //callback(oauth2Client);
    });
  });
  */
}

//endpoint for uploading text
googledrive.post('/exportToDrive', function (req, res) {
  console.log('in google drive post');
});

/**
* Upload the given summary to the user's google drive account
*/
function upload(title, text, auth) {
  var drive = google.drive('v2');
  var fileMetadata = {
    'title': title,
    'mimeType': 'application/vnd.google-apps.document'
  };
  var media = {
    mimeType: 'text/plain',
    body: text
  };
  drive.files.insert({
    auth: auth,
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File Id:', file.id);
    }
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  var service = google.drive('v2');
  service.files.list({
    auth: auth,
    maxResults: 10,
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }

    upload('Lit af fam.', auth);
    var files = response.items;
    if (files.length == 0) {
      console.log('No files found.');
    } else {
      console.log('Files:');
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log('%s (%s)', file.title, file.id);
      }
    }
  });
}

module.exports = {
  "googledrive": googledrive,
  "authenticateUser": authenticateUser
}