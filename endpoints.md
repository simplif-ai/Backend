
### /editProfile
Receives:
{
email: "sdblatz@gmail.com"
newEmail: "sblatz@purdue.edu" //optional
newName: "Sawyer" //optional
}

Sends:
{
sucess: "true"
error: "Email does not exist." //optional
}

### /profile

Receives:
{
email: "sdblatz@gmail.com"
}

Sends:
{
sucess: "true"
name: "Sawyer"
email: "sdblatz@gmail.com"
password: "securePass"
prefersEmailUpdates: "0"
postCount: "3"
}

### /createAccount

Receives:
{
email: "sdblatz@gmail.com",
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
sucess: "true"
error: "Email doesn't exist." //optional
}

### /changePassword

Receives:
{
email: "sdblatz@gmail.com"
password: "oldPassword"
newPassword: "newPassword"
}

Sends:
{
sucess: "true"
error: "Email doesn't exist." //optional
}

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


## /addpicture

Receives:
{
    file: image ->(multipart/form-data)
    email: "luna.ad2@gmail.com"
}

Send:

{

    success: "true",

    error: "success: false"

}

## /listnotes

Receives:

 {
     "email": "luna.ad2@gmail.com"
 }
 
 Send:

 [
     {
        "noteID": 12,
        "name": "1234"
    },
    {
        "noteID": 13,
        "name": "2wait Another t"
    }
 ]

## /createnote
Receives:

 {
     "email": "luna.ad2@gmail.com", 
     "text": "hi this is a testing note "
 }

Send:
{

 "noteID": "43"

}

## /updatenote

Receives:

{
    "noteId": "43", 
    "name:" "?", 
    "noteText": '?'
}

Send:

{
    "success": "true"
    error: "success: false"
} 

## /getPicture 

Receives: 

{
    'email': ''
}

Send:

{
    "success": "true"
    error: "success: false"
} 

## /deleteCollaborators 
Receives: 

{
   
}

Send:

{
    "success": "true"
    error: "success: false"
} 