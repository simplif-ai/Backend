/**
 * password file, user's password functionalities 
 */
module.exports = function (app) {

    var utility = require('./../utility');
    var connection = utility.connection;
    var hash = utility.hash
    var nodemailer = require('nodemailer');
    //this endpoint allows the user to change their password in the database.
    app.post('/changePassword', function (req, res) {

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
                ////console.log("err");
                res.status(500).send({ success: false, error: err });
            } else {
                //console.log("Not err");
                //console.log(result);
                if (result.length == 1) {
                    //console.log("count is 1");
                    //bcrypt.hash(newPassword, saltRounds, function(err, hash) {
                    var hashedPassword = hash(password);

                    connection.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], function (err, result) {
                        if (err) {
                            //console.log("err 2");
                            res.status(500).send({ success: false, error: error });
                        } else {
                            //console.log("Success!");
                            res.status(200).send({ success: true });
                        }
                    })
                    //});
                } else {
                    res.status(500).send({ success: false, error: "User not found." });
                }
            }
        })
    });

    /**this endpoint will send an email to the email passed in using the mailer. The email will contain a link so the user can reset their password
    ** @req: {
                "email": "",
                "dateString": 'YYYY/MM/DD HH:mm:ss'
              }
    ** @res: {success: true} 
    **       err
    **/ 
    app.post('/resetPassword', function (req, res, next) {
        //use mailer to send email to the email address passed in.
        ////console.log(req);
        // //console.log(JSON.parse(req.body));
        try {
            var user = JSON.parse(req.body);
        } catch (error) {
            res.status(500).send({ success: false, error: error });
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
        //console.log(transporter);
        var mailOptions = {
            from: 'simplif.ai17@gmail.com',
            to: email,
            subject: 'Reset password to Simplif.ai',
            text: url,
            html: '<p>' + url + '</p>'
        }
 
        //console.log(mailOptions.html);
        transporter.sendMail(mailOptions, function (error, info) {
            //console.log(error);
            //console.log(info);
            if (error) {
                //console.log('error sending email for resetting password');
                 res.status(500).send({ success: false, error: error });                
            }
            else {
                //console.log('Email sent: ' + req.param.url);
                res.status(200).send({ success: true });
            }
            nodemailer.getTestMessageUrl(info);
            transporter.close();
        });   
    });

}