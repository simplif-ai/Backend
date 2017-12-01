
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


### /addpicture

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

### /listnotes

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

### /createnote
Receives:

 {
     "email": "luna.ad2@gmail.com", 
     "text": "hi this is a testing note "
 }

Send:
{

 "noteID": "43"

}

### /updatenote

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
    'name': ''
} 

### /getPicture 

Receives: 

{
    'email': ''
}

Send:

{
    "success": "true"
    error: "success: false"
} 

### /addcollaborators 
* Add collaborators to users
* The user wants to add a collaborator so they select a note and enter the email address
* of the collaborator that you want to share the note with
* We recive the userEmail: the email of the current user, noteID: the note id of the current
* user that they want to share with collaborator user, colabEmail: the email of the collaborator 
* that will obtain editing abilities 

Receives: 

{
    'noteID': '',
    'userEmail':'', 
    'colabEmail':''
}

Send:

{
    "success": "true"
    error: "success: false"
} 

### /deleteCollaborators 
* colabEmail: the email of the collaborator

Receives: 

{
   'colabEmail':'',
   'noteId': ''
}

Send:

{
     "success": "true"
    error: "success: false"
} 

### /getsumandnote
* Click on a note and view its summary and/or user notes(if exists)

 Receives:
 {
    "email": "",
    "noteID": ""
}

 Send:
 {
     [
         {
             "summary" : "", 
             "noteText" : ""
         }
     ]
 }

 ### /deletenote
* To delete a whole note with summary and note 

Receives:
{
    "email": "", 
    "noteID": "" 
}

Send:
{
    'success: true'
    err
} 

### /addfeedback
* user can add feedback 

Receives: 
    {
        'email':'', 
        'feedback' : ''
    } 

Send:
    {
        'success': 'true'
    }
    err

### /viewfeedback
* as a developer would like to view all feedback
    
Send:
    [
            {
                "userID": "", 
                "name": "", 
                "feedback": ""
            }
    ]
    err

### /getcollaborators
 
 Request:
    {
        'userEmail':'','noteId':''
    } 
 Send: 
 [
     {
         'colabEmail':'',
         'name':''
     }
 ] 
  err

### /emailReminder
This endpoint will send an email to the email passed in using the mailer. The email will contain a reminder message.
    Request: 
    {
        "email": "",
        "dateString": 'YYYY/MM/DD HH:mm:ss',
        "message": ""
    }
    
    Send:
    {
        success: true
    } 
    err


   