/*
*summarizerApi file
*/

module.exports = function (app) {

    //this is a mock api to test the fuctionality of the
    //middleware function
    app.get('/mocktext', function (req, res) {
        var mock = "Hi this is Lena's mock text";
        var json = {
            'text': mock
        }
        var options = {
            url: 'http://localhost:8000/sumarizertext',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        }
        // res.send(options.body);
        request.post(options, function (error, response, body) {
            //console.log(body);
            res.send(JSON.parse(body));
        });
    });

    //Text endpoint; text sumbitted by user is handled here
    //It is then sent to the summarizer api and the data received
    //is sent back to the user
    app.post('/summarizertext', function (req, res) {
        //url subject to change once api is created
        try {
            const body = JSON.parse(req.body);
        } catch (error) {
            res.status(500).send({ success: false, error: err });
        }
        var summarizerApi = "https://ir.thirty2k.com/summarize";
        var options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            method: 'POST'
        }

        //send the text received from user to api of summarizer
        //get for testing reasons, use post when using summarizer api url
        request.post(summarizerApi, options, function (error, response, body) {
            //recives data from summarizerAPI
            //sends it back to the summarizertext endpoint which would be the
            //body response to any request that posts a request to it
            //uses json to send a stringfied json object of the non-object data from api
            console.log('statusCode', response.statusCode);
            if (!error && response.statusCode === 200) {
                res.send(response.body);
            } else {
                res.send({ success: false, error: error });
            }
        });
    });

}