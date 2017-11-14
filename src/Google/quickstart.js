var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
const express = require('express');
const googledrive = express();
const async = require('async');
const request = require('request');
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
// 'https://www.googleapis.com/auth/plus.profiles.read'
//https://www.googleapis.com/auth/plus.me
//'https://www.googleapis.com/auth/drive', 
var SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/plus.profiles.read'];
var TOKEN_DIR = './src/Google/' + (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

function authenticateUser(code, callback) {
  // Load client secrets from a local file.
  fs.readFile('./src/Google/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      return;
    }

    // Authorize a client with the loaded credentials, then call the
    // Drive API.
    authorize(JSON.parse(content), code, callback);
  });
}


/**
* Call the Google API profile picture endpoint and return the URL to the profile picture
*/
function getProfilePicture(token, emailAddress, callback) {

  //https://www.google.com/m8/feeds/contacts/default/thin?q=EMAIL_ADDRESS_HERE


  //var addr = 'https://www.googleapis.com/admin/directory/v1/users/userKey/photos/thumbnail'
  //var addr = 'https://www.googleapis.com/plusDomains/v1/people/sdblatz@gmail.com'
  var addr = 'http://picasaweb.google.com/data/entry/api/user/' + emailAddress + '?alt=json'
  //var addr = 'https://www.google.com/m8/feeds/contacts/default/thin?q=sdblatz@gmail.com'
  getOauth(token, function (auth) {
    //"Content-Type: application/json" -H "Authorization: OAuth$ACCESS_TOKEN"

    /*
    request({
      //https://www.googleapis.com/oauth2/v1/tokeninfo

      //https://www.googleapis.com/plusDomains/v1/people/me
      uri: 'https://www.googleapis.com/plusDomains/v1/people/me',
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth.credentials
        }
    }, function(error, response, body) {
        console.log(error)
        //console.log(response);
        console.log(body);
    });
    */

    
    request(addr, function(error, response, body) {
      var body = JSON.parse(body);
      var url = body.entry.gphoto$thumbnail.$t;

      callback(error, url)
    });
    
  });
  
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, code, callback) {
  var clientSecret = credentials.client_secret;
  var clientId = credentials.client_id;
  var redirectUrl = credentials.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  oauth2Client.key = credentials.key;
  getNewToken(oauth2Client, code, callback);
}

function getOauth(token, callback) {
  fs.readFile('./src/Google/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      return;
    }

      var credentials = JSON.parse(content);
      var clientSecret = credentials.client_secret;
      var clientId = credentials.client_id;
      var redirectUrl = credentials.redirect_uris[0];
      var auth = new googleAuth();
      var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
      oauth2Client.credentials = token;
      //console.log(oauth2Client);
      callback(oauth2Client);
  });
 
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

  if (code == "") {
    //just return the url we need to get the code
    callback(false, authUrl, "");
  } else {
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          return;
        }
        oauth2Client.credentials = token;
        callback(true, null, token);
        //storeToken(token);
        //callback(oauth2Client);
      });
  }
}

/**
* Create the given folder inside of the base Simplif.ai folder
*/
function createFolder(name, token, callback) {
  //always create folders inside the base 'simplif.ai folder'
  getSimplifaiFolder(token, function(err, folder) {

    if (err) {
      callback(err, null);
    } else {
        var drive = google.drive('v2');

        getOauth(token, function (auth) {

          var fileMetadata = {
            'title': name,
            parents: [{id: folder}],
            'mimeType': 'application/vnd.google-apps.folder'
          };

          drive.files.insert({
            auth: auth,
            resource: fileMetadata,
            fields: 'id'
          }, function (err, file) {
            if (err) {
              // Handle error
              callback(err, null);
            } else {
              callback(null, file);
            }
          });
      });
    }
  }); 
}

/**
* Adds a collaborater to the given summary file
*/
function addCollaborator(token, fileId, collaboratorEmail, callback) {
    var drive = google.drive('v3');
    getOauth(token, function (auth) {
      var permissions = [
        {
          'type': 'user',
          'role': 'writer',
          'emailAddress': collaboratorEmail
        }
      ];
      // Using the NPM module 'async'
      async.eachSeries(permissions, function (permission, permissionCallback) {
        drive.permissions.create({
          resource: permission,
          auth: auth,
          fileId: fileId,
          fields: 'id',
        }, function (err, res) {
          if (err) {
            // Handle error...
            permissionCallback(err);
          } else {
            permissionCallback();
          }
        });
      }, function (err) {
        if (err) {
          // Handle error
          callback(err);
        } else {
          callback(null)
          // All permissions inserted
        }
      });
    });
}

/**
* Retrieves the folder ID of Simplif.ai base folder and creates it if it doesn't exist
*/
function getSimplifaiFolder(token, callback) {
  getOauth(token, function (auth) {
    var pageToken = null;
    var drive = google.drive('v3');

    var pageToken = null;
    var results = [];
    // Using the npm module 'async'
    async.doWhilst(function (callback) {
      drive.files.list({
        q: "name='Simplif.ai' and mimeType='application/vnd.google-apps.folder'",
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
        auth: auth,
        pageToken: pageToken
      }, function (err, res) {
        if (err) {
          // Handle error
          callback(err)
        } else {
          res.files.forEach(function (file) {
            results.push(file.id);
          });
          pageToken = res.nextPageToken;
          callback();
        }
      });
    }, function () {
      return !!pageToken;
    }, function (err) {
      if (err) {
        // Handle error
        callback(err);
      } else {
        // All pages fetched
        if (results.length == 0) {
          //make the folder...
          createSimplifaiFolder(token, function(fileID, err) {
              if (err) {
                callback(err, "");
              } else {
                callback("", fileID);
              }
          });
        } else {
          //return simplif.ai folder
          callback("", results[0]);
        }
      }
    }); 
  });
}

/**
* Creates the base Simplif.ai folder where all notes are contained
*/
function createSimplifaiFolder(token, callback) {
    var drive = google.drive('v2');

    getOauth(token, function (auth) {
    var fileMetadata = {
      'title': 'Simplif.ai', 
      'mimeType': 'application/vnd.google-apps.folder'
    };

    drive.files.insert({
      auth: auth,
      resource: fileMetadata,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        callback(null, err)
      } else {
        callback(file.id, null)
      }
    });
  });
}

/**
* Upload the given summary to the user's google drive account
*/
function upload(title, text, token, callback) {
  getOauth(token, function (auth) {
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
          callback(err, null);
          // Handle error
        } else {
          callback(null, file)
        }
      });
  }); 
}

module.exports = {
  "googledrive": googledrive,
  "authenticateUser": authenticateUser,
  "upload": upload,
  "createFolder": createFolder,
  "addCollaborator": addCollaborator,
  "getProfilePicture": getProfilePicture
}