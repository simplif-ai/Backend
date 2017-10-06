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
const mysql = require('mysql');
const nodemailer = require ('nodemailer');

//setup database
var connection = mysql.createConnection({
    host: 'simplifai.caijj6vztwxw.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'mGLPkLat3W^y9w[w',
    port: '3306'
});

//parse application/JSON
app.use(bodyparser.json());


//this is a mock api to test the fuctionality of the
//middleware function
app.get('/mocktext', function (req, res) {
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
   // res.send(options.body);
    request.post(options, function (error, response, body) {
        //console.log(body);
        res.send(JSON.parse(body));
    })
});

//Text endpoint; text sumbitted by user is handled here
//It is then sent to the summarizer api and the data received
//is sent back to the user
app.post('/sumarizertext', function (req, res) {
    //url subject to change once api is created
    var summarizerApi = "https://ir.thirty2k.com/summarize";
    var options = {
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    }

    //send the text received from user to api of summarizer
    //get for testing reasons, use post when using summarizer api url
    request.post(summarizerApi, options, function (error, response, body) {
        //recives data from summarizerAPI
        //sends it back to the summarizertext endpoint which would be the
        //body response to any request that posts a request to it
        //uses json to send a stringfied json object of the non-object data from api
        console.log('statusCode', response.statusCode);
        if (!error && response.statusCode === 200) {
            res.send(body);
          } else {
            res.send({ success: false, error: error });
          }
    })
});

//another request to get the saved version from the user of the summarizer text
//and send it to db
app.post('/savetodb', function (req, res) {
    connection.connect(function (err) {
        if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
        }
        console.log('Connected to database.');
        var sql = "ALTER TABLE User ADD COLUMN summary STRING AUTO_INCREMENT PRIMARY KEY";
        connection.query(sql, function(err, result){
            if(err) {
                console.error('Error with adding summary column');
            } else {
            	console.log('Table Altered');
            }

            sql = "INSERT INTO Users (summary) VALUES ("+req.body+")";
        })
        connection.query(sql, function(err, result){
            if(err) {
                console.error('Error with instering summary in table');
            }
            console.log('summary record inserted');
        })
    })
    connection.end();
});

//request to receive forget password post and send an email to user
app.post('/mailto', function (req, res) {
    //get email of user from db
    //receive email and link to reset?
    var email;
    // connection.connect(function (err) {
    //     if (err) {
    //         console.error('Database connection failed: ' + err.stack);
    //         return;
    //     }
    //     console.log('Connected to database.');
    //         sql = "SELECT email FROM Users where idUser = ";
    //     connection.query(sql, function(err, result, fields){
    //         if(err) {
    //             console.error('Error with retrieving email from table');
    //         }
    //         email = result;
    //         console.log('email retreived');
    //     })
    // })
    // connection.end();

     //send email
    //text has the paramter url of connecting to the page for resetting password
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'simplif.ai@gmail.com',
          pass: 'simplif.ai2017'
        }
      });
    var mailOptions = {
        from: 'simplif.ai@gmail.com',
        to: email,
        subject: 'Reset password to Simplif.ai', 
        text: req.param.url
    }

    transporter.sendMail(mailOptions, function(error, infor){
        if(error) {
            console.log('error sending email for resetting password');
        }
        else {
            console.log('Email sent: ' + req.param.url);
        }
    })
    
});


/**
**These are the Google Authentication methods which we use in ordre to authenticate a user with if they don't have an account.
**/
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
};

function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
      //set something about being authorized
    } else {
      //let the user know they're not authorized
    }
  };


//login endpoint
//allows the user to login with google authentication
app.post('/login', function(req, res) {
	if (GoogleAuth.isSignedIn.get()) {
		//user is already signed in!
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
});

//this endpoint allows the user to change their password in the database.
app.post('/changePassword', function(req, res) {
	//talk to database here once Lena has imported it
});

//this endpoint will send an email to the email passed in using the mailer. The email will contain a link so the user can reset their password
app.post('/resetPassword', function(req, res) {
	//use mailer to send email to the email address passed in.

});

//this endpoint deletes the user from the database and removes all data associated with them.
app.post('/deleteAccount', function(req,res) {
	//delete the user data and all of the data it points to
});

//lets the user create an account without google authentication by using our database instead.
app.post('/createAccount', function(req, res) {

});

app.listen('8000');
console.log('Listening on port ' + 8000 + '...');





