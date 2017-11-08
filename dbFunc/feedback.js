/**
 * notes file, user's notes and summary functionalities
 */
module.exports = function (app) {

    const utility = require('./../utility');
    const connection = utility.connection;
    const mailer = require('nodemailer');

    /**
    * Saves the user's feedback to the database and sends an email to the developers
    * @param: req = {userID, feedback}
    * @return: res = {success, error?}
    */
    app.post('/feedback', function (req, res) {
      try {
        var body = JSON.parse(req.body);
        var feedback = body.feedback;
        var userID = body.userID;
      } catch(error) {
          res.status(500).send({success: false, error: error});
          return;
      }

      emailDevelopers(feedback);

      connection.query("UPDATE users SET feedback = ? WHERE idUser = ?", [feedback, userID], function (err, result) {
        if (err) {
          res.status(500).send({success: false, error: err});
        } else {
           res.status(200).send({error: null, success: true});
        }
      });
    });

    function emailDevelopers(feedback) {
      var transporter = mailer.createTransport({
            service: 'GMAIL',
            auth: {
                user: 'simplif.ai17@gmail.com',
                pass: 'simplif.ai2017'
            }
        });
        //console.log(transporter);
        var mailOptions = {
            to: 'simplif.ai17@gmail.com',
            subject: 'Feedback about Simplif.ai',
            text: feedback
        }
        //console.log(mailOptions.html);
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                //console.log('Email sent: ' + req.param.url);
                console.log('Email sent!');
            }
            mailer.getTestMessageUrl(info);
            transporter.close();
        });
    }
}