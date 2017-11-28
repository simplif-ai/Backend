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
         return;
      }
      console.log('URL: ' + URL);

      request(URL, function (error, response, body) {

        if (error) {
          res.status(500).send({success: false, error: error});
          return;
        }

        let text = extractor(body).text;
        console.log('text: ' + text);

        //text parsed, make a request to the API:
        var options = {
          headers: {
              'Content-Type': 'text/plain'
              },
              body: JSON.stringify({
                text: text
              }),
              method: 'POST'
        }
          
        request.post(
            'http://simplif-ai-backend.us-east-2.elasticbeanstalk.com/summarizertext',
             options ,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('sending body');
                    res.status(200).send(response.body);
                } else {
                    res.status(500).send({success: false, error: error});
                }
            }
        );
      });
    });
}