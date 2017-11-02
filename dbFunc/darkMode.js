/**
 * notes file, user's notes and summary functionalities
 */
module.exports = function (app) {

    var utility = require('./../utility');
    var connection = utility.connection;

    /**
    * Creates a folder inside the base Simplif.ai folder
    * @param: req = {darkMode, userID}
    * @return: res = {success, error?}
    */
    app.post('/setDarkMode', function (req, res) {
      try {
        var body = JSON.parse(req.body);
        var darkMode = body.darkMode;
        var userID = body.userID;
      } catch(error) {
          res.status(500).send({success: false, error: error});
          return;
      }

      connection.query("UPDATE users SET darkMode = ? WHERE userId = ?", [darkMode, userId], function (err, result) {
        if (err) {
          res.status(500).send({success: false, error: error});
        } else {
           res.status(200).send({error: null, success: true});
        }
      });
    });
}