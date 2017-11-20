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
> 💡 *Optional parameters are followed by a "?".*

### /feedback

Receives:
```javascript
{
    userID: Integer,
    feedback: String
}
```

Sends:
```javascript
{
    success: Boolean,
    error?: String
}
```

### /login
Receives:
```javascript
{
  email: String,
  password: String
}
```

Sends:
```javascript
{
  sucess: Boolean,
  token: String,
  error?: String //optional
}
```

### /editProfile
Receives:
```javascript
{
  email: String,
  newEmail?: String,
  newName?: String
}
```

Sends:
```javascript
{
  sucess: Boolean,
  error?: String
}
```

### /profile

Receives:
```javascript
{
    email: String
}
```
Sends:
```javascript
{
  sucess: Boolean,
  name: String,
  email: String,
  prefersEmailUpdates: Integer (0 or 1),
  postCount: Integer
}
```
### /setDarkMode

Receives:
```javascript
{
    darkMode: Integer (0 or 1),
    userID: Integer
}
```
Sends:
```javascript
    success: Boolean,
    error?: String
```

### /loginToGoogle
> 💡 *If no googleCode is provided, this endpoint returns an authorizeURL. If a valid googleCode is provided, a googleToken is returned.*


Receives:
```javascript
    googleCode?: String
```
Sends:
```javascript
    authorizeURL?: String,
    success: Boolean,
    googleToken?: String
```

### /createGoogleEvent

Receives:
```javascript
{
    googleToken: String,
    event: Object
}
```

```javascript

//note: Not all paramers are necessary. Only need to send in summary, start, and end.
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
```
Sends:
```javascript
{
    success: Boolean,
    eventID: String,
    error: String
}
```

### /exportToDrive
Receives:
```javascript
{
    title: String,
    text: String,
    googleToken: String
}
```
Sends:
```javascript
{
    fileID: String,
    error?: String
}
```

### /addCollaborator
Receives:
```javascript
{
    googleToken: String,
    fileID: String,
    collaboratorEmail: String
}
```
Sends:
```javascript
{
    success: Boolean,
    error?: String
}
```
#### /getGoogleProfilePicture

Receives:
```javascript
{
    googleToken: String,
    email: String
}
```
Sends:
```javascript
{
    profilePictureURL: String,
    error?: String
}
```

### /createFolder

Receives:
```javascript
{
    name: String,
    googleToken: String
}
```

Sends:
```javascript
{
    fileID: String,
    error?: String
}
```

### /createAccount

Receives:
```javascript
{
    name: String,
    email: String,
    password: String,
    phoneNumber: Integer,
    prefersEmailUpdates: Integer (0 or 1)
}
```


Sends:
```javascript
{
    sucess: Boolean,
    error?: String
}
```

### /deleteAccount

Receives:
```javascript
{
    email: String
}
```

Sends:
```javascript
{
    sucess: Boolean,
    error?: String
}
```

### /changePassword

Receives:
```javascript
{
    email: String,
    newPassword: String
}
```

Sends:
```javascript
{
    success: Boolean,
    error?: String
}
```

### /receivePassword
Receives:
```javascript
{
    email: String
}
```

Sends:
```javascript
{
    success: Boolean,
    error?: String
}
```

This is a post request for sending an email of the link to reset the password.
An email is sent in the body of the request where the reset password link will be sent to it
using nodemailer in nodejs.

### /savesummary
Receives:
```javascript
{
    "email": "luna.ad2@gmail.com",
    "text": "This is the summary text saved by the user",
    "name": "CS 307 Notes"
}
```


Sends:
```javascript
{
    success: "true",
    error: "error saving to db"
}
```
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
