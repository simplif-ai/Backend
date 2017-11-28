/**
 * notes file, user's notes and summary functionalities
 */
module.exports = function (app) {

    var utility = require('./../utility');
    var connection = utility.connection;


    /**another request to get the saved version from the user of the summarizer text
    **and send it to db
    **could send noteID in response here if needed for frontend?
    **the body contains user's email, text: {email, text}
    ** To create a note and save the summary 
    **@req: {"email":"", "text":""}
    **@res: {"noteID":"", }
    **/
    app.post('/createnote', function (req, res) {
        /*connection.connect(function (err) {
        if (err) {
          //console.error('Database connection failed: ' + err.stack);
          return;
        }
        */
        //console.log('Connected to database.');
        //console.log("body: ", req.body);
        try {
            var body = JSON.parse(req.body);
        } catch (error) {
            res.status(500).send({ success: false, error: error });
        }
        //console.log("gets here");
        var userEmail = body.email;
        var text = body.text;
        var name = text.substring(0, 15);
        var datetime = new Date();
        //console.log("email: ", body.email);
        //console.log("text: ", body.text);

        //get userid from email
        connection.query("SELECT * FROM users WHERE email = ?", [userEmail], function (err, result) {
            //console.log("gets here1");
            //console.log("result:", result);
            if (err) {
                res.status(500).send({ success: false, error: err });
            }
            else {
                //console.log("Obtained userId from user email");
                var id = result[0].idUser;
                //console.log("userId:", id);
                //Add a column for new summarited text in note
                //noteText is when a request made to save user's notes
                var note = {
                    name: name,
                    dateRecorded: datetime,
                    noteText: null,
                    userID: id
                };
                //console.log("note: ", note);
                connection.query("INSERT INTO notes SET ?", [note], function (err, result) {
                    //console.log("goes in here");
                    if (err) {
                        res.status(500).send({ success: false, error: err });
                    }
                    else {
                        //console.log("created row in the notes table");
                        //add a summary row for the new summarized text
                        //console.log("noteID:" + result.insertId);
                        var noteID = result.insertId;
                        var newSumm = {
                            summarizedText: text,
                            noteID: noteID
                        };
                        connection.query('INSERT INTO summaries SET ?', [newSumm], function (err, result) {
                            //console.log("inside insert");
                            if (err) {
                                res.status(500).send({ success: false, error: err });
                            } else {
                                var id = {
                                    noteID: noteID
                                }
                                //send status
                                //res.sendStatus(200);
                                //send nodeID
                                res.status(200).send(id);
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * Saves the notes added with user's summary on to the notes table 
     * To saves any notes by user and name if name exists
     * Returns name of note if name is saved with note
     *@req: {'noteId':'', 'name: name', noteText':''}
     *@ret: {'success: true'} 
     *       err
     *      {'name': ''}
     **/
    app.post('/updatenote', function (req, res) {
        //console.log("body:", req.body);
        try {
            var body = JSON.parse(req.body);
        } catch (error) {
            res.status(500).send({ success: false, error: error });
        }
        var noteID = body.noteID;
        var name = body.name;
        var noteText = body.noteText;

        //console.log("name:", name);
        //console.log("noteText:", noteText);

        //name is null
        if (name == null) {
            //console.log("goes in here1");
            //update the note table with adding the notesText to one of the noteIds
            connection.query("UPDATE notes SET noteText = ? WHERE noteID =?", [noteText, noteID], function (err, result) {
                //console.log("goes in here");
                if (err) {
                    res.status(500).send({ success: false, error: err });
                }
                else {
                    //console.log("Success!");
                    res.status(200).send({ success: true });
                }
            });
        }
        //noteTest is null
        else if (noteText == null) {
            //console.log("goes in here2");
            //update the note table with name to one of the noteIds
            connection.query("UPDATE notes SET name = ? WHERE noteID =?", [name, noteID], function (err, result) {
                //console.log("goes in here");
                if (err) {
                    res.status(500).send({ success: false, error: err });
                }
                else {
                    //console.log("Success!");
                    var nameSend = 
                    {
                        name:name
                    }
                    res.status(200);
                    res.send(nameSend);
                }
            });
        }
        else {
            //console.log("goes in here3");
            //update the note table with name and the noteText to one of the noteIds
            connection.query("UPDATE notes SET name = ?, noteText = ? WHERE noteID =?", [name, noteText, noteID], function (err, result) {
                //console.log("goes in here");
                if (err) {
                    res.status(500).send({ success: false, error: err });
                }
                else {
                    //console.log("Success!");
                    var nameSend = 
                    {
                        name:name
                    }
                    res.status(200);
                    res.send(nameSend);
                }
            });
        }

    });

    /**
 * obtain list of notes for the users
 * @req: {"email": ""}
 * @res: [{"noteID": "", "name":""}]
 */
app.post("/listnotes", function(req, res){
    try {
      var body = JSON.parse(req.body);
    } catch (error) {
      res.status(500).send({ success: false, error: err });
    }
    var userEmail = body.email;
    //get users from email
    connection.query("SELECT * FROM users WHERE email = ?", [userEmail], function (err, result) {
     //console.log("gets here1");
     //console.log("result:", result);
      if (err) {
        res.status(500).send({ success: false, error: err });
      }
      else {
       //console.log("Obtained userId from user email");
        var id = result[0].idUser;
       //console.log("id:", id);
        //get the all the notes of the giver userID
        connection.query("SELECT * FROM notes WHERE userID = ?",[id], function(err, result) {
          //console.log("here");
          if (err) {
            res.status(500).send({ success: false, error: err });
          }
          else {
            //add all notes and their name to an array 
            var array = [];
            for(var i = 0; i < result.length; i++){
              var noteID = result[i].noteID;
              var name = result[i].name;
              var noteObject= {
                noteID: noteID,
                name: name
              }
              array.push(noteObject);
            }
            //send back an array of noteObject that contains noteID and name
            res.send(array);
          }
        });
      }
    });
  });


  /**
   ** Click on a note and view its summary and/or user notes(if exists)
   ** @req: {"email": ""}
   ** @res: [{"summary" : "", "noteText" : ""}]
   **/
  app.post("/getsumandnote", function(req, res) {
    try {
        var body = JSON.parse(req.body);
    } catch (error) {
        res.status(500).send({ success: false, error: err });
    }
    var userEmail = body.email;
    var noteID = body.noteID;
    connection.query("SELECT * FROM users WHERE email = ?", [userEmail], function (err, result) {
        //console.log("gets here1");
        //console.log("result:", result);
         if (err) {
           res.status(500).send({ success: false, error: err });
         }
         else {
            var id = result[0].idUser;
            //console.log("id:", id);
             //get the all the notes of the giver userID
             connection.query("SELECT * FROM notes WHERE userID = ? AND noteID = ?",[id, noteID], function(err, result) {
               //console.log("here");
               if (err) {
                 res.status(500).send({ success: false, error: err });
               }
               else {
                    var noteText = result[0].noteText;
                    connection.query ("SELECT * FROM summaries WHERE noteID = ?",[noteID], function(err, result){
                        if (err) {
                            res.status(500).send({ success: false, error: err });
                        }
                        else {
                            var array = [];
                            console.log("result", result);
                            var summary = result[0].summarizedText;
                            console.log("summary", summary);
                            var noteandsum = {
                                summary: summary,
                                noteText: noteText
                            }
                            console.log("noteandsum:", noteandsum);
                            array.push(noteandsum);
                            res.send(array);
                        }
                    });
                }
            });
         }
    });
  });

   /**
   ** To delete a whole note with summary and note 
   ** @req: {"email": "", "noteID": }
   ** @res: {'success: true'} 
   **       err
   **/
  app.post("/deletenote", function(req, res) {
    try {
        var body = JSON.parse(req.body);
        var userEmail = body.email;
        var noteID =  body.noteID;
    } catch (error) {
        res.status(500).send({ success: false, error: err });
    }
    connection.query("SELECT * FROM users WHERE email = ?", [userEmail], function (err, result) {
        //console.log("gets here1");
        //console.log("result:", result);
         if (err) {
           res.status(500).send({ success: false, error: err });
         }
         else {
            var userID = result[0].idUser;
            connection.query("DELETE FROM notes WHERE userID = ? AND noteID = ?", [userID, noteID], function (err, result) {
                if (err) {
                    res.status(500).send({ success: false, error: err });
                }
                else {
                    connection.query("DELETE FROM summaries WHERE noteID = ?", [noteID], function (err, result) {
                        if (err) {
                            res.status(500).send({ success: false, error: err });
                        }
                        else {
                            console.log("result", result[0]);
                            res.status(200).send({ success: true });
                        }
                    });
                }
            });
        }
    });
  });


}


