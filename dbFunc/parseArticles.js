/**
 * parsing an article URL endpoint
 */

var extractor = require('unfluff');
var request = require('request');
module.exports = function (app) {

    var utility = require('./../utility');
    var connection = utility.connection;

    /**
    * Parses the text from the article and returns the summarized text
    * @param: req = {URL}
    * @return: res = {success, error?}
    */
    app.post('/parseURL', function (req, res) {
      try {
        var body = JSON.parse(req.body);
        var URL = body.URL;
      } catch(error) {
          res.status(500).send({success: false, error: error});
          return;
      }

      if (!URL) {
         res.status(500).send({success: false, error: "No URL found."});
      }
      console.log('URL: ' + URL);

      request(URL, function (error, response, body) {
        console.log(extractor(body).text);
        res.status(200).send({success: true, error: null});
      });
    });

    /*

      connection.query("UPDATE users SET darkMode = ? WHERE idUser = ?", [darkMode, userID], function (err, result) {
        if (err) {
          res.status(500).send({success: false, error: err});
        } else {
           res.status(200).send({error: null, success: true});
        }
      });
    });
    */
}