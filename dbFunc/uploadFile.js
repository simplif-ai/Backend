var fs = require('fs');
var request = require('request');
var utility = require('./../utility');
var upload = utility.upload;

module.exports = function (app) {

	 /**
    * Parses the text from the article and returns the summarized text
    * @param: req = {URL}
    * @return: res = {success, error?}
    */
	app.post('/uploadfile', upload.single('file'), function (req, res) {
		if (!req.file) {
	            console.log("File has not been received");
	            res.status(500).send({ success: false, error: "File has not been received" });
	        }
	      else {

	      	var noSpaces = req.file.originalname.replace(/\s/g, '');
	      	var filePath = 'uploads/' + noSpaces;
	      	const { exec } = require('child_process');

            exec('mv ./uploads/' + req.file.filename + ' ./uploads/' + noSpaces, (err, stdout, stderr) => {
                if (err) {
                  return;
                }
            });

	        var req = request.post('http://ir.thirty2k.com/upload', function (err, resp, body) {
	        	if (!resp.error && response.statusCode == 200) {
                    res.status(200).send(response.body);
                } else {
                    res.status(500).send({success: false, error: error});
                }
			});

			var form = req.form();
			form.append('file', fs.createReadStream(filePath));

	    }
	});
}