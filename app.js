/**
 * midlle ware to connect frontend with api for summarizer
 * creates all dependencies and endpoints
 * Author: Lena Arafa
 * Date: 9/24/2017
 */

//List dependencies
//var bcrypt = require('bcrypt');
//const saltRounds = 10;

var config = require('./config');
const express = require('express');
const app = express();
const parseurl = require('parseurl');
const bodyparser = require('body-parser');
const path = require('path');
//const expressValidator = require('express-validator');
const request = require('request');
const mysql = require('mysql');
const nodemailer = require ('nodemailer');

var jwt = require('jsonwebtoken');
app.set('superSecret', config.secret); // secret variable


//setup database
var connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database : process.env.RDS_DB_NAME
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyparser.text());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// enable cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
})


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
    });
});

//Slackbot endpoint

app.post('/slack/events', function (req, res) {
  res.send(JSON.parse(req.body).challenge);
});


//Text endpoint; text sumbitted by user is handled here
//It is then sent to the summarizer api and the data received
//is sent back to the user
app.post('/summarizertext', function (req, res) {
    //url subject to change once api is created
    console.log('req.body', JSON.parse(req.body));
    const body = JSON.parse(req.body);
    var summarizerApi = "https://ir.thirty2k.com/summarize";
    var options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        method: 'POST'
    }

    //send the text received from user to api of summarizer
    //get for testing reasons, use post when using summarizer api url
    request.post(summarizerApi, options, function (error, response, body) {
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

/**another request to get the saved version from the user of the summarizer text
**and send it to db
**could send noteID in response here if needed for frontend?
**the body contains user's email, text: {email, text}
**/
app.post('/savesummary', function (req, res) {
    /*connection.connect(function (err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    */
    console.log('Connected to database.');
    console.log("body: ", req.body);
    var body = JSON.parse(req.body);
    var userEmail = body.email;
    var text = body.text;
    var name = text.substring(0, 15);
    var datetime = new Date();

    //get full text, summary,
    connection.query("SELECT * FROM users WHERE email = ?",[userEmail], function(err, result) {
      if (err) {
			  res.status(500).send({ success: false, error: err });
		  }
      else {
  			console.log("Obtained userId from user email");
  			var id = result[0].idUser;
  			console.log("userId:", id);
  			//Add a column for new summarited text in note
  			//noteText is when a request made to save user's notes
  			var note = {
  				name: name,
  				dateRecorded: datetime,
  				noteText: null,
  				userID: id
  			};
    		console.log("note: ", note);
		    connection.query("INSERT INTO notes SET ?", [note], function (err, result) {
			    console.log("goes in here");
  				if (err) {
  					res.status(500).send({ success: false, error: err });
  				}
  				else {
  					console.log("created row in the notes table");
  					//add a summary row for the new summarized text
  					console.log("noteID:" + result.insertId);
  					var noteID = result.insertId;
  					var newSumm = {
  						summarizedText: text,
  						noteID: noteID
  					};
  					connection.query('INSERT INTO summaries SET ?', [newSumm], function(err, result) {
  						console.log("inside insert");
  						if (err) {
  							res.status(500).send({success: false, error: err});
  						} else {
  							res.status(200).send({success: true});
  						}
            });
          }
        });
      }
    });
});

/**
 * Delete summary from notes and summary table
 * The frontend will have the noteID when the view for summaries list endpoint and logic
 * is implemented, then from the view of summaries the user could delete a summary
 */
app.post('/deletesummary', function(req, res){
	var email = req.email;
	var noteID = req.noteID;

	//delete all the summaries with the given noteID
	connection.query("DELETE FROM summaries WHERE noteID = ?", [noteID], function(err, result) {
		if (err) {
			console.log("Couldn't delete summary");
			res.status(500).send({ success: false, error: err });
		}
		else {
			res.status(200).send({success: true});
		}
	});
	//delete the actual note with the given noteID
	connection.query("DELETE FROM notes WHERE noteID = ?", [noteID], function(err, result) {
		if (err) {
			console.log("Couldn't delete note");
			res.status(500).send({ success: false, error: err });
		}
		else {
			res.status(200).send({success: true});
		}
	});

});

/**
*** These are the Google Authentication methods which we use in ordre to authenticate a user with if they don't have an account.
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
app.post('/loginToGoogle', function(req, res) {
  if (GoogleAuth.isSignedIn.get()) {
    //user is already signed in!
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }

    var token = jwt.sign(payload, "secretString", {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
  });

  res.status(200).send({ success: true, token: token});

    //return JWT token
});

app.post('/login', function(req, res) {
  //login without google API
  //email and password given
  try {
    var user = JSON.parse(req.body);
  } catch (error) {
    res.status(500).send({ success: false, error: err });
  }

  var email = user.email;
  var password = user.password;
  var hashedPassword = hash(password);

  //scrypt.kdf(password, )
  //check hashed password against database:
  connection.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, hashedPassword], function (err, result) {
    if (err) {
      res.status(500).send({ success: false, error: err });
    } else {
      console.log(result);
      const payload = {
        admin: email
      };

      var token = jwt.sign(payload, app.get('superSecret'), {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
      });

      if (result.length == 1) {
        //do JWT stuff
        res.status(200).send({ success: true, token: token});
      } else {
        res.status(500).send({ success: false, error: "Username or password is incorrect."});
      }
    }
  });
});

//this endpoint allows the user to change their password in the database.
app.post('/changePassword', function(req, res) {

  try {
    var user = JSON.parse(req.body);
  } catch (error) {
    res.status(500).send({ success: false, error: err });
  }

  var email = user.email;
  var password = user.password;
  var newPassword = user.newPassword;

  connection.query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
    if (err) {
      console.log("err");
      res.status(500).send({ success: false, error: err });
    } else {
      console.log("Not err");
      console.log(result);
      if (result.length == 1) {
        console.log("count is 1");
        //bcrypt.hash(newPassword, saltRounds, function(err, hash) {
        var hashedPassword = hash(password);

          connection.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], function (err, result) {
            if (err) {
              console.log("err 2");
              res.status(500).send({ success: false, error: error });
            } else {
              console.log("Success!");
              res.status(200).send({ success: true});
            }
          })
        //});
      } else {
        res.status(500).send({ success: false, error: "User not found." });
      }
    }
  })
});

//this endpoint will send an email to the email passed in using the mailer. The email will contain a link so the user can reset their password
app.post('/resetPassword', function(req, res, next) {
    //use mailer to send email to the email address passed in.
    //console.log(req);
   // console.log(JSON.parse(req.body));
    try {
      var user = JSON.parse(req.body);
    } catch (error) {
      res.status(500).send({ success: false, error: err });
    }
    var email = user.email;
    var url = 'http://localhost:3000/password-reset?email=' + email;
    var transporter = nodemailer.createTransport({
        service: 'GMAIL',
        auth: {
          user: 'simplif.ai17@gmail.com',
          pass: 'simplif.ai2017'
        }
      });
      console.log(transporter);
    var mailOptions = {
        from: 'simplif.ai17@gmail.com',
        to: email,
        subject: 'Reset password to Simplif.ai',
        text: url,
        html: '<p>' +url + '</p>'
    }
    console.log(mailOptions.html);
    transporter.sendMail(mailOptions, function(error, info){
        console.log(error);
        console.log(info);
        if(error) {
            console.log('error sending email for resetting password');
        }
        else {
            console.log('Email sent: ' + req.param.url);
        }
        nodemailer.getTestMessageUrl(info);
        transporter.close();
    });


});

//this endpoint deletes the user from the database and removes all data associated with them.
app.post('/deleteAccount', function(req,res) {
	//deep delete the user data and all of the data it points to
	var user = JSON.parse(req.body);
	var email = user.email;


	//get the user ID from the email address:
	connection.query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
		if (err) {
			res.status(500).send({ success: false, error: error });
		} else {
			console.log("inside user");
			var id = result[0].idUser;
			//query notes for all with this userID:
			connection.query("SELECT * FROM notes WHERE userID = ?", [id], function (err, result) {
				if (err) {

				} else {
					console.log("inside notes");
					for (var i = 0; i < result.length; i++) {
						console.log("inside for loop");
						//delete all the summaries:
						connection.query("DELETE FROM summaries WHERE noteID = ?", [result[i].noteID], function(err, result) {
							if (err) {
								console.log("Couldn't delete summary");
							}
						});

						//delete the actual note:
						connection.query("DELETE FROM notes WHERE noteID = ?", [result[i].noteID], function(err, result) {
							if (err) {
								console.log("Couldn't delete note");
							}
						});
					}

					//all notes deleted, delete the actual user!
					connection.query("DELETE FROM users WHERE idUser = ?", [id], function(err, result) {
							if (err) {
								console.log("Couldn't delete user");
							} else {
								console.log("Deleting user!");
								res.status(200).send({ success: true});
							}
					});
				}
    	});
		}
  });
});

//lets the user create an account without google authentication by using our database instead.
app.post('/createAccount', function(req, res) {
  console.log('createAccount', 'req.body', req.body);
  //res.status(500).send({success: false, body: JSON.parse(req.body).name})
  try {
    var user = JSON.parse(req.body);
    console.log('user', user);
  } catch (error) {
    console.log('error', error); // TODO this error is always undefined instead define the error here
    // TODO in this case the error would be, invalid format of body, not in proper JSON format
    res.status(500).send({ success: false, error: "Invalid JSON format" });
  }
  var name = user.name;
  var email = user.email;
  var password = user.password;
  var prefersEmailUpdates = user.prefersEmailUpdates;
  var hashedPassword = hash(password);

  //check if this email exists already in the database, if so, return an error.
  connection.query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
    console.log("inside select");
    if (err) {
      console.log('err', err);
      res.status(500).send({ success: false, error: err });
    }
    console.log('result', result);
    if (result.length > 0) {
      //sorry, this email is already taken!
      console.log("Email address already taken.");
      console.log("email collison: " + result[0].email);
      res.status(500).send({ success: false, error: "This email address is already taken." });
    } else {

      //bcrypt.hash(password, saltRounds, function(err, password) {
      // Store hash in your password DB.
        var newUser = {
          name: name,
          email: email,
          password: hashedPassword,
          feedback: '',
          prefersEmailUpdates: prefersEmailUpdates,
          noteCount: 0
        }
        connection.query('INSERT INTO users SET ?', newUser, function(err, result) {
          console.log("inside insert");
          if (err) {
            res.status(500).send({success: false, error: err})
          } else {
            res.status(200).send({success: true});
          }
        });
      //});

    }
  });
});

app.post('/profile', function(req, res) {

  //fetch the user by email and return it in json
  try {
    var user = JSON.parse(req.body);
  } catch (error) {
    res.status(500).send({ success: false, error: err });
  }
  var email = user.email;
  console.log('req.body', JSON.parse(req.body));
  connection.query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
    if (result.length == 0) {
      res.status(500).send({ success: false, error: "This email address doesn't exist." });

    } else if (result.length == 1) {
      var data = {
        success: true,
        name: result[0].name,
        email: result[0].email,
        //password: result[0].password,
        prefersEmailUpdates: result[0].prefersEmailUpdates,
        postCount: result[0].postCount
      }

      res.send(data)

    } else {
      //more than one user?
      console.log("More than one user found...");
    }
  });
});

app.post('/editProfile', function(req, res) {
  //update name
  //update email
  try {
    var user = JSON.parse(req.body);
  } catch (error) {
    res.status(500).send({ success: false, error: err });
  }
  var email = user.email;

  if (user.newEmail != null) {
    //update email
    console.log("Update email");
    //  'UPDATE employees SET location = ? Where ID = ?',

    connection.query("UPDATE users SET email = ? WHERE email = ?", [user.newEmail, user.email], function (err, result) {
      if (err) {
        res.status(500).send({success: false, error: err})
      }
    });

  } else {
    console.log("email not updated");
  }

  if (user.newName != null) {
    //update name
    console.log("Update name");
    connection.query("UPDATE users SET name = ? WHERE email = ?", [user.newName, user.email], function (err, result) {
      if (err) {
        res.status(500).send({success: false, error: err})

      }
    });

  } else {
    console.log("name not updated");

  }

  res.status(200).send({success: true})


});

function hash(str) {
  var hash = 5381,
      i    = str.length;

  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen('8000');
console.log('Listening on port ' + 8000 + '...');
