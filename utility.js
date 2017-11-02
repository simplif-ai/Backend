/*
* Utility file contains the setups 
* for libraries used in our app
*/

const mysql = require('mysql');
//const nodemailer = require('nodemailer');
const multer = require('multer');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//setup upload 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.jpg') //Appending .jpg
    }
})
const upload = multer({ storage: storage });

//setup database
var connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
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

//password hash function
function hash(str) {
    var hash = 5381,
        i = str.length;

    while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
    }

    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return hash >>> 0;
}

//export setup functions to endpoint files
module.exports = {
    upload: upload,
    connection: connection,
    GoogleAuth: GoogleAuth,
    hash: hash
};



