/**
 * midlle ware to connect frontend with api for summarizer
 * creates all dependencies and endpoints
 * Author: Lena Arafa
 * Date: 9/24/2017
 */

//List dependencies
const express = require('express');
const app = express();
const parseurl = require('parseurl');
const bodyparser = require('body-parser');
const path = require('path');
//const expressValidator = require('express-validator');
const request = require('request');

//add dependencies for database
//setup database

//parse application/JSON
app.use(bodyparser.json());

// enable cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//User endpoint
//Forget passowrd mailto endpoint

//this is a mock api to test the fuctionality of the
//middleware function
app.get('/mocktext', function(req, res) {
    var mock = "Hi this is Lena's mock text";
    var json = {
        'text': mock
    }
        var options = {
        url: 'http://localhost:8000/sumarizertext',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }
    request.post(options, function(error, response, body){
        res.send(JSON.parse(body));
    })
})

//Text endpoint; text sumbitted by user is handled here
//It is then sent to the summarizer api and the data received
//is sent back to the user
app.post('/sumarizertext', function(req, res){
    //url subject to change once api is created
    var summarizerApi = "https://ir.thirty2k.com/summarize";
    var options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body),
        method: 'POST'
    }

    //send the text received from user to api of summarizer
    //get for testing reasons, use post when using summarizer api url
    request.post(summarizerApi, options, function(error, response, body) {
        //recives data from summarizerAPI
        //sends it back to the summarizertext endpoint which would be the
        //body response to any request that posts a request to it
        //uses json to send a stringfied json object of the non-object data from api
        console.log('statusCode',response.statusCode);
        if (!error && response.statusCode === 200) {
          res.send(response.body);
        } else {
          res.send({ success: false, error: error });
        }
    });
});

//another request to get the saved version from the user of the summarizer text
//and send it to db
app.post('/savetodb', function(req, res) {
    //sends to db
})

//Google authentication setup
var GoogleAuth; // Google Auth object.
function initClient() {
  gapi.client.init({
      'apiKey': 'ON6JuWU0xirbexXJ3H2a7wYq',
      'clientId': '950783336607-ouratd1dt1hr3baond6u36664ijrmjnq.apps.googleusercontent.com',
      'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
  }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      setSigninStatus();

    });
}

function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
      //set something about being authorized
    } else {
      //let the user know they're not authorized
    }
  }

//login endpoint
//allows the user to login with google authentication
app.post('/login', function(req, res)) {
	if (GoogleAuth.isSignedIn.get()) {
		//user is already signed in!
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
}


//allows the user to change their password
app.post('/changePassword', function(req, res)) {
	//talk to database here once Lena has imported it
}

app.post('/deleteAccount', function(req,res)) {
	//delete the user data and all of the data it points to
}

//create account endpoint
//lets the user create an account without google authentication
app.post('/createAccount', function(req, res)) {


}

app.listen('8000');
console.log('Listening on port ' + 8000 + '...');
