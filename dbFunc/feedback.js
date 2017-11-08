/**
 * notes file, user's notes and summary functionalities
 */
module.exports = function (app) {

    var utility = require('./../utility');
    var connection = utility.connection;

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

      connection.query("UPDATE users SET feedback = ? WHERE idUser = ?", [feedback, userID], function (err, result) {
        if (err) {
          res.status(500).send({success: false, error: err});
        } else {
           res.status(200).send({error: null, success: true});
        }
      });
    });

    
}