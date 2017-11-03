# Backend

## How to run Node Backend

1. Git clone
```
git clone git@github.com:simplif-ai/Backend.git
```
2. Use this command to install all dependencies needed from the package.js
```
npm install
```
3. Everything should be setup so you can run:
```
npm start
```
4. You'll see a message on console "Listening to port 8000"

## How To Test
```
npm test
``` 
or 
```
gulp
```

## Run Linting
1. install eslint globally 
```
npm install -g eslint
```
2. run linter
```
npm run lint
```

## Endpoints

### /login
Receives:

{

  email: "sdblatz@gmail.com",

  password: "securePassword"

}

Sends:

{

  sucess: "true",

  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ",

  error: "Email does not exist." //optional

}

### /editProfile
Receives:

{

  email: "sdblatz@gmail.com",

  newEmail: "sblatz@purdue.edu", //optional

  newName: "Sawyer" //optional

}

Sends:

{

  sucess: "true",

  error: "Email does not exist." //optional

}

### /profile

Receives:

{

  email: "sdblatz@gmail.com"

}

Sends:

{

  sucess: "true",

  name: "Sawyer",

  email: "sdblatz@gmail.com",

  password: "securePass",

  prefersEmailUpdates: "0",

  postCount: "3"

}

### /setDarkMode

Receives:{darkMode, userID}
Sends: {success, error?}

### /loginToGoogle

If no googleCode, returns an authorizeURL. If googleCode, returns a googleToken

Receives:{googleCode?}
Sends: {authorizeURL?, success, googleToken?}

### /exportToDrive

Receives:
{title, text, googleToken}

Sends:
{success}

### /addCollaborator
Receives:
{googleToken, fileID, collaboratorEmail}

Sends:
{success, error}

#### /getGoogleProfilePicture

Receives:
{googleToken, email}

Sends:
{error?, profilePictureURL}

### /createFolder

Receives:
{name, googleToken}

Sends:
{success, error?}


### /createAccount

Receives:

{

  name: "Sawyer",

  email: "sdblatz@gmail.com",

  password: "securePass",

  phoneNumber: "2008657700",

  prefersEmailUpdates: "0"

}

Sends:

{

  sucess: "true"

  error: "Email already exists." //optional

}

### /deleteAccount

Receives:

{

  email: "sdblatz@gmail.com"

}

Sends:

{

  sucess: "true",

  error: "Email doesn't exist." //optional

}

### /changePassword

Receives:

{
  email: "sdblatz@gmail.com",

  password: "oldPassword",

  newPassword: "newPassword"

}

Sends:

{

  sucess: "true",

  error: "Email doesn't exist." //optional

}

### /receivePassword
Receives:

{

  email: "luna.ad2@gmail.com",

}

Sends:

{

  sucess: sends email to the above email

  erro: "email has not been sent"

}

This is a post request for sending an email of the link to reset the password.
An email is sent in the body of the request where the reset password link will be sent to it
using nodemailer in nodejs.

### /savesummary
Receives:

{

    "email": "luna.ad2@gmail.com",

    "text": "This is the summary text saved by the user",

    "name": "CS 307 Notes"

}

Send:

{

    success: "true",

    error: "error saving to db"

}

## /savenotes
Receives:

{
    "noteId": 13,
    "noteText": "Hi this is a note text"

}

Send:

{

    success: "true",

    error: "error saving to db"

}

This is a post request to save the text summary of the user to the db. A row is created in the notes table which has the name of name of the text, date, noteText(for any additional notes from user), and userId(the account of the user that saved the summary, obtained from email in the json object request). A row is created in to summary table which has the summaryText(the user saved, in the json object request), the noteId(from the notes table), and the brevity.

## How to use summarizer Api
To send text to the summarizer Api to summarize(using the middleware endpoint):
1. Make a post http-request on the endpoint path 'http://localhost:8000/sumarizertext'.
2. Add the text to be sent in a json object as below:
```javascipt
var mock = "Hi this is Lena's mock text";
var json = {
    'text': mock
}
```
3. The body received from the request of the middleware endpoint is in a stringified JSON object
4. Handle that summarized data recieved as needed
5. The data that will sent back to your api that called the middleware should be parsed to a JSON object
#Example
An example of a get request of making an api that does a post request to send the text to the middleware endpoint, receives the strignifies JSON object of the summarized data from the middleware endpoint, then makes a callback to send that data back to the api that called the middleware. This example doesn't handle or make any changes to the summarized data, but it could be added.
```javascript
app.get('/mocktext', function(req, res) {
    var mock = "Hi this is Lena's mock text";
    var json = {
        'text': mock
    }
    console.log("json of text: " + json)
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
```
