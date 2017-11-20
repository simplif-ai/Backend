/**
 * profile file, user's profile functionalities
 */
module.exports = function (app) {

    var utility = require('./../utility');
    var upload = utility.upload;
    var connection = utility.connection;

    app.post('/profile', function (req, res) {

        //fetch the user by email and return it in json
        try {
            var user = JSON.parse(req.body);
        } catch (error) {
            res.status(500).send({ success: false, error: err });
        }
        var email = user.email;
        //console.log('req.body', JSON.parse(req.body));
        connection.query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
            if (result.length == 0) {
                res.status(500).send({ success: false, error: "This email address doesn't exist." });

            } else if (result.length == 1) {
                var data = {
                    success: true,
                    name: result[0].name,
                    email: result[0].email,
                    prefersEmailUpdates: result[0].prefersEmailUpdates,
                    postCount: result[0].postCount
                }

                res.send(data)

            } else {
                //more than one user?
                //console.log("More than one user found...");
            }
        });
    });

    app.post('/editProfile', function (req, res) {
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
            //console.log("Update email");
            //  'UPDATE employees SET location = ? Where ID = ?',

            connection.query("UPDATE users SET email = ? WHERE email = ?", [user.newEmail, user.email], function (err, result) {
                if (err) {
                    res.status(500).send({ success: false, error: err })
                }
            });

        } else {
            //console.log("email not updated");
        }

        if (user.newName != null) {
            //update name
            //console.log("Update name");
            connection.query("UPDATE users SET name = ? WHERE email = ?", [user.newName, user.email], function (err, result) {
                if (err) {
                    res.status(500).send({ success: false, error: err })

                }
            });

        } else {
            //console.log("name not updated");

        }

        res.status(200).send({ success: true })


    });

    /**
     * Upload profile picture using multer
     * File input field name is simply 'file'
     * get the uploaded photo and saves it on the server
     * Add the filepath on to db 
     * @Header: multipart/form-data
     * @req: req.file : image
     *       req.body.email: email
     * @res: @res:{success: true} 
     *       err
     */
    app.post('/addpicture', upload.single('file'), function (req, res) {
        //console.log("req:", req);
        // console.log("reqfile:", req.file);
        // console.log("filname: ",req.file.filename);
        // console.log("originalname: ",req.file.originalname);
        console.log("path:", req.file.path);
        // console.log("type:", req.file.mimetype);
        console.log("email:", req.body);
        /*try {
          console.log("here12");
          var body = JSON.parse(req.body);
        } catch (err) {
          console.log("here11");
          res.status(500).send({ success: false, error: err });
        }*/
        var userEmail = req.body.email;
        var picturePath = __dirname + '/uploads/' + req.file.filename;

        console.log("email:", userEmail);
        if (!req.file) {
            console.log("File has not been received");
            res.status(500).send({ success: false, error: "File has not been received" });
        }
        else {
            console.log("here2");
            //store path in sql
            connection.query('UPDATE users SET picturePath = ? WHERE email = ?', [picturePath, userEmail], function (err, result) {
                console.log("inside insert");
                if (err) {
                    res.status(500).send({ success: false, error: err });
                } else {
                    res.status(200).send({ success: true });
                }
            });
        }
    });

    /**Add collaborators to users
     * The user wants to add a collaborator so they select a note and enter the email address
     * of the collaborator that you want to share the note with
     * We recive the userEmail: the email of the current user, noteID: the note id of the current
     * user that they want to share with collaborator user, colabEmail: the email of the collaborator 
     * that will obtain editing abilities 
     * @req:{'noteID':'','userEmail':'', 'colabEmail':''} 
     * @res:{success: true} 
     *       err
     */
    app.post('/addcollaborators', function (req, res) {
        try {
            var body = JSON.parse(req.body);
        } catch (error) {
            res.status(500).send({ success: false, error: error });
        }
        var noteID = body.noteID;
        var userEmail = body.userEmail;
        var colabEmail = body.colabEmail;
        //console.log("noteId:", noteID);
        //console.log("useremail:", userEmail);
        //console.log("colabemail:", colabEmail);

        var userID;
        var userIdColab;

        //get the userID from userEmail
        connection.query("SELECT * FROM users WHERE email IN ('" + userEmail + "', '" + colabEmail + "')", function (err, result) {
            if (err) {
                res.status(500).send({ success: false, error: err });
            }
            else {
                //console.log("Obtained userId from user email");
                //console.log("result:", result);
                userID = result[0].idUser;
                userIdColab = result[1].idUser;
                //console.log("userId:", userID);
                var collaborator = {
                    noteID: noteID,
                    userID: userID,
                    userIdColab: userIdColab
                };
                //console.log("collaborator: ", collaborator);
                connection.query("INSERT INTO collaborators SET ?", [collaborator], function (err, result) {
                    //console.log("goes in here");
                    if (err) {
                        res.status(500).send({ success: false, error: err });
                    }
                    else {
                        //console.log("created row in the collaborator table");
                        res.status(200).send({ success: true });
                    }
                });
            }
        });
    });
}