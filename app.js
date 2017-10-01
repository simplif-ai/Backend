/**
 * midlle ware to connect frontend with api for summarizer 
 * creates all dependencies and endpoints
 * Author: Lena Arafa
 * Date: 9/24/2017
 */

//List dependencies
const express = require('express');
const app = express();
const parseurl = require('parseurl');
const bodyparser = require('body-parser');
const path = require('path');
//const expressValidator = require('express-validator');
const request = require('request');

//add dependencies for database
//setup database

//parse application/JSON
app.use(bodyparser.json());

//User endpoint
//Forget passowrd mailto endpoint

app.get('/mocktext', function(req, res) {
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
    request.post(options, function(error, response, body){
        res.send(JSON.parse(body));
    })
})

//Text endpoint; text sumbitted by user is handled here
//It is then sent to the summarizer api and the data received
//is sent back to the user
app.post('/sumarizertext', function(req, res){
    //url subject to change once api is created
    var summarizerApi = "https://ir.thirty2k.com/summarizeTEST";
    var options = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    }

    //send the text received from user to api of summarizer
    //get for testing reasons, use post when using summarizer api url
    request.get(summarizerApi, options, function(error, response, body) {
        //recives data from summarizerAPI
        //sends it back to the summarizertext endpoint which would be the
        //body response to any request that posts a request to it
        //uses json to send a stringfied json object of the non-object data from api
        res.json(body);
    })   
})

//another request to get the saved version from the user of the summarizer text
//and send it to db
app.post('/savetodb', function(req, res) {
    //sends to db 
})

app.listen('8000');
console.log('Listening on port ' + 8000 + '...');





